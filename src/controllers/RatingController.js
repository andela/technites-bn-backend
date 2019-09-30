import dotenv from 'dotenv';
import { parse } from 'url';
import RatingService from '../services/RatingServices';

dotenv.config();
const {
  addRate,
  userRating, ratings,
  IsAccepted
} = RatingService;

/**
 * @class RequestController
 */
class RequestController {
  /**
     * @func getRate
     * @param {*} req
     * @param {*} res
     * @returns {*} response
     */
  static async getRate(req, res) {
    const { user } = req;
    const { accommodation_id: accommodationId } = req.params;
    const rating = await userRating(user.id, accommodationId);
    if (rating) {
      return res.status(200).json({
        status: res.statusCode,
        message: 'Your rating on this accommodation facility',
        data: rating
      });
    }
    return res.status(404).json({
      status: res.statusCode,
      message: 'We didn\'t find your rating for his facility'
    });
  }

  /**
   * @func addRate
   * @param {*} req
   * @param {*} res
   * @returns {*} response
   */
  static async addRate(req, res) {
    const { user } = req;
    // eslint-disable-next-line camelcase
    const { accommodation_id } = req.params;
    const accommodationId = parseInt(accommodation_id, 10);
    const { rating } = req.body;
    // check if user stayed in his facility
    // toBe allowed to rate it
    const check = await IsAccepted(user.id, accommodationId);
    if (!check) {
      return res.status(403).json({
        status: res.statusCode,
        message: 'You can only rate accommodation you stayed in'
      });
    }
    const saved = await addRate(user.id, accommodationId, rating);
    if (saved) {
      return res.status(201).json({
        status: res.statusCode,
        message: 'Your rating added successful'
      });
    }
    return res.status(500).json({
      status: res.statusCode,
      message: 'Oops something unexcepted happened trying to adds your rating'
    });
  }

  /**
   * @func rating
   * @param {*} req
   * @param {*} res
   * @returns {*} response
   */
  static async rating(req, res) {
    const { accommodation_id: accommodationId } = req.params;
    const arrayOfRating = await ratings(accommodationId);
    if (arrayOfRating) {
      // convert arrayOfRating -> eg: [2,3,4] & return avg ratings
      const arrAvg = (arr) => (arr.map(({ rating }) => rating)
        .reduce((a, b) => a + b, 0) / arr.length).toPrecision(3);
      let avg = arrAvg(arrayOfRating);
      avg = parseFloat(avg);
      return res.status(200).json({
        status: res.statusCode,
        message: 'Users ratings for this facility',
        average: avg,
        total_ratings: arrayOfRating.length,
        data: arrayOfRating
      });
    }
    return res.status(200).json({
      status: res.statusCode,
      message: 'no ratings found!'
    });
  }
}

export default RequestController;
