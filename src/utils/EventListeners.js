/* eslint-disable import/no-cycle */
import eventEmitter from './EventEmitter';
import notificationService from '../services/NotificationServices';

export default () => {
  const { sendNewTravelRequestNotification, sendNewCommentNotification } = notificationService;

  eventEmitter.on('new_travel_request', sendNewTravelRequestNotification);
  eventEmitter.on('new_comment', sendNewCommentNotification);
};
