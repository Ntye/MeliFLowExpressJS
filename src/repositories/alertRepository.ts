import { Op } from 'sequelize';
import { AlertRule, AlertRuleCreationAttributes } from '../models/AlertRule';
import { Alert, AlertCreationAttributes } from '../models/TriggeredAlert';
import { Ruche } from '../models/Ruche';

export class AlertRepository {
  async createRule(data: AlertRuleCreationAttributes): Promise<AlertRule> {
    return await AlertRule.create(data);
  }

  async findAllRules(filters?: {
    rucheId?: number;
    active?: boolean;
  }): Promise<AlertRule[]> {
    const where: any = {};

    if (filters?.rucheId) where.rucheId = filters.rucheId;
    if (filters?.active !== undefined) where.active = filters.active;

    return await AlertRule.findAll({
      where,
      include: [{ model: Ruche, as: 'ruche', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
  }

  async findRuleById(id: number): Promise<AlertRule | null> {
    return await AlertRule.findByPk(id, {
      include: [{ model: Ruche, as: 'ruche', attributes: ['id', 'name'] }],
    });
  }

  async updateRule(
    id: number,
    data: Partial<AlertRuleCreationAttributes>
  ): Promise<AlertRule | null> {
    const rule = await AlertRule.findByPk(id);
    if (!rule) return null;

    await rule.update(data);
    return rule;
  }

  async deleteRule(id: number): Promise<boolean> {
    const result = await AlertRule.destroy({ where: { id } });
    return result > 0;
  }

  async createAlert(data: AlertCreationAttributes): Promise<Alert> {
    return await Alert.create(data);
  }

  async findAlerts(filters?: {
    rucheId?: number;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Alert[]> {
    const where: any = {};

    if (filters?.rucheId) where.rucheId = filters.rucheId;

    if (filters?.startDate || filters?.endDate) {
      where.triggeredAt = {};
      if (filters.startDate) where.triggeredAt[Op.gte] = filters.startDate;
      if (filters.endDate) where.triggeredAt[Op.lte] = filters.endDate;
    }

    return await Alert.findAll({
      where,
      include: [
        {
          model: AlertRule,
          as: 'alertRule',
          attributes: ['id', 'ruleType', 'params'],
        },
        {
          model: Ruche,
          as: 'ruche',
          attributes: ['id', 'name'],
        },
      ],
      order: [['triggeredAt', 'DESC']],
    });
  }

  async findAlertById(id: number): Promise<Alert | null> {
    return await Alert.findByPk(id, {
      include: [
        {
          model: AlertRule,
          as: 'alertRule',
          attributes: ['id', 'ruleType', 'params'],
        },
        {
          model: Ruche,
          as: 'ruche',
          attributes: ['id', 'name', 'queenInfo'],
        },
      ],
    });
  }

  async getActiveRulesForRuche(rucheId: number): Promise<AlertRule[]> {
    return await AlertRule.findAll({
      where: {
        rucheId,
        active: true,
      },
    });
  }
}
