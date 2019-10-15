/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */

export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('Rooms', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    accommodation_id: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Accomodations',
        key: 'id',
        as: 'accommodation_id',
      },
    },
    name: {
      type: Sequelize.STRING
    },
    room_type: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    cost: {
      type: Sequelize.INTEGER
    },
    images: {
      type: Sequelize.JSONB
    },
    status: {
      type: Sequelize.BOOLEAN
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
export function down(queryInterface, Sequelize) { return queryInterface.dropTable('Rooms'); }
