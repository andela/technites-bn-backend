/* eslint-disable require-jsdoc */
export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('Requests', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'user_id',
      },
    },
    request_type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    location_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    departure_date: {
      type: Sequelize.STRING
    },
    return_date: {
      type: Sequelize.STRING
    },
    destinations: {
      type: Sequelize.JSONB,
      allowNull: false
    },
    reason: {
      type: Sequelize.STRING,
      allowNull: false
    },
    passport_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    passport_number: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING
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
// eslint-disable-next-line no-unused-vars
export function down(queryInterface, Sequelize) { return queryInterface.dropTable('Requests'); }
