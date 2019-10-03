/* eslint-disable no-unused-vars */
/**
 * @func up
 * @param {*} queryInterface
 * @param {*} Sequelize
 * @return {func} createTable
 */
export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('Ratings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    accommodation_id: {
      type: Sequelize.INTEGER
    },
    rating: {
      type: Sequelize.INTEGER
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
/**
 * @func down
 * @param {*} queryInterface
 * @param {*} Sequelize
 * @returns {func} dropTable
 */
export function down(queryInterface, Sequelize) {
  return queryInterface.dropTable('Ratings');
}
