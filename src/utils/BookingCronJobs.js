/* eslint-disable camelcase */
/* eslint-disable no-irregular-whitespace */
import cron from 'node-cron';
import { Op } from 'sequelize';
import RoomService from '../services/RoomServices';

let status = false;
let where;
/**
 * @class BookingCronJobs
 */
class BookingCronJobs {
  /**
   * @param {*} time
     * @returns {*} cron job
     */
  static bookings(time) {
    cron.schedule(time, async () => {
      console.log('checkin');
      // ON checkin

      where = {
        check_in: {
          [Op.lte]: new Date()
        },
        status: true
      };
      const checkinBookings = await RoomService.getRoomByDate(where);
      // release book
      status = false;
      checkinBookings.map(({ room_id }) => ({ room_id })).forEach(({ room_id }) => RoomService.changeRoomStatus(room_id, status));
      console.log('checkout');
      // ON checkout
      where = {
        check_out: {
          [Op.lte]: new Date()
        },
        status: true
      };
      const checkoutBookings = await RoomService.getRoomByDate(where);
      // cancel booking
      checkoutBookings.map(({ request_id }) => ({ request_id })).forEach(({ request_id }) => RoomService.releaseBooking(request_id));
      // release book
      status = true;
      checkoutBookings.map(({ room_id }) => ({ room_id })).forEach(({ room_id }) => RoomService.changeRoomStatus(room_id, status));
    });
  }
}
export default BookingCronJobs;
