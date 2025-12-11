import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface RucherAttributes {
  id: number;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RucherCreationAttributes extends Optional<
  RucherAttributes,
  'id' | 'createdAt' | 'updatedAt'
> {}

class Rucher extends Model<RucherAttributes, RucherCreationAttributes> implements RucherAttributes {
  public id!: number;
  public name!: string;
  public location!: string;
  public latitude?: number;
  public longitude?: number;
  public description?: string;
  public userId?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Rucher.init(
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
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
  },
  {
    sequelize,
    tableName: 'ruchers',
    timestamps: true,
    indexes: [
      {
        fields: ['user_id'],
      },
    ],
  }
);

export { Rucher, RucherAttributes, RucherCreationAttributes };
