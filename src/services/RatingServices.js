import dotenv from 'dotenv';
import { Op } from 'sequelize';
import moment from 'moment';
import database from '../database/models';

dotenv.config();
/**
 * @class RatingServices
 */
class RatingServices {
  /**
     * @func addRate
     * @param {*} userId
     * @param {*} accommodationId
     * @param {*} rating
     * @returns {*} save
     */
  static async addRate(userId, accommodationId, rating) {
    return database.Accomodations
      .findOne({ where: { id: accommodationId } })
      .then((accomodation) => {
        if (accomodation) {
          return RatingServices.upsert({
            user_id: userId,
            accommodation_id: accommodationId,
            rating
          }, {
            user_id: userId,
            accommodation_id: accommodationId
          });
        }
        // return false If not exists
        return false;
      });
  }

  /**
   * @func upsert
   * @param {*} values
   * @param {*} condition
   * @returns {Boolean} response
   */
  static async upsert(values, condition) {
    return database.Rating
      .findOne({ where: condition })
      .then((obj) => {
        // update
        if (obj) { return obj.update(values); }
        // insert
        return database.Rating.create(values);
      });
  }

  /**
   * @func userRating
   * @param {*} userId
   * @param {*} accommodationId
   * @returns {*} specific user rating
   */
  static async userRating(userId, accommodationId) {
    return database.Rating.findOne({
      attributes: ['id', 'user_id', 'accommodation_id', 'rating'],
      where: {
        user_id: userId,
        accommodation_id: accommodationId
      }
    });
  }

  /**
   * @func ratings
   * @param {*} accommodationId
   * @returns {Array} ratings
   */
  static async ratings(accommodationId) {
    return database.Rating.findAll({
      attributes: ['id', 'user_id', 'accommodation_id', 'rating'],
      where: { accommodation_id: accommodationId }
    });
  }

  /**
   * @func IsAccepted
   * @param {*} userId
   * @param {*} accommodationId
   * @returns {Boolean} response
   * @description IsAccepted checks if
   * user is accepetd to rate this accommodation
   */
  static async IsAccepted(userId, accommodationId) {
    const requests = await database.Request.findAll({
      attributes: ['destinations'],
      where: {
        user_id: userId,
        status: 'Approved',
        destinations: {
          [Op.contains]: [{
            accomodation_id: accommodationId
          }]
        }
      }
    });
    const checks = requests.map(({ destinations }) => destinations)
      .flat().filter(
        (i) => moment().isSameOrAfter(i.check_in, 'D')
        && moment().isSameOrBefore(i.check_out, 'D')
      );
    if (checks.length > 0) return true;
    return false;
  }
}

export default RatingServices;
