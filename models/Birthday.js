import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Birthday extends Model {}

  Birthday.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    relationship: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reminderDays: {
      type: DataTypes.INTEGER,
      defaultValue: 7
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Birthday',
    tableName: 'birthdays',
    timestamps: true,
    underscored: true
  });

  return Birthday;
};