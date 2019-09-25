/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-globals */
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import RequestServices from '../services/RequestServices';
import UserService from '../services/UserServices';
import Util from '../utils/Utils';

const {
  fetchRequests, createRequest, searchRequests, sendRequestConfirmation, approveTrip,
  rejectTrip, updateRequest, isRequestUnique, isCheckDatesValid, isDatesValid, isSamePlace
} = RequestServices;

const { findUserByEmail } = UserService;

const util = new Util();

let msgType = null;
/**
 * @class RequestController
 */
class RequestController {
  /**
    * @function getRequests
    * @param {Object} req request
    * @param {Oject} res request
    * @returns {Object} object
    */
  static async getRequests(req, res) {
    if (req.user.id === parseInt(req.params.id, 10) || req.user.role_value === 7) {
      const requests = await fetchRequests(req.params.id);
      if (requests && requests.length) {
        return res.status(200).json({
          status: res.statusCode,
          message: 'user requests',
          data: requests
        });
      }
      return res.status(200).json({
        status: res.statusCode,
        message: 'This user doesn\'t have any available requests!'
      });
    }
  }

  /**
     *
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} newUser
     */
  static async createRequest(req, res) {
    const user = await findUserByEmail(req.user.email);

    const request = req.body;
    request.user_id = user.id;


    if (typeof request.destinations === 'string') {
      request.destinations = JSON.parse(request.destinations);
    }

    let message = await isDatesValid(request);
    if (message) return res.status(400).json(message);

    message = await isCheckDatesValid(request.destinations);
    if (message) return res.status(400).json(message);

    const samePlace = await isSamePlace(request);
    if (samePlace) return res.status(400).json({ status: res.statusCode, error: 'Your location and destination should be different' });

    const alreadyExistRequest = await isRequestUnique(request.reason, request.departure_date);
    if (alreadyExistRequest) return res.status(409).json({ status: res.statusCode, error: 'Request already exists based on your reason and departure date' });

    const newRequest = await createRequest(request);

    const token = jwt.sign({ id: newRequest.id }, process.env.JWT_SECRET, { expiresIn: '365d' });

    sendRequestConfirmation(token, user, newRequest);

    res.status(201).json({ status: res.statusCode, message: 'Sent request. Please wait travel admin to approve it', data: newRequest });
  }

  /**
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} updated request
 */
  static async updateRequest(req, res) {
    const request = req.body;
    const { user } = req;
    const updatedRequest = await updateRequest(req.userRequest.id, request);
    const token = jwt.sign({ id: req.userRequest.id }, process.env.JWT_SECRET, { expiresIn: '365d' });
    sendRequestConfirmation(token, user, req.userRequest, msgType = 'Request Update');
    util.setSuccess(200, 'Request successfully Updated!', updatedRequest);
    return util.send(res);
  }

  /**
    * @function getRequests
    * @param {Object} req request
    * @param {Oject} res request
    * @returns {Object} object
    */
  static async approveRequest(req, res) {
    RequestController.checkIds(req, res);

    RequestController.isTravelAdmin(req, res);

    const result = await approveTrip(req.params.req_id);
    if (result[0] === 0) return res.status(200).json({ status: '400', message: 'The request with the given id does not exists' });

    return res.status(200).json({ status: '200', message: 'Approved request successfully' });
  }

  /**
    * @function getRequests
    * @param {Object} req request
    * @param {Oject} res request
    * @returns {Object} object
    */
  static async rejectRequest(req, res) {
    RequestController.checkIds(req, res);

    RequestController.isTravelAdmin(req, res);

    const result = await rejectTrip(req.params.req_id);
    if (result[0] === 0) return res.status(200).json({ status: '400', message: 'The request with the given id does not exists' });

    return res.status(200).json({ status: res.statusCode, message: 'Rejected request successfully' });
  }

  /**
    * @function getRequests
    * @param {Object} req request
    * @param {Oject} res request
    * @returns {Object} object
    */
  static async checkIds(req, res) {
    if (isNaN(req.params.id) || isNaN(req.params.req_id)) {
      return res.status(400).json({ status: '400', message: 'If you are trying to pass an id, please use a number' });
    }
  }

  /**
    * @function getRequests
    * @param {Object} req request
    * @param {Oject} res request
    * @returns {Object} object
    */
  static async isTravelAdmin(req, res) {
    if (req.user.role_value < 4) {
      return res.status(403).json({ status: '403', message: 'Forbidden. You are not a travel admin ' });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {object} - returns search results from the DB
   */
  static async searchRequests(req, res) {
    const {
      key_word, beforeDate, afterDate, column
    } = req.query;

    let where;
    let searchResults;

    if (key_word) {
      where = {
        [Op.or]: [
          { status: { [Op.iLike]: `%${key_word}%` } },
          { reason: { [Op.iLike]: `%${key_word}%` } },
          { request_type: { [Op.iLike]: `%${key_word}%` } },
        ]
      };
      searchResults = await searchRequests(where);
      return res.status(200).json({
        status: '200',
        message: 'Search complete',
        data: searchResults
      });
    }

    if (beforeDate && afterDate) {
      if (new Date(beforeDate) < new Date(afterDate)) {
        return res.status(400).json({
          status: '400',
          error: 'Invalid search'
        });
      }
      if (column === 'departure_date') {
        where = {
          [Op.and]: [
            {
              departure_date: {
                [Op.lte]: new Date(beforeDate),
                [Op.gte]: new Date(afterDate)
              }
            },
          ]
        };
        searchResults = await searchRequests(where);
        return res.status(200).json({
          status: '200',
          message: 'Search complete',
          data: searchResults
        });
      }
      if (column === 'createdAt') {
        where = {
          [Op.and]: [
            {
              createdAt: {
                [Op.lte]: new Date(beforeDate),
                [Op.gte]: new Date(afterDate)
              }
            },
          ]
        };
        searchResults = await searchRequests(where);
        return res.status(200).json({
          status: '200',
          message: 'Search complete',
          data: searchResults
        });
      }
      where = {
        [Op.and]: [
          {
            createdAt: {
              [Op.lte]: new Date(beforeDate),
              [Op.gte]: new Date(afterDate)
            }
          },
          {
            departure_date: {
              [Op.lte]: new Date(beforeDate),
              [Op.gte]: new Date(afterDate)
            }
          },
        ]
      };
      searchResults = await searchRequests(where);
      return res.status(200).json({
        status: '200',
        message: 'Search complete',
        data: searchResults
      });
    }

    if (beforeDate) {
      if (column === 'departure_date') {
        where = {
          [Op.or]: [
            { departure_date: { [Op.lt]: new Date(beforeDate) } },
          ]
        };
        searchResults = await searchRequests(where);
        return res.status(200).json({
          status: '200',
          message: 'Search complete',
          data: searchResults
        });
      }
      if (column === 'createdAt') {
        where = {
          [Op.and]: [
            { createdAt: { [Op.lt]: new Date(beforeDate) } },
          ]
        };
        searchResults = await searchRequests(where);
        return res.status(200).json({
          status: '200',
          message: 'Search complete',
          data: searchResults
        });
      }
      where = {
        [Op.and]: [
          { departure_date: { [Op.lt]: new Date(beforeDate) } },
          { createdAt: { [Op.lt]: new Date(beforeDate) } }
        ]
      };
      searchResults = await searchRequests(where);
      return res.status(200).json({
        status: '200',
        message: 'Search complete',
        data: searchResults
      });
    }
    if (afterDate) {
      if (column === 'departure_date') {
        where = {
          [Op.or]: [
            { departure_date: { [Op.gte]: new Date(afterDate) } },
          ]
        };
        searchResults = await searchRequests(where);
        return res.status(200).json({
          status: '200',
          message: 'Search complete',
          data: searchResults
        });
      }
      if (column === 'createdAt') {
        where = {
          [Op.or]: [
            { createdAt: { [Op.gte]: new Date(afterDate) } },
          ]
        };
        searchResults = await searchRequests(where);
        return res.status(200).json({
          status: '200',
          message: 'Search complete',
          data: searchResults
        });
      }
      where = {
        [Op.or]: [
          { departure_date: { [Op.gte]: new Date(afterDate) } },
          { createdAt: { [Op.gte]: new Date(afterDate) } }
        ]
      };
      searchResults = await searchRequests(where);
      return res.status(200).json({
        status: '200',
        message: 'Search complete',
        data: searchResults
      });
    }
  }
}

export default RequestController;
