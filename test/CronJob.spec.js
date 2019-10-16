/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import database from '../src/database/models';
import BookingCronJobs from '../src/utils/BookingCronJobs';
import RoomService from '../src/services/RoomServices';

chai.use(chaiHttp);
chai.should();
let roomId;
let roomId2;
let requestId;
let clock;
const dateToUse = new Date().toDateString();
describe('Accomodations', () => {
  before(async () => {
    const room = {
      accommodation_id: 1,
      name: 'Room 1',
      room_type: 'Test',
      description: 'This is quite a good place',
      cost: 200,
      images: '[{"image_url":"src/utils/assets/accommodation1.jpg"},{"image_url":"src/utils/assets/accommodation2.jpg"}]',
      status: true
    };
    // record room
    const newRoom = await database.Room.create(room);
    roomId = newRoom.id;
    const room2 = {
      accommodation_id: 1,
      name: 'Room 2',
      room_type: 'Test room 2',
      description: 'This is quite a good place',
      cost: 200,
      images: '[{"image_url":"src/utils/assets/accommodation1.jpg"},{"image_url":"src/utils/assets/accommodation2.jpg"}]',
      status: true
    };
      // record room 2
    const newRoom2 = await database.Room.create(room2);
    roomId2 = newRoom2.id;
    // record request
    const request = {
      user_id: 1,
      request_type: 'OneWay',
      location_id: 1,
      departure_date: dateToUse,
      return_date: dateToUse,
      destinations: [{
        destination_id: 4,
        accomodation_id: 1,
        check_in: dateToUse,
        check_out: dateToUse,
        room_id: roomId
      },
      {
        destination_id: 4,
        accomodation_id: 1,
        check_in: dateToUse,
        check_out: dateToUse,
        room_id: roomId2
      }
      ],
      reason: 'Medical',
      passport_name: 'my name',
      passport_number: '1234567890',
    };
    const newRequest = await database.Request.create(request);
    requestId = newRequest.id;
    // record booking
    const booking = {
      request_id: requestId,
      room_id: roomId,
      check_in: new Date(),
      check_out: new Date(),
    };
    const newBooking = await database.Bookings.create(booking);

    clock = sinon.useFakeTimers();
  });
  after(() => {
    clock.restore();
  });
  it('Should run cronjobs for checin', async () => {
    const roomByDateSpy = sinon.spy(RoomService, 'getRoomByDate');
    BookingCronJobs.bookings('* * * * * *');
    clock.tick(3000);
    roomByDateSpy.restore();
    expect(roomByDateSpy.called).to.be.true;
  });
  it('Should run cronjobs for checkout', async () => {
    const roomByDateSpy = sinon.spy(RoomService, 'getRoomByDate');
    BookingCronJobs.bookings('* * * * * *');
    clock.tick(3000);
    expect(roomByDateSpy.called).to.be.true;
  });
});
