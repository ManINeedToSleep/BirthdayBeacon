import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  // Change to class-based definition
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Friends, {
        foreignKey: 'userId',
        as: 'friends'
      });
    }
  }

  // Change to User.init() pattern
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
      timestamps: false,
      underscored: true
    }
  );

  return User;
};