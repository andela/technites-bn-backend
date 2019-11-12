/* eslint-disable camelcase */
/* eslint-disable import/no-cycle */
import { io } from '../index';
import userService from './UserServices';
import database from '../database/models';

/**
 * @class NotificationService
 */
class NotificationService {
  /**
      *
      * @param {Integer} data
      * @returns {object} return null
      */
  static async sendNewTravelRequestNotification(data) {
    const notification = {};
    const { username, line_manager } = await userService.findUserById(data.user_id);
    const { id } = await userService.findUserByEmail(line_manager);

    notification.title = data.request_type;
    notification.from = username;

    const notificationToSave = {};
    notificationToSave.from = data.user_id;
    notificationToSave.to = id;
    notificationToSave.request_id = data.id;
    notificationToSave.message = `new ${data.request_type} travel request`;
    notificationToSave.type = data.request_type;

    const { dataValues } = await NotificationService.saveNotification(notificationToSave);
    if (data.status === 'Approved' || data.status === 'Rejected') {
      notification.status = data.status;
      const emitRes = io.emit('travel_request_response', notification);
      return { dataValues, emitRes };
    }
    const emitRes = io.emit('new_travel_request', notification);

    return { dataValues, emitRes };
  }

  /**
   * @func sendNewCommentNotification
   * @param {*} data
   * @returns {*} notification
   */
  static async sendNewCommentNotification(data) {
    const notification = {};
    const { username, line_manager } = await userService.findUserById(data.user_id);
    const { id } = await userService.findUserByEmail(line_manager);

    notification.title = `${username} commented on your request`;
    notification.from = username;
    notification.data = data;

    const notificationToSave = {};
    notificationToSave.from = data.user_id;
    notificationToSave.to = id;
    notificationToSave.data = data;
    notificationToSave.message = data.comment;
    notificationToSave.type = 'comments';

    const { dataValues } = await NotificationService.saveNotification(notificationToSave);
    const emitRes = io.emit('new_comment', notification);
    return { dataValues, emitRes };
  }

  /**
      *
      * @param {Object} notification
      * @returns {object} returns the notification
      */
  static async saveNotification(notification) {
    return database.Notification.create(notification);
  }
}

export default NotificationService;
