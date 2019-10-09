/* eslint-disable camelcase */
/* eslint-disable import/no-cycle */
import { io } from '../../index';
import eventEmmiter from './EventEmitter';
import NotificationService from '../../services/NotificationServices';
import userService from '../../services/UserServices';

const { saveNotification } = NotificationService;

/**
 * @class NotificationHelper
 */
class NotificationHelper {
  /**
      *
      * @param {Integer} data
      * @returns {object} return null
      */
  static async newTravelRequest() {
    await eventEmmiter.on('new_travel_request', async (requestData) => {
      const notification = {};
      const { username, line_manager } = await userService.findUserById(requestData.user_id);
      const { id } = await userService.findUserByEmail(line_manager);

      notification.title = requestData.request_type;
      notification.from = username;

      const notificationToSave = {};
      notificationToSave.user_id = id;
      notificationToSave.message = requestData.reason;
      notificationToSave.type = requestData.request_type;
      notificationToSave.request_id = requestData.id;

      const { dataValues } = await saveNotification(notificationToSave);

      const emitRes = io.emit('new_travel_request', notification);

      return { dataValues, emitRes };
    });
  }

  /**
     *
     * @returns {object} return null
     */
  static async updatedTravelRequest() {
    await eventEmmiter.on('request_update', async (data) => {
      const notification = {
        user_id: data.user_id,
        request_id: data.id,
        type: 'request update',
        message: `${data.email} updated their request`
      };
    console.log('updated listener b4 save');
      await NotificationService.saveNotification(notification);
      const updateNotification = {
        title: `${data.email} updated their request.`,
        requestId: data.id,
      };
      io.emit('request_update', updateNotification);
    });
  }

  /**
      *
      * @param {*} data
      * @returns {object} return null
      */
  static async sendNewTravelRequestNotification(data) {
    const notification = {};
    const { username, line_manager } = await userService.findUserById(data.user_id);
    const { id } = await userService.findUserByEmail(line_manager);

    notification.title = data.request_type;
    notification.from = username;

    const notificationToSave = {};
    notificationToSave.user_id = id;
    notificationToSave.request_id = data.id;
    notificationToSave.message = data.reason;
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
    notificationToSave.user_id = id;
    notificationToSave.message = data.comment;
    notificationToSave.type = 'comments';

    const { dataValues } = await NotificationService.saveNotification(notificationToSave);
    const emitRes = io.emit('new_comment', notification);
    return { dataValues, emitRes };
  }
}

export default NotificationHelper;
