/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable import/no-cycle */
import { io } from '../index';
import userService from './UserServices';
import database from '../database/models';

const { findUserById } = userService;
/**
 * @class NotificationService
 */
class NotificationService {
  /**
   *
   * @param {object} data
   * @returns {object} return null
   */
  static async sendNewTravelRequestNotification(data) {
    const notification = {};
    const { firstname, lastname, line_manager } = await userService.findUserById(data.user_id);
    const { id } = await userService.findUserByEmail(line_manager);
    notification.title = data.request_type;
    notification.from = `${firstname} ${lastname}`;
    notification.message = `New ${data.request_type} travel request from ${firstname} ${lastname}`;
    notification.user_id = id;
    notification.request_owner = data.user_id;

    const notificationToSave = {};
    notificationToSave.user_id = id;
    notificationToSave.request_id = data.id;
    notificationToSave.message = notification.message;
    notificationToSave.type = data.request_type;

    const { dataValues } = await NotificationService.saveNotification(
      notificationToSave
    );
    const emitRes = io.emit('new_travel_request', notification);

    return { dataValues, emitRes };
  }

  /**
   *
   * @param {object} data
   * @returns {object} return null
   */
  static async responseToRequest(data) {
    const notification = {};
    const { line_manager } = await userService.findUserById(data.user_id);
    const { id, firstname, lastname } = await userService.findUserByEmail(line_manager);
    notification.title = data.request_type;
    notification.from = `${firstname} ${lastname}`;
    notification.message = `Trip request ${data.status} by ${firstname} ${lastname}`;
    notification.user_id = id;
    notification.request_owner = data.user_id;

    const notificationToSave = {};
    notificationToSave.user_id = data.user_id;
    notificationToSave.request_id = data.id;
    notificationToSave.message = notification.message;
    notificationToSave.type = data.request_type;

    if (data.status === 'Approved' || data.status === 'Rejected') {
      notification.status = data.status;

      const { dataValues } = await NotificationService.saveNotification(
        notificationToSave
      );

      const emitRes = io.emit('travel_request_response', notification);
      return { dataValues, emitRes };
    }
  }

  /**
   * @func sendNewCommentNotification
   * @param {*} data
   * @returns {*} notification
   */
  static async sendNewCommentNotification(data) {
    const notification = {};
    const { line_manager } = await userService.findUserById(data.user_id);
    const { id } = await userService.findUserByEmail(line_manager);

    notification.message = 'A comment was posted on this request';
    notification.data = data;
    notification.manager = id;
    notification.owner = data.user_id;

    const notificationToSave = {};
    notificationToSave.user_id = id;
    notificationToSave.message = notification.message;
    notificationToSave.request_id = data.request_id;
    notificationToSave.type = 'comments';

    const { dataValues } = await NotificationService.saveNotification(
      notificationToSave
    );
    const emitRes = io.emit('new_comment', notification);
    return { dataValues, emitRes };
  }

  /**
   *
   * @param {Integer} data
   * @returns {object} return null
   */
  static async newUserNotification(data) {
    const notification = {
      from: `${data.firstname} ${data.lastname}`,
      type: 'newUser',
      to: 'All'
    };
    io.emit('new_user', notification);
  }

  /**
   *
   * @param {Integer} data
   * @param {*} req
   * @returns {object} return null
   */
  static async newMessageNotification(data) {
    const user = await findUserById(data.from);
    const notification = {
      from: `${user.firstname} ${user.lastname}`,
      type: 'message',
      to: data.to,
      message: data.message,
      user_id: user.id
    };
    io.emit('send_message', notification);
  }

  /**
   *
   * @param {*} data
   * @returns {*} object
   */
  static async updateRequestNotification(data) {
    const { firstname, lastname, line_manager } = await userService.findUserById(data.user_id);
    const { id } = await userService.findUserByEmail(line_manager);
    const notification = {
      user_id: id,
      request_id: data.id,
      type: 'request update',
      message: `${firstname} ${lastname} updated their request`
    };
    const { dataValues } = await NotificationService.saveNotification(
      notification
    );
    const emitRes = io.emit('request_update', notification);
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
