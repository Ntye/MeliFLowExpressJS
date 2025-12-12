import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

/**
 * Alert (TriggeredAlert) attributes interface
 */
export interface AlertAttributes {
  id: string;
  alert_rule_id: string;
  ruche_id?: string | null;
  measurement_id?: string | null;
  message: string;
  severity: string;
  resolved: boolean;
  resolved_at?: Date | null;
  createdAt?: Date;
}

/**
 * Alert creation attributes
 */
export interface AlertCreationAttributes
  extends Optional<AlertAttributes, 'id' | 'severity' | 'resolved'> {}

/**
 * Alert model class
 */
class Alert extends Model<AlertAttributes, AlertCreationAttributes> implements AlertAttributes {
  public id!: string;
  public alert_rule_id!: string;
  public ruche_id!: string | null;
  public measurement_id!: string | null;
  public message!: string;
  public severity!: string;
  public resolved!: boolean;
  public resolved_at!: Date | null;
  public readonly createdAt!: Date;
}

/**
 * Initialize Alert model
 */
Alert.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    alert_rule_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'alert_rules',
        key: 'id',
      },
    },
    ruche_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'ruches',
        key: 'id',
      },
    },
    measurement_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'measurements',
        key: 'id',
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    severity: {
      type: DataTypes.STRING(50),
      defaultValue: 'info',
      allowNull: false,
    },
    resolved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'alerts',
    timestamps: true,
    underscored: true,
    updatedAt: false,
  }
);

export default Alert;
