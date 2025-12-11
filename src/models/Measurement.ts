import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface MeasurementAttributes {
  id: number;
  rucheId: number;
  weight?: number;
  temperature?: number;
  humidity?: number;
  signalStrength?: number;
  batteryLevel?: number;
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MeasurementCreationAttributes extends Optional<MeasurementAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Measurement extends Model<MeasurementAttributes, MeasurementCreationAttributes> implements MeasurementAttributes {
  public id!: number;
  public rucheId!: number;
  public weight?: number;
  public temperature?: number;
  public humidity?: number;
  public signalStrength?: number;
  public batteryLevel?: number;
  public timestamp!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Measurement.init(
  {
    id: {
      type: DataTypes.INTEGER,
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
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Weight in kilograms',
    },
    temperature: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Temperature in Celsius',
    },
    humidity: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Humidity percentage',
    },
    signalStrength: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'signal_strength',
      comment: 'Signal strength in dBm',
    },
    batteryLevel: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'battery_level',
      comment: 'Battery level percentage',
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
    indexes: [
      {
        fields: ['ruche_id', 'timestamp'],
      },
      {
        fields: ['timestamp'],
      },
    ],
  }
);

export { Measurement, MeasurementAttributes, MeasurementCreationAttributes };
