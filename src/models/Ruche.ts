import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface RucheAttributes {
  id: number;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  hiveType?: string;
  installationDate?: Date;
  status?: 'active' | 'inactive' | 'maintenance';
  userId?: number;
  rucherId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RucheCreationAttributes extends Optional<RucheAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Ruche extends Model<RucheAttributes, RucheCreationAttributes> implements RucheAttributes {
  public id!: number;
  public name!: string;
  public location!: string;
  public latitude?: number;
  public longitude?: number;
  public description?: string;
  public hiveType?: string;
  public installationDate?: Date;
  public status?: 'active' | 'inactive' | 'maintenance';
  public userId?: number;
  public rucherId?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Ruche.init(
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
    hiveType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'hive_type',
    },
    installationDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'installation_date',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
      allowNull: true,
      defaultValue: 'active',
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
    rucherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'rucher_id',
      references: {
        model: 'ruchers',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
  },
  {
    sequelize,
    tableName: 'ruches',
    timestamps: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['rucher_id'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

export { Ruche, RucheAttributes, RucheCreationAttributes };
