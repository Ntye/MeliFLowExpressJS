import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

/**
 * User attributes interface
 */
export interface UserAttributes {
  id: string;
  username: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User creation attributes (id is optional as it's auto-generated)
 */
export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

/**
 * User model class
 */
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public username!: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * Initialize User model
 */
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);

export default User;
