import { AlertRule, Alert } from '../models';
import { MeasurementAttributes } from '../models/Measurement';
import logger from '../utils/logger';

/**
 * Service for alert evaluation and management
 */
export class AlertService {
  /**
   * Evaluate alerts for a new measurement
   */
  async evaluateAlertsForMeasurement(measurement: MeasurementAttributes): Promise<void> {
    try {
      // Get all active alert rules for this ruche
      const alertRules = await AlertRule.findAll({
        where: {
          ruche_id: measurement.ruche_id,
          active: true,
        },
      });

      for (const rule of alertRules) {
        const shouldTrigger = this.evaluateRule(rule, measurement);

        if (shouldTrigger) {
          await this.createAlert(rule, measurement);
        }
      }
    } catch (error) {
      logger.error('Error evaluating alerts for measurement:', error);
    }
  }

  /**
   * Evaluate a single alert rule against a measurement
   */
  private evaluateRule(rule: AlertRule, measurement: MeasurementAttributes): boolean {
    const metricValue = this.getMeasurementValue(measurement, rule.metric);

    if (metricValue === null || metricValue === undefined) {
      return false;
    }

    switch (rule.operator) {
      case '>':
        return metricValue > rule.threshold;
      case '<':
        return metricValue < rule.threshold;
      case '>=':
        return metricValue >= rule.threshold;
      case '<=':
        return metricValue <= rule.threshold;
      case '==':
        return metricValue === rule.threshold;
      case '!=':
        return metricValue !== rule.threshold;
      default:
        return false;
    }
  }

  /**
   * Get measurement value by metric name
   */
  private getMeasurementValue(measurement: MeasurementAttributes, metric: string): number | null {
    switch (metric) {
      case 'weight':
        return measurement.weight ?? null;
      case 'temperature':
        return measurement.temperature ?? null;
      case 'humidity':
        return measurement.humidity ?? null;
      case 'battery_level':
        return measurement.battery_level ?? null;
      default:
        return null;
    }
  }

  /**
   * Create a new alert
   */
  private async createAlert(
    rule: AlertRule,
    measurement: MeasurementAttributes
  ): Promise<Alert> {
    const metricValue = this.getMeasurementValue(measurement, rule.metric);

    const message = `Alert: ${rule.name} - ${rule.metric} ${rule.operator} ${rule.threshold} (current: ${metricValue})`;

    const severity = this.determineSeverity(rule.metric, metricValue, rule.threshold);

    return await Alert.create({
      alert_rule_id: rule.id,
      ruche_id: measurement.ruche_id,
      measurement_id: measurement.id,
      message,
      severity,
      resolved: false,
    });
  }

  /**
   * Determine alert severity based on metric and values
   */
  private determineSeverity(metric: string, value: number | null, threshold: number): string {
    if (value === null) return 'info';

    const difference = Math.abs(value - threshold);
    const percentageDiff = (difference / threshold) * 100;

    if (metric === 'battery_level' && value < 20) {
      return 'critical';
    }

    if (percentageDiff > 50) {
      return 'critical';
    } else if (percentageDiff > 25) {
      return 'warning';
    } else {
      return 'info';
    }
  }
}

export default new AlertService();
