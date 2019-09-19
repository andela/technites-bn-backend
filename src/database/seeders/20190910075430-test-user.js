/* eslint-disable indent */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
import bcrypt from 'bcrypt';

const { SUPER_ADMIN_PASS } = process.env;
const password = bcrypt.hashSync(SUPER_ADMIN_PASS, 8);
export function up(queryInterface, Sequelize) {
   return queryInterface.bulkInsert('Users', [{
    firstname: 'John',
    lastname: 'Doe',
    username: 'johndoe',
    email: 'technitesdev1@gmail.com',
    password,
    company: 'Andela',
    is_verified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    firstname: 'John',
    lastname: 'Doe',
    username: 'johndoe',
    email: 'technitesdev2@gmail.com',
    password,
    is_verified: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    firstname: 'John',
    lastname: 'Doe',
    username: 'adminadmin',
    email: 'technitesdev@gmail.com',
    password, // currently in .env
    is_verified: true,
    role_value: 7,
    createdAt: new Date(),
    updatedAt: new Date()
  }
], {});
}

export function down(queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Users', null, {});
}
