import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

/**
 * Measurement attributes interface
 */
export interface MeasurementAttributes {
  id: string;
  ruche_id: string;
  weight?: number | null;
  temperature?: number | null;
  humidity?: number | null;
  battery_level?: number | null;
  timestamp: Date;
  createdAt?: Date;
}

/**
 * Measurement creation attributes
 */
export interface MeasurementCreationAttributes
  extends Optional<MeasurementAttributes, 'id' | 'timestamp'> {}

/**
 * Measurement model class
 */
class Measurement
  extends Model<MeasurementAttributes, MeasurementCreationAttributes>
  implements MeasurementAttributes
{
  public id!: string;
  public ruche_id!: string;
  public weight!: number | null;
  public temperature!: number | null;
  public humidity!: number | null;
  public battery_level!: number | null;
  public timestamp!: Date;
  public readonly createdAt!: Date;
}

/**
 * Initialize Measurement model
 */
Measurement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ruche_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ruches',
        key: 'id',
      },
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    temperature: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    humidity: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    battery_level: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'measurements',
    timestamps: true,
    underscored: true,
    updatedAt: false,
  }
);

export default Measurement;
