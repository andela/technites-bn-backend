/* eslint-disable require-jsdoc */
export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    role_value: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
    phone: {
      allowNull: true,
      type: Sequelize.STRING
    },
    gender: {
      allowNull: true,
      type: Sequelize.STRING
    },
    dob: {
      allowNull: true,
      type: Sequelize.DATE
    },
    address: {
      allowNull: true,
      type: Sequelize.STRING
    },
    country: {
      allowNull: true,
      type: Sequelize.STRING
    },
    language: {
      allowNull: true,
      type: Sequelize.STRING
    },
    currency: {
      allowNull: true,
      type: Sequelize.STRING
    },
    image_url: {
      allowNull: true,
      type: Sequelize.STRING
    },
    company: {
      allowNull: true,
      type: Sequelize.STRING
    },
    department: {
      allowNull: true,
      type: Sequelize.STRING
    },
    line_manager: {
      allowNull: true,
      type: Sequelize.STRING
    },
    isEmailAllowed: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: true,
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
export function down(queryInterface, Sequelize) { return queryInterface.dropTable('Users'); }
