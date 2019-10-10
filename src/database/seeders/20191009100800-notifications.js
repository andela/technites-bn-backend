/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
export function up(queryInterface, Sequelize) {
  return queryInterface.bulkInsert('Notifications', [{
    user_id: 1,
    request_id: 1,
    message: 'notification',
    type: 'OneWay',
    seen: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    user_id: 3,
    request_id: 2,
    message: 'notification',
    type: 'OneWay',
    seen: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    user_id: 3,
    request_id: 3,
    message: 'notification',
    type: 'OneWay',
    seen: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  ], {});
}

/* eslint-disable no-unused-vars */
export function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete('Notifications', null, {});
}
