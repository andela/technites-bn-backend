/* eslint-disable import/no-cycle */
import eventEmitter from './EventEmitter';
import notificationService from '../services/NotificationServices';

export default () => {
  const {
    sendNewTravelRequestNotification,
    sendNewCommentNotification,
    newUserNotification,
    newMessageNotification,
    updateRequestNotification
  } = notificationService;

  eventEmitter.on('new_travel_request', sendNewTravelRequestNotification);
  eventEmitter.on('new_comment', sendNewCommentNotification);
  eventEmitter.on('travel_request_response', sendNewTravelRequestNotification);
  eventEmitter.on('new_user', newUserNotification);
  eventEmitter.on('send_message', newMessageNotification);
  eventEmitter.on('request_update', updateRequestNotification)
};
