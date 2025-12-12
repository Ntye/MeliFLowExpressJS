import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

/**
 * Ruche (Hive) attributes interface
 */
export interface RucheAttributes {
  id: string;
  name: string;
  description?: string | null;
  location: any; // PostGIS Point geometry
  rucher_id?: string | null;
  hive_type?: string | null;
  installation_date?: Date | null;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Ruche creation attributes
 */
export interface RucheCreationAttributes extends Optional<RucheAttributes, 'id' | 'active'> {}

/**
 * Ruche model class
 */
class Ruche extends Model<RucheAttributes, RucheCreationAttributes> implements RucheAttributes {
  public id!: string;
  public name!: string;
  public description!: string | null;
  public location!: any;
  public rucher_id!: string | null;
  public hive_type!: string | null;
  public installation_date!: Date | null;
  public active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * Initialize Ruche model
 */
Ruche.init(
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
    location: {
      type: DataTypes.GEOMETRY('POINT', 4326),
      allowNull: false,
    },
    rucher_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'ruchers',
        key: 'id',
      },
    },
    hive_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    installation_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'ruches',
    timestamps: true,
    underscored: true,
  }
);

export default Ruche;
