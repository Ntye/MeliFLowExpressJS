import { AlertRule, AlertRuleCreationAttributes } from '../models/AlertRule';
import { TriggeredAlert, TriggeredAlertCreationAttributes } from '../models/TriggeredAlert';
import { Ruche } from '../models/Ruche';
import { Measurement } from '../models/Measurement';

export class AlertRepository {
  async createRule(data: AlertRuleCreationAttributes): Promise<AlertRule> {
    return await AlertRule.create(data);
  }

  async findAllRules(filters?: {
    rucheId?: number;
    rucherId?: number;
    enabled?: boolean;
    userId?: number;
  }): Promise<AlertRule[]> {
    const where: any = {};
    
    if (filters?.rucheId) where.rucheId = filters.rucheId;
    if (filters?.rucherId) where.rucherId = filters.rucherId;
    if (filters?.enabled !== undefined) where.enabled = filters.enabled;
    if (filters?.userId) where.userId = filters.userId;

    return await AlertRule.findAll({
      where,
      include: [
        { model: Ruche, as: 'ruche', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findRuleById(id: number): Promise<AlertRule | null> {
    return await AlertRule.findByPk(id, {
      include: [
        { model: Ruche, as: 'ruche', attributes: ['id', 'name'] },
      ],
    });
  }

  async updateRule(id: number, data: Partial<AlertRuleCreationAttributes>): Promise<AlertRule | null> {
    const rule = await AlertRule.findByPk(id);
    if (!rule) return null;
    
    await rule.update(data);
    return rule;
  }

  async deleteRule(id: number): Promise<boolean> {
    const result = await AlertRule.destroy({ where: { id } });
    return result > 0;
  }

  async createTriggeredAlert(data: TriggeredAlertCreationAttributes): Promise<TriggeredAlert> {
    return await TriggeredAlert.create(data);
  }

  async findTriggeredAlerts(filters?: {
    rucheId?: number;
    acknowledged?: boolean;
    startDate?: Date;
    endDate?: Date;
  }): Promise<TriggeredAlert[]> {
    const where: any = {};
    
    if (filters?.rucheId) where.rucheId = filters.rucheId;
    if (filters?.acknowledged !== undefined) where.acknowledged = filters.acknowledged;
    
    if (filters?.startDate || filters?.endDate) {
      where.triggeredAt = {};
      if (filters.startDate) where.triggeredAt.gte = filters.startDate;
      if (filters.endDate) where.triggeredAt.lte = filters.endDate;
    }

    return await TriggeredAlert.findAll({
      where,
      include: [
        {
          model: AlertRule,
          as: 'alertRule',
          attributes: ['id', 'name', 'alertType', 'condition'],
        },
        {
          model: Ruche,
          as: 'ruche',
          attributes: ['id', 'name'],
        },
        {
          model: Measurement,
          as: 'measurement',
          attributes: ['id', 'timestamp', 'weight', 'temperature', 'humidity'],
        },
      ],
      order: [['triggeredAt', 'DESC']],
    });
  }

  async findTriggeredAlertById(id: number): Promise<TriggeredAlert | null> {
    return await TriggeredAlert.findByPk(id, {
      include: [
        {
          model: AlertRule,
          as: 'alertRule',
          attributes: ['id', 'name', 'alertType', 'condition', 'threshold'],
        },
        {
          model: Ruche,
          as: 'ruche',
          attributes: ['id', 'name', 'location'],
        },
        {
          model: Measurement,
          as: 'measurement',
          attributes: ['id', 'timestamp', 'weight', 'temperature', 'humidity'],
        },
      ],
    });
  }

  async acknowledgeAlert(id: number): Promise<TriggeredAlert | null> {
    const alert = await TriggeredAlert.findByPk(id);
    if (!alert) return null;
    
    await alert.update({
      acknowledged: true,
      acknowledgedAt: new Date(),
    });
    
    return alert;
  }

  async getActiveRulesForRuche(rucheId: number): Promise<AlertRule[]> {
    return await AlertRule.findAll({
      where: {
        rucheId,
        enabled: true,
      },
    });
  }
}
