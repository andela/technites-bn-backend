/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
export function up(queryInterface, Sequelize) {
  return queryInterface.bulkInsert('Notifications', [{
    from: 1,
    to: 2,
    request_id: 1,
    message: 'notification',
    type: 'OneWay',
    seen: false,
    data: { simple: 'this data is for testing' },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    from: 1,
    to: 3,
    request_id: 2,
    message: 'notification',
    type: 'OneWay',
    seen: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    from: 1,
    to: 3,
    request_id: 3,
    message: 'notification',
    type: 'OneWay',
    seen: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  ], {}, { data: { type: new Sequelize.JSONB() } });
}

/* eslint-disable no-unused-vars */
export function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete('Notifications', null, {});
}
