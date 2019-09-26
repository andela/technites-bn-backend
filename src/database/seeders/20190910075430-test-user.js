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
    role_value: 7,
    line_manager: 'technitesdev@gmail.com',
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
    line_manager: 'technitesdev@gmail.com',
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
    line_manager: 'technitesdev@gmail.com',
    role_value: 7,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    firstname: 'Travel',
    lastname: 'Admin',
    username: 'TravelAdmin',
    email: 'travel@admin.com',
    password,
    is_verified: true,
    line_manager: 'technitesdev@gmail.com',
    role_value: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    firstname: 'Requester',
    lastname: 'user',
    username: 'requesting',
    email: 'requester@request.com',
    password,
    is_verified: true,
    line_manager: 'manager@admin.com',
    role_value: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    firstname: 'Manager',
    lastname: 'Admin',
    username: 'ManagerAdmin',
    email: 'manager@admin.com',
    password,
    is_verified: true,
    role_value: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    firstname: 'Requester',
    lastname: 'user',
    username: 'requesting',
    email: 'technitesdev3@gmail.com',
    password,
    company: 'NewCompany',
    line_manager: 'manager@admin.com',
    is_verified: true,
    role_value: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
], {});
}

export function down(queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Users', null, {});
}
