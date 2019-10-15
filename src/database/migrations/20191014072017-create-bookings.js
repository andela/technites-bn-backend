/* eslint-disable require-jsdoc */
export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('Bookings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    request_id: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Requests',
        key: 'id',
        as: 'request_id',
      },
    },
    room_id: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Rooms',
        key: 'id',
        as: 'room_id',
      },
    },
    check_in: {
      type: Sequelize.DATE
    },
    check_out: {
      type: Sequelize.DATE
    },
    status: {
      type: Sequelize.BOOLEAN,
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
export function down(queryInterface, Sequelize) {
  return queryInterface.dropTable('Bookings');
}
