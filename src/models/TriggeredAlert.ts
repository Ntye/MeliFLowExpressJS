import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface TriggeredAlertAttributes {
  id: number;
  alertRuleId: number;
  rucheId?: number;
  measurementId?: number;
  message: string;
  value?: number;
  triggeredAt: Date;
  acknowledged: boolean;
  acknowledgedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TriggeredAlertCreationAttributes extends Optional<TriggeredAlertAttributes, 'id' | 'acknowledged' | 'createdAt' | 'updatedAt'> {}

class TriggeredAlert extends Model<TriggeredAlertAttributes, TriggeredAlertCreationAttributes> implements TriggeredAlertAttributes {
  public id!: number;
  public alertRuleId!: number;
  public rucheId?: number;
  public measurementId?: number;
  public message!: string;
  public value?: number;
  public triggeredAt!: Date;
  public acknowledged!: boolean;
  public acknowledgedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TriggeredAlert.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    alertRuleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'alert_rule_id',
      references: {
        model: 'alert_rules',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    measurementId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'measurement_id',
      references: {
        model: 'measurements',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    triggeredAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'triggered_at',
      defaultValue: DataTypes.NOW,
    },
    acknowledged: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    acknowledgedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'acknowledged_at',
    },
  },
  {
    sequelize,
    tableName: 'triggered_alerts',
    timestamps: true,
    indexes: [
      {
        fields: ['alert_rule_id'],
      },
      {
        fields: ['ruche_id'],
      },
      {
        fields: ['triggered_at'],
      },
      {
        fields: ['acknowledged'],
      },
    ],
  }
);

export { TriggeredAlert, TriggeredAlertAttributes, TriggeredAlertCreationAttributes };
