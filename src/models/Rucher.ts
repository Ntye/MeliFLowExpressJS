import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface RucherAttributes {
  id: number;
  name: string;
  description?: string;
  geom?: any; // PostGIS Polygon geometry
  active: boolean;
  createdAt?: Date;
}

interface RucherCreationAttributes extends Optional<
  RucherAttributes,
  'id' | 'active' | 'createdAt'
> {}

class Rucher extends Model<RucherAttributes, RucherCreationAttributes> implements RucherAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public geom?: any;
  public active!: boolean;
  public readonly createdAt!: Date;
}

Rucher.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    geom: {
      type: DataTypes.GEOMETRY('POLYGON', 4326),
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  },
  {
    sequelize,
    tableName: 'ruchers',
    timestamps: false,
    indexes: [
      {
        fields: ['name'],
        name: 'idx_ruchers_name',
      },
    ],
  }
);

export { Rucher, RucherAttributes, RucherCreationAttributes };
