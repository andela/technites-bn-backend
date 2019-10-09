// eslint-disable-next-line import/no-cycle
import notificationHelper from './NotificationHelper';

module.exports = () => {
  notificationHelper.newTravelRequest();
  notificationHelper.updatedTravelRequest();
  notificationHelper.sendNewCommentNotification();
};
