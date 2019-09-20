/* eslint-disable require-jsdoc */
export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('Accomodations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    accommodation_name: {
      type: Sequelize.STRING
    },
    room_type: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    location: {
      type: Sequelize.STRING
    },
    images: {
      type: Sequelize.JSONB
    },
    quantity: {
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

// eslint-disable-next-line no-unused-vars
export function down(queryInterface, Sequelize) { return queryInterface.dropTable('Accomodations'); }
