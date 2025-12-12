import { AlertRepository } from '../repositories/alertRepository';
import { AlertRuleCreationAttributes } from '../models/AlertRule';
import { Measurement } from '../models/Measurement';
import { alertWebSocket } from '../websocket/alertNotificationHandler';

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
    active?: boolean;
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

  async getAlerts(filters?: {
    rucheId?: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    return await this.alertRepository.findAlerts(filters);
  }

  async getAlertById(id: number) {
    const alert = await this.alertRepository.findAlertById(id);
    if (!alert) {
      throw new Error('Alert not found');
    }
    return alert;
  }

  async evaluateAlertsForMeasurement(measurement: Measurement) {
    const rules = await this.alertRepository.getActiveRulesForRuche(measurement.rucheId);

    for (const rule of rules) {
      const triggered = this.evaluateRuleWithParams(rule, measurement);

      if (triggered) {
        const payload = this.generateAlertPayload(rule, measurement);

        const alert = await this.alertRepository.createAlert({
          ruleId: rule.id,
          rucheId: measurement.rucheId,
          payload,
          triggeredAt: new Date(),
        });

        // Send WebSocket notification
        alertWebSocket.broadcast({
          type: 'alert_triggered',
          alert,
          rule,
          measurement,
        });
      }
    }
  }

  private evaluateRuleWithParams(rule: any, measurement: Measurement): boolean {
    const { ruleType, params } = rule;

    switch (ruleType) {
      case 'weight_threshold':
        return this.evaluateWeightThreshold(measurement, params);
      case 'temperature_anomaly':
        return this.evaluateTemperatureAnomaly(measurement, params);
      case 'humidity_alert':
        return this.evaluateHumidityAlert(measurement, params);
      default:
        return false;
    }
  }

  private evaluateWeightThreshold(measurement: Measurement, params: any): boolean {
    if (!measurement.weight || !params.min_weight || !params.max_weight) return false;
    const weight = parseFloat(measurement.weight.toString());
    return weight < params.min_weight || weight > params.max_weight;
  }

  private evaluateTemperatureAnomaly(measurement: Measurement, params: any): boolean {
    if (!measurement.temperature || !params.min_temp || !params.max_temp) return false;
    const temp = parseFloat(measurement.temperature.toString());
    return temp < params.min_temp || temp > params.max_temp;
  }

  private evaluateHumidityAlert(measurement: Measurement, params: any): boolean {
    if (!measurement.humidity || !params.min_humidity || !params.max_humidity) return false;
    const humidity = parseFloat(measurement.humidity.toString());
    return humidity < params.min_humidity || humidity > params.max_humidity;
  }

  private generateAlertPayload(rule: any, measurement: Measurement): any {
    const { ruleType, params } = rule;
    const payload: any = { rule_type: ruleType };

    switch (ruleType) {
      case 'weight_threshold':
        payload.message = 'Weight threshold exceeded';
        payload.current_weight = measurement.weight ? parseFloat(measurement.weight.toString()) : null;
        payload.thresholds = { min: params.min_weight, max: params.max_weight };
        break;
      case 'temperature_anomaly':
        payload.message = 'Temperature anomaly detected';
        payload.current_temp = measurement.temperature ? parseFloat(measurement.temperature.toString()) : null;
        payload.thresholds = { min: params.min_temp, max: params.max_temp };
        break;
      case 'humidity_alert':
        payload.message = 'Humidity alert';
        payload.current_humidity = measurement.humidity ? parseFloat(measurement.humidity.toString()) : null;
        payload.thresholds = { min: params.min_humidity, max: params.max_humidity };
        break;
      default:
        payload.message = 'Alert triggered';
    }

    payload.recorded_at = measurement.recordedAt;
    return payload;
  }

  async testAlertRule(ruleId: number) {
    const rule = await this.getAlertRuleById(ruleId);
    return {
      rule,
      message: 'Alert rule is valid and active',
      status: rule.active ? 'active' : 'inactive',
    };
  }
}
