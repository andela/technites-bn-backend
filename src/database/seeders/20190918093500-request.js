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
        destination_id: 2,
        accomodation_id: 1,
        check_in: moment().toDate(),
        check_out: moment().add(7, 'days').toDate()
      }
    ],
    reason: 'some reason',
    status: 'Pending',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    user_id: 5,
    request_type: 'OneWay',
    location_id: 1,
    departure_date: moment().toDate(),
    return_date: moment().add(7, 'days').toDate(),
    destinations: [
      {
        destination_id: 3,
        accomodation_id: 1,
        check_in: moment().toDate(),
        check_out: moment().add(7, 'days').toDate()
      }
    ],
    reason: 'some reason',
    status: 'Pending',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    user_id: 7,
    request_type: 'OneWay',
    location_id: 3,
    departure_date: moment().toDate(),
    return_date: moment().add(7, 'days').toDate(),
    destinations: [
      {
        destination_id: 1,
        accomodation_id: 1,
        check_in: moment().toDate(),
        check_out: moment().add(7, 'days').toDate()
      }
    ],
    reason: 'some reason',
    status: 'Pending',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    user_id: 5,
    request_type: 'OneWay',
    location_id: 3,
    departure_date: moment().toDate(),
    return_date: moment().add(7, 'days').toDate(),
    destinations: [
      {
        destination_id: 1,
        accomodation_id: 1,
        check_in: moment().toDate(),
        check_out: moment().add(7, 'days').toDate()
      }
    ],
    reason: 'some reason',
    status: 'Rejected',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    user_id: 1,
    request_type: 'OneWay',
    location_id: 1,
    departure_date: moment().toDate(),
    return_date: moment().add(7, 'days').toDate(),
    destinations: [
      {
        destination_id: 2,
        accomodation_id: 4,
        check_in: moment().toDate(),
        check_out: moment().add(7, 'days').toDate()
      }
    ],
    reason: 'visit new york',
    status: 'Approved',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    user_id: 1,
    request_type: 'OneWay',
    location_id: 1,
    departure_date: moment().toDate(),
    return_date: moment().add(7, 'days').toDate(),
    destinations: [
      {
        destination_id: 2,
        accomodation_id: 400, // for testing invalid accommodation
        check_in: moment().toDate(),
        check_out: moment().add(7, 'days').toDate()
      }
    ],
    reason: 'visit new york',
    status: 'Approved',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    user_id: 5,
    request_type: 'OneWay',
    location_id: 1,
    departure_date: '2018-10-07 09:10:31.981 +00:00',
    return_date: moment().add(7, 'days').toDate(),
    destinations: [
      {
        destination_id: 3,
        accomodation_id: 1,
        check_in: moment().toDate(),
        check_out: moment().add(7, 'days').toDate()
      }
    ],
    reason: 'test get tripsreason',
    status: 'Approved',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    user_id: 8,
    request_type: 'OneWay',
    location_id: 1,
    departure_date: '2018-10-07 09:10:31.981 +00:00',
    return_date: moment().add(7, 'days').toDate(),
    destinations: [
      {
        destination_id: 3,
        accomodation_id: 1,
        check_in: moment().toDate(),
        check_out: moment().add(7, 'days').toDate()
      }
    ],
    reason: 'test get tripsreason',
    status: 'Approved',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  ], {}, { destinations: { type: new Sequelize.JSONB() } });
}

/* eslint-disable no-unused-vars */
export function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete('Requests', null, {});
}
