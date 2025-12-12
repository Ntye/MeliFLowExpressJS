import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

/**
 * AlertRule attributes interface
 */
export interface AlertRuleAttributes {
  id: string;
  name: string;
  description?: string | null;
  ruche_id?: string | null;
  rucher_id?: string | null;
  metric: string;
  operator: string;
  threshold: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * AlertRule creation attributes
 */
export interface AlertRuleCreationAttributes extends Optional<AlertRuleAttributes, 'id' | 'active'> {}

/**
 * AlertRule model class
 */
class AlertRule
  extends Model<AlertRuleAttributes, AlertRuleCreationAttributes>
  implements AlertRuleAttributes
{
  public id!: string;
  public name!: string;
  public description!: string | null;
  public ruche_id!: string | null;
  public rucher_id!: string | null;
  public metric!: string;
  public operator!: string;
  public threshold!: number;
  public active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * Initialize AlertRule model
 */
AlertRule.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ruche_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'ruches',
        key: 'id',
      },
    },
    rucher_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'ruchers',
        key: 'id',
      },
    },
    metric: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    operator: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    threshold: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'alert_rules',
    timestamps: true,
    underscored: true,
  }
);

export default AlertRule;
