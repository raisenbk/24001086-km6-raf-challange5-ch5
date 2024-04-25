'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Car.belongsTo(models.User, {
        as: "createdByUser",
        foreignKey: {
          name:"createdBy",
          allowNull: false
        }
      });
      Car.belongsTo(models.User, {
        as: "updatedByUser",
        foreignKey: {
          name: "lastUpdatedBy"
        }
      });
      Car.belongsTo(models.User, {
        as: "deletedByUser",
        foreignKey: {
          name: "deletedBy"
        }
      })
    }
  }
  Car.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    model: DataTypes.STRING,
    price: DataTypes.INTEGER,
    image: DataTypes.TEXT,
    createdBy: DataTypes.INTEGER,
    lastUpdatedBy: DataTypes.INTEGER,
    deletedBy: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Car',
    paranoid: true,
    deletedAt: "deletedAt"
  });
  return Car;
};