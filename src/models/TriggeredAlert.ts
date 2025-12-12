import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface AlertAttributes {
  id: number;
  ruleId?: number;
  rucheId?: number;
  triggeredAt: Date;
  payload?: any; // JSONB
  sentWhatsapp: boolean;
}

interface AlertCreationAttributes extends Optional<
  AlertAttributes,
  'id' | 'triggeredAt' | 'sentWhatsapp'
> {}

class Alert
  extends Model<AlertAttributes, AlertCreationAttributes>
  implements AlertAttributes
{
  public id!: number;
  public ruleId?: number;
  public rucheId?: number;
  public triggeredAt!: Date;
  public payload?: any;
  public sentWhatsapp!: boolean;
}

Alert.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    ruleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'rule_id',
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
    triggeredAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'triggered_at',
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    sentWhatsapp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'sent_whatsapp',
    },
  },
  {
    sequelize,
    tableName: 'alerts',
    timestamps: false,
    indexes: [
      {
        fields: ['ruche_id'],
        name: 'idx_alerts_ruche',
      },
    ],
  }
);

// Keep old export name for backward compatibility temporarily
export { Alert, Alert as TriggeredAlert, AlertAttributes, AlertAttributes as TriggeredAlertAttributes, AlertCreationAttributes, AlertCreationAttributes as TriggeredAlertCreationAttributes };
