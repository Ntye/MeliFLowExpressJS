import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

/**
 * Rucher (Apiary) attributes interface
 */
export interface RucherAttributes {
  id: string;
  name: string;
  description?: string | null;
  location: any; // PostGIS Polygon geometry
  user_id?: string | null;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Rucher creation attributes
 */
export interface RucherCreationAttributes extends Optional<RucherAttributes, 'id' | 'active'> {}

/**
 * Rucher model class
 */
class Rucher extends Model<RucherAttributes, RucherCreationAttributes> implements RucherAttributes {
  public id!: string;
  public name!: string;
  public description!: string | null;
  public location!: any;
  public user_id!: string | null;
  public active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * Initialize Rucher model
 */
Rucher.init(
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
      type: DataTypes.GEOMETRY('POLYGON', 4326),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'ruchers',
    timestamps: true,
    underscored: true,
  }
);

export default Rucher;
