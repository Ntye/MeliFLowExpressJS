import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface RucheAttributes {
  id: number;
  name: string;
  rucherId?: number;
  queenInfo?: string;
  geom?: any; // PostGIS Point geometry
  active: boolean;
  createdAt?: Date;
}

interface RucheCreationAttributes extends Optional<
  RucheAttributes,
  'id' | 'active' | 'createdAt'
> {}

class Ruche extends Model<RucheAttributes, RucheCreationAttributes> implements RucheAttributes {
  public id!: number;
  public name!: string;
  public rucherId?: number;
  public queenInfo?: string;
  public geom?: any;
  public active!: boolean;
  public readonly createdAt!: Date;
}

Ruche.init(
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
    queenInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'queen_info',
    },
    geom: {
      type: DataTypes.GEOMETRY('POINT', 4326),
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
    tableName: 'ruches',
    timestamps: false,
    indexes: [
      {
        fields: ['rucher_id'],
      },
      {
        fields: ['name'],
        name: 'idx_ruches_name',
      },
    ],
  }
);

export { Ruche, RucheAttributes, RucheCreationAttributes };
