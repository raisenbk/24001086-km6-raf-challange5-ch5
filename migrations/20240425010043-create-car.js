'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      model: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DECIMAL(19, 2)
      },
      image: {
        type: Sequelize.TEXT,
        defaultValue: "http://via.placeholder.com/200x300"
      },
      createdBy: {
        type: Sequelize.INTEGER,
      },
      deletedBy: {
        type: Sequelize.INTEGER,
      },
      lastUpdatedBy: {
        type: Sequelize.INTEGER,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cars');
  }
};