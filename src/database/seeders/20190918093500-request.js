import moment from 'moment';
/* eslint-disable require-jsdoc */
export function up(queryInterface, Sequelize) {
  return queryInterface.bulkInsert('Requests', [{
    user_id: 1,
    request_type: 'OneWay',
    location_id: 1,
    departure_date: moment().toDate(),
    return_date: moment().add(7, 'days').toDate(),
    destinations: [
      {
        destination_id: 1,
        checkIn: moment().toDate(),
        checkOut: moment().add(7, 'days').toDate()
      }
    ],
    reason: 'some reason',
    status: 'Pending',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}, { destinations: { type: new Sequelize.JSONB() } });
}

/* eslint-disable no-unused-vars */
export function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete('Requests', null, {});
}
