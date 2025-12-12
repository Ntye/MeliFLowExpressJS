import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface MeasurementAttributes {
  id: number;
  rucheId: number;
  recordedAt: Date;
  weight?: number;
  temperature?: number;
  humidity?: number;
  signal?: number;
  raw?: any; // JSONB
}

interface MeasurementCreationAttributes extends Optional<
  MeasurementAttributes,
  'id' | 'recordedAt'
> {}

class Measurement
  extends Model<MeasurementAttributes, MeasurementCreationAttributes>
  implements MeasurementAttributes
{
  public id!: number;
  public rucheId!: number;
  public recordedAt!: Date;
  public weight?: number;
  public temperature?: number;
  public humidity?: number;
  public signal?: number;
  public raw?: any;
}

Measurement.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    rucheId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'ruche_id',
      references: {
        model: 'ruches',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    recordedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'recorded_at',
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
    signal: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    raw: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'measurements',
    timestamps: false,
    indexes: [
      {
        fields: ['ruche_id'],
        name: 'idx_measurements_ruche',
      },
      {
        fields: ['recorded_at'],
        name: 'idx_measurements_recorded',
      },
    ],
  }
);

export { Measurement, MeasurementAttributes, MeasurementCreationAttributes };
