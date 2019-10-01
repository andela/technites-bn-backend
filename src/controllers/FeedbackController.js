/* eslint-disable camelcase */
import FeedbackServices from '../services/FeedbackServices';
import AccommodationServices from '../services/AccomodationServices';

const {
  createFeedback,
  getAllInAccommodation,
  getById,
  getSpecificFeedbackByUser,
} = FeedbackServices;
const { findAccommodationById } = AccommodationServices;

/**
 * @class FeedbackController
 */
class FeedbackController {
  /**
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @returns {*} object
     */
  static async addFeedback(req, res, next) {
    const { accommodation_id } = req.params;
    try {
      const accomodation = await findAccommodationById(accommodation_id);
      if (!accomodation) return res.status(404).send({ status: 404, error: `Accommodation ${accommodation_id} not found` });
      const earlierCreated = await getSpecificFeedbackByUser(req.user.id, req.body.feedback);
      if (earlierCreated) return res.status(409).send({ status: 409, error: 'Feedback already exists' });
      req.body.accommodation_id = accommodation_id;
      req.body.user_id = req.user.id;
      const addedFeedback = await createFeedback(req.body);
      return res.status(200).send({ status: 200, message: 'Feedback successfully added', data: addedFeedback });
    } catch (error) {
      res.status(500).send({ status: 500, error: 'Something unexpected happened' });
      return next(error);
    }
  }

  /**
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @returns {*} object
     */
  static async getAllFeedbacks(req, res, next) {
    try {
      const { accommodation_id } = req.params;
      const accomodation = await findAccommodationById(accommodation_id);
      if (!accomodation) return res.status(404).send({ status: 404, error: `Accommodation ${accommodation_id} not found` });
      const allFeedbacks = await getAllInAccommodation(accommodation_id);
      if (!allFeedbacks) return res.status(200).send({ status: 200, message: 'No feedbacks found' });
      return res.status(200).send({ status: 200, message: 'Feedbacks Found', data: allFeedbacks });
    } catch (error) {
      return next(error);
    }
  }

  /**
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @returns {*} object
     */
  static async getFeedbackById(req, res, next) {
    try {
      const { accommodation_id, feedback_id } = req.params;
      const accomodation = await findAccommodationById(accommodation_id);
      if (!accomodation) return res.status(404).send({ status: 404, error: `Accommodation ${accommodation_id} not found` });
      const specificFeedback = await getById(feedback_id);
      if (specificFeedback.length === 0) return res.status(200).send({ status: 200, message: `Feedback with id ${feedback_id}  not found` });
      return res.status(200).send({ status: 200, message: `Feedback No: ${feedback_id}`, data: specificFeedback });
    } catch (error) {
      return next(error);
    }
  }
}

export default FeedbackController;
