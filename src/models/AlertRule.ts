import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface AlertRuleAttributes {
  id: number;
  name: string;
  rucheId?: number;
  rucherId?: number;
  alertType: 'weight' | 'temperature' | 'humidity' | 'variation';
  condition: 'greater_than' | 'less_than' | 'equals' | 'between';
  threshold?: number;
  thresholdMin?: number;
  thresholdMax?: number;
  enabled: boolean;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AlertRuleCreationAttributes extends Optional<
  AlertRuleAttributes,
  'id' | 'enabled' | 'createdAt' | 'updatedAt'
> {}

class AlertRule
  extends Model<AlertRuleAttributes, AlertRuleCreationAttributes>
  implements AlertRuleAttributes
{
  public id!: number;
  public name!: string;
  public rucheId?: number;
  public rucherId?: number;
  public alertType!: 'weight' | 'temperature' | 'humidity' | 'variation';
  public condition!: 'greater_than' | 'less_than' | 'equals' | 'between';
  public threshold?: number;
  public thresholdMin?: number;
  public thresholdMax?: number;
  public enabled!: boolean;
  public userId?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AlertRule.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    rucherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'rucher_id',
      references: {
        model: 'ruchers',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    alertType: {
      type: DataTypes.ENUM('weight', 'temperature', 'humidity', 'variation'),
      allowNull: false,
      field: 'alert_type',
    },
    condition: {
      type: DataTypes.ENUM('greater_than', 'less_than', 'equals', 'between'),
      allowNull: false,
    },
    threshold: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    thresholdMin: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'threshold_min',
    },
    thresholdMax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'threshold_max',
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
  },
  {
    sequelize,
    tableName: 'alert_rules',
    timestamps: true,
    indexes: [
      {
        fields: ['ruche_id'],
      },
      {
        fields: ['rucher_id'],
      },
      {
        fields: ['enabled'],
      },
      {
        fields: ['user_id'],
      },
    ],
  }
);

export { AlertRule, AlertRuleAttributes, AlertRuleCreationAttributes };
