import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Birthday = sequelize.define('Birthday', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    friendId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    reminderDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 7
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('upcoming', 'birthday', 'passed'),
      defaultValue: 'upcoming'
    }
  }, {
    timestamps: true
  });

  Birthday.associate = (models) => {
    Birthday.belongsTo(models.Friends, {
      foreignKey: 'friendId',
      as: 'friend'
    });
  };

  return Birthday;
};