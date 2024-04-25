'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    phone: DataTypes.STRING,
    profileImage: {
      type: DataTypes.TEXT,
      defaultValue:
        "https://tse2.mm.bing.net/th?id=OIP.U2iQ7wNK6ZzTW_traW_-PQHaHa&pid=Api&P=0&h=180",
    },
    role: {
      type: DataTypes.ENUM(["Guest","Admin", "SuperAdmin"]),
      defaultValue: "Guest",
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};