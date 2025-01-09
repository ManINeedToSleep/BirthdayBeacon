import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Friends = sequelize.define('Friends', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    friendId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    giftIdeas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reminderEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    status: {
      type: DataTypes.ENUM('upcoming', 'birthday', 'passed'),
      defaultValue: 'upcoming'
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  Friends.associate = (models) => {
    Friends.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Friends.belongsTo(models.User, {
      foreignKey: 'friendId',
      as: 'friend'
    });
  };

  return Friends;
};
