import database from '../database/models';

/**
 * @class NotificationService
 */
class NotificationService {
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
