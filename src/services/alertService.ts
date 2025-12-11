import { AlertRepository } from '../repositories/alertRepository';
import { AlertRuleCreationAttributes } from '../models/AlertRule';
import { Measurement } from '../models/Measurement';
import { alertWebSocket } from '../websocket/alertNotificationHandler';

const FLOATING_POINT_EPSILON = 0.01;

export class AlertService {
  private alertRepository: AlertRepository;

  constructor() {
    this.alertRepository = new AlertRepository();
  }

  async createAlertRule(data: AlertRuleCreationAttributes) {
    return await this.alertRepository.createRule(data);
  }

  async getAllAlertRules(filters?: {
    rucheId?: number;
    rucherId?: number;
    enabled?: boolean;
    userId?: number;
  }) {
    return await this.alertRepository.findAllRules(filters);
  }

  async getAlertRuleById(id: number) {
    const rule = await this.alertRepository.findRuleById(id);
    if (!rule) {
      throw new Error('Alert rule not found');
    }
    return rule;
  }

  async updateAlertRule(id: number, data: Partial<AlertRuleCreationAttributes>) {
    const rule = await this.alertRepository.updateRule(id, data);
    if (!rule) {
      throw new Error('Alert rule not found');
    }
    return rule;
  }

  async deleteAlertRule(id: number) {
    const deleted = await this.alertRepository.deleteRule(id);
    if (!deleted) {
      throw new Error('Alert rule not found');
    }
    return { message: 'Alert rule deleted successfully' };
  }

  async getTriggeredAlerts(filters?: {
    rucheId?: number;
    acknowledged?: boolean;
    startDate?: Date;
    endDate?: Date;
  }) {
    return await this.alertRepository.findTriggeredAlerts(filters);
  }

  async getTriggeredAlertById(id: number) {
    const alert = await this.alertRepository.findTriggeredAlertById(id);
    if (!alert) {
      throw new Error('Triggered alert not found');
    }
    return alert;
  }

  async acknowledgeAlert(id: number) {
    const alert = await this.alertRepository.acknowledgeAlert(id);
    if (!alert) {
      throw new Error('Triggered alert not found');
    }
    return alert;
  }

  async evaluateAlertsForMeasurement(measurement: Measurement) {
    const rules = await this.alertRepository.getActiveRulesForRuche(measurement.rucheId);

    for (const rule of rules) {
      const triggered = this.evaluateRule(rule, measurement);

      if (triggered) {
        const message = this.generateAlertMessage(rule, measurement);
        const value = this.getValueForAlertType(rule.alertType, measurement);

        const triggeredAlert = await this.alertRepository.createTriggeredAlert({
          alertRuleId: rule.id,
          rucheId: measurement.rucheId,
          measurementId: measurement.id,
          message,
          value: value ?? undefined,
          triggeredAt: new Date(),
        });

        // Send WebSocket notification
        alertWebSocket.broadcast({
          type: 'alert_triggered',
          alert: triggeredAlert,
          rule,
          measurement,
        });
      }
    }
  }

  private evaluateRule(rule: any, measurement: Measurement): boolean {
    const value = this.getValueForAlertType(rule.alertType, measurement);

    if (value === null || value === undefined) {
      return false;
    }

    switch (rule.condition) {
      case 'greater_than':
        return rule.threshold !== null && value > rule.threshold;

      case 'less_than':
        return rule.threshold !== null && value < rule.threshold;

      case 'equals':
        return rule.threshold !== null && Math.abs(value - rule.threshold) < FLOATING_POINT_EPSILON;

      case 'between':
        return (
          rule.thresholdMin !== null &&
          rule.thresholdMax !== null &&
          value >= rule.thresholdMin &&
          value <= rule.thresholdMax
        );

      default:
        return false;
    }
  }

  private parseDecimalValue(value: any): number | null {
    if (value === null || value === undefined) return null;
    return parseFloat(value.toString());
  }

  private getValueForAlertType(alertType: string, measurement: Measurement): number | null {
    switch (alertType) {
      case 'weight':
        return this.parseDecimalValue(measurement.weight);

      case 'temperature':
        return this.parseDecimalValue(measurement.temperature);

      case 'humidity':
        return this.parseDecimalValue(measurement.humidity);

      default:
        return null;
    }
  }

  private generateAlertMessage(rule: any, measurement: Measurement): string {
    const value = this.getValueForAlertType(rule.alertType, measurement);
    const unit = this.getUnitForAlertType(rule.alertType);

    switch (rule.condition) {
      case 'greater_than':
        return `${rule.name}: ${rule.alertType} (${value}${unit}) is greater than threshold (${rule.threshold}${unit})`;

      case 'less_than':
        return `${rule.name}: ${rule.alertType} (${value}${unit}) is less than threshold (${rule.threshold}${unit})`;

      case 'equals':
        return `${rule.name}: ${rule.alertType} (${value}${unit}) equals threshold (${rule.threshold}${unit})`;

      case 'between':
        return `${rule.name}: ${rule.alertType} (${value}${unit}) is between ${rule.thresholdMin}${unit} and ${rule.thresholdMax}${unit}`;

      default:
        return `${rule.name}: Alert triggered`;
    }
  }

  private getUnitForAlertType(alertType: string): string {
    switch (alertType) {
      case 'weight':
        return 'kg';
      case 'temperature':
        return '°C';
      case 'humidity':
        return '%';
      default:
        return '';
    }
  }

  async testAlertRule(ruleId: number) {
    const rule = await this.getAlertRuleById(ruleId);
    return {
      rule,
      message: 'Alert rule is valid and active',
      status: rule.enabled ? 'enabled' : 'disabled',
    };
  }
}
