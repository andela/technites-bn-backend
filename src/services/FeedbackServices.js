/* eslint-disable camelcase */
import db from '../database/models';


/**
 * @class FeedbackServices
 */
class FeedbackServices {
  /**
     *
     * @param {*} newFeedback
     * @param {*} user_id
     * @param {*} accommodation_id
     * @returns {*} object
     */
  static async createFeedback(newFeedback) {
    const created = await db.Feedback.create(newFeedback);
    return created;
  }

  /**
     *
     * @param {*} accommodation_id
     * @returns {*} object
     */
  static async getAllInAccommodation(accommodation_id) {
    const allFeedbacks = await db.Feedback.findAll({
      where: {
        accommodation_id
      }
    });
    return allFeedbacks;
  }

  /**
     *
     * @param {*} user_id
     * @param {*} feedback
     * @returns {*} object
     */
  static async getSpecificFeedbackByUser(user_id, feedback) {
    const gotenFeedback = await db.Feedback.findAll({
      where: {
        user_id, feedback
      }
    });
    return gotenFeedback;
  }

  /**
     *
     * @param {*} id
     * @returns {*} object
     */
  static async getById(id) {
    const gotenFeedback = await db.Feedback.findAll({
      where: {
        id
      }
    });
    return gotenFeedback;
  }
}

export default FeedbackServices;
