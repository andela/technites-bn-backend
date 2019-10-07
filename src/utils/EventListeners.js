/* eslint-disable import/no-cycle */
import eventEmitter from './EventEmitter';
import notificationService from '../services/NotificationServices';

export default () => {
  const { sendNewTravelRequestNotification } = notificationService;

  eventEmitter.on('new_travel_request', sendNewTravelRequestNotification);
  eventEmitter.on('travel_request_response', sendNewTravelRequestNotification);
};
