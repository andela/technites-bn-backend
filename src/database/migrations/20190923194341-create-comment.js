/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */

export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('Comments', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    request_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    comment: {
      allowNull: false,
      type: Sequelize.TEXT
    },
    active: {
      allowNull: false,
      type: Sequelize.TEXT,
      defaultValue: true
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
}
export function down(queryInterface, Sequelize) { return queryInterface.dropTable('Comments'); }
