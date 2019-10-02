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
     * @param {*} accommodation_id
     * @param {*} id
     * @param {*} feedback
     * @returns {*} object
     */
  static async getSpecificFeedbackByUser(accommodation_id, id, feedback) {
    const gotenFeedback = await db.Feedback.findAll({
      where: {
        accommodation_id,
        user_id: id,
        feedback
      }
    });
    return gotenFeedback;
  }

  /**
     *
     * @param {*} id
     * @param {*} accommodation_id
     * @returns {*} object
     */
  static async getById(id, accommodation_id) {
    const gotenFeedback = await db.Feedback.findAll({
      where: {
        id, accommodation_id
      },
      include: [{
        model: db.User,
        required: true,
        attributes: ['id', 'email', 'username']
      }]
    });
    return gotenFeedback;
  }
}

export default FeedbackServices;
