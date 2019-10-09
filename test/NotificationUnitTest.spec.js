import chai from 'chai';
import NotificationService from '../src/services/NotificationServices';

const { sendNewTravelRequestNotification } = NotificationService;

chai.should();

describe('Testing Notification', () => {
  it('should return a valid object', async () => {
    const data = {
      user_id: 1,
      id: 3, // this is the request id
      request_type: 'ReturnTrip',
      location_id: 3,
      departure_date: '2030-09-25',
      destinations: [
        {
          destination_id: 1, accomodation_id: 2, check_in: '2030-09-26', check_out: '2039-09-27'
        },
        {
          destination_id: 2, accomodation_id: 1, check_in: '2030-09-26', check_out: '2039-09-27'
        }],
      reason: 'reason',
      return_date: '2039-09-25'
    };

    const { dataValues, emitRes } = await sendNewTravelRequestNotification(data);

    dataValues.should.have.property('message').be.a('string');
    emitRes.should.have.property('name').be.a('string');
    emitRes.should.have.property('server').be.a('object');
  });
});
