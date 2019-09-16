/* eslint-disable indent */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */

export function up(queryInterface, Sequelize) {
   return queryInterface.bulkInsert('Users', [{
    firstname: 'John',
    lastname: 'Doe',
    username: 'johndoe',
    email: 'technitesdev@gmail.com',
    password: '123456',
    is_verified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {});
}

export function down(queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Users', null, {});
}
