/* eslint-disable camelcase */
import dotenv from 'dotenv';
import moment from 'moment';
import { Op } from 'sequelize';
import database from '../database/models';

dotenv.config();
/**
 * @class UserService
 * @description user service methods
 */
class RequestService {
  /**
   *
   * @param {*} user_id
   * @returns {Object} user
   */
  static async fetchRequests(user_id) {
    return database.Request.findAll({ where: { user_id } });
  }

  /**
   *
   * @param {*} where
   * @param {*} value
   * @returns {*} returns search results
   */
  static async searchRequests(where) {
    const searchResults = await database.Request.findAll({ where });
    return searchResults.map((result) => result.dataValues);
  }

  /**
 *
 * @param {*} id
 * @returns {Object} Request
 */
  static async searchRequest(id) {
    const request = await database.Request.findOne({ where: { id } });
    if (!request) return null;
    return request.dataValues;
  }

  /**
 *
 * @param {*} reason
 * @param {*} departureDate
 * @returns {Object} Request
 */
  static async isRequestUnique(reason, departureDate) {
    const request = await database.Request
      .findOne({ where: { reason, departure_date: departureDate } });

    if (request) return true;
    return false;
  }

  /**
 *
 * @param {*} destinations
 * @returns {Object} Request
 */
  static async isCheckDatesValid(destinations) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < destinations.length; i++) {
      const { check_in: checkIn, check_out: checkOut } = destinations[i];

      if (!moment().isSame(checkIn, 'day')) {
        if (moment().isAfter(checkIn)) {
          return { status: 400, error: 'check in date is invalid. Past dates are not allowed' };
        }
      }

      if (moment(checkIn).isAfter(checkOut)) {
        return { status: 400, error: 'check out date should be after the check in date' };
      }
    }
  }

  /**
 *
 * @param {*} request
 * @returns {Object} Request
 */
  static async isDatesValid(request) {
    if (!moment().isSame(request.departure_date, 'day')) {
      if (moment().isAfter(request.departure_date)) {
        return { status: 400, error: 'Invalid date. Past dates are not allowed' };
      }
    }

    if (request.return_date !== undefined) {
      if (moment(request.departure_date).isAfter(request.return_date)) {
        return { status: 400, error: 'Return date should be after the departure date' };
      }
    }
  }

  /**
 *
 * @param {*} request
 * @returns {Boolean} true or false
 */
  static async isSamePlace(request) {
    const finalDestinationId = request.destinations[request.destinations.length - 1].destination_id;
    const locationId = request.location_id;

    if (finalDestinationId === locationId) return true;

    return false;
  }

  /**
 *
 * @param {*} id
 * @param {*} request
 * @returns {Object} updated request
 */
  static async updateRequest(id, request) {
    const [, result] = await database.Request
      .update(request, { where: { id }, returning: true, plain: true });
    return result;
  }

  /**
   *
   * @param {Integer} requestId
   * @param {String} action
   * @returns {Object} user
   */
  static async actionOnTrip(requestId, action = 'Rejected') {
    const actionDone = action === 'approve' ? 'Approved' : 'Rejected';
    return database.Request.update(
      { status: actionDone },
      {
        where: { id: requestId },
        returning: true,
        include: [{
          model: database.User
        }]
      }
    );
  }

  /**
   *
   * @param {Object} request
   * @returns {Object} res
   */
  static async createRequest(request) {
    return database.Request.create(request);
  }

  /**
 *
 * @param {*} locationId
 * @returns {*} locations
 */
  static async findOrigin(locationId) {
    const origin = await database.location.findOne({
      where: { id: locationId }
    });
    return origin.name;
  }

  /**
   *
   * @param {*} destinations
   * @returns {*} locations
   */
  static async findDestination(destinations) {
    // convert JSONArray of destinations -> Array of id eg: [1,2,3]
    const arrIds = destinations.map(({ destination_id: id }) => id);
    return database.location.findAll({
      attributes: ['id', 'name'],
      where: { id: { [Op.in]: arrIds } }
    });
  }

  /**
   *
   * @param {Integer} requestId
   * @param {Integer} userId
   * @param {Object} res
   * @returns {Object} boolean
   */
  static async confirmRequestOwner(requestId, userId) {
    // checks if its either the owner, manager or Superadmin for posting a comment
    const check = await database.Request.findAll({ where: { user_id: userId, id: requestId } });
    if (check.length > 0) return true;
    const user = await database.User.findOne({ where: { id: userId } });
    if ((user)
    && (user.dataValues.role_value === 2 || user.dataValues.role_value === 3
       || user.dataValues.role_value === 7)
    ) return true;
    return false;
  }

  /**
   *
   * @param {Integer} id
   * @returns {Object} boolean
   */
  static async findRequestById(id) {
    const request = await database.Request.findOne({ where: { id } });
    if (!request) return false;
    return true;
  }

  /**
   *
   * @param {Integer} id
   * @returns {Object} boolean
   */
  static async findCommentById(id) {
    const comment = await database.Comment.findOne({ where: { id, active: 'true' } });
    if (!comment) return false;
    if (comment) return comment.dataValues;
  }
}

export default RequestService;
