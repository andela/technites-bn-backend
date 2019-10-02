/* eslint-disable no-unused-vars */
/**
 *
 * @param {*} queryInterface
 * @param {*} Sequelize
 * @returns {*} likes table
 */
export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('Likes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    accommodation_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false
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
 *
 * @param {*} queryInterface
 * @param {*} Sequelize
 * @returns {*} deletes Likes table
 */
export function down(queryInterface, Sequelize) {
  return queryInterface.dropTable('Likes');
}
