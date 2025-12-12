import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface AlertRuleAttributes {
  id: number;
  rucheId?: number;
  ruleType: string;
  params: any; // JSONB
  notifyInApp: boolean;
  notifyWhatsapp: boolean;
  whatsappNumber?: string;
  active: boolean;
  createdAt?: Date;
}

interface AlertRuleCreationAttributes extends Optional<
  AlertRuleAttributes,
  'id' | 'notifyInApp' | 'notifyWhatsapp' | 'active' | 'createdAt'
> {}

class AlertRule
  extends Model<AlertRuleAttributes, AlertRuleCreationAttributes>
  implements AlertRuleAttributes
{
  public id!: number;
  public rucheId?: number;
  public ruleType!: string;
  public params!: any;
  public notifyInApp!: boolean;
  public notifyWhatsapp!: boolean;
  public whatsappNumber?: string;
  public active!: boolean;
  public readonly createdAt!: Date;
}

AlertRule.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rucheId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'ruche_id',
      references: {
        model: 'ruches',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    ruleType: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'rule_type',
    },
    params: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    notifyInApp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'notify_in_app',
    },
    notifyWhatsapp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'notify_whatsapp',
    },
    whatsappNumber: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'whatsapp_number',
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  },
  {
    sequelize,
    tableName: 'alert_rules',
    timestamps: false,
    indexes: [
      {
        fields: ['ruche_id'],
        name: 'idx_alert_rules_ruche',
      },
    ],
  }
);

export { AlertRule, AlertRuleAttributes, AlertRuleCreationAttributes };
