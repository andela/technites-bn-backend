/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */

export function up(queryInterface, Sequelize) {
  return queryInterface.bulkInsert('Roles', [{
    role: 'super_admin',
    role_value: 7,
    createdAt: new Date(),
    updatedAt: new Date()
  }, {
    role: 'travel_admin',
    role_value: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  }, {
    role: 'manager',
    role_value: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }, {
    role: 'requester',
    role_value: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {});
}
export function down(queryInterface, Sequelize) { return queryInterface.bulkDelete('Roles', null, {}); }
