// models/index.js
import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';
import UserModel from './user.js';
import FriendsModel from './Friends.js';
import BirthdayModel from './birthday.js';

const db = {
  sequelize,
  Sequelize,
  User: UserModel(sequelize),
  Friends: FriendsModel(sequelize),
  Birthday: BirthdayModel(sequelize)
};

// Run associations if any
Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;