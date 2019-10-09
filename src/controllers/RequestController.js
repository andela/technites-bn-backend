/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-globals */
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import moment from 'moment';
import v from 'voca';
import { promisify } from 'util';
import dotenv from 'dotenv';
import eventEmitter from '../utils/Notifications/EventEmitter';
import redisClient from '../utils/RedisConnection';
import RequestServices from '../services/RequestServices';
import UserService from '../services/UserServices';
import Utils from '../utils/Utils';
import MailHelper from '../utils/MailHelper';
import AccommodationService from '../services/AccomodationServices';
import RoomService from '../services/RoomServices';
import EmailController from '../controllers/EmailController';

dotenv.config();

const { sendRequestEmail, sendUserEmail } = EmailController;

const {
  fetchRequests,
  createRequest,
  actionOnTrip,
  updateRequest,
  isRequestUnique,
  isCheckDatesValid,
  isDatesValid,
  isSamePlace,
  searchRequests,
  requestByIds,
  managerUsers,
  sendRequestConfirmation, approveTrip,
  rejectTrip,
  fetchApprovedRequests,
  isDestinationsDifferent, findMostTravelledDestination,
  findIfLocationsExists,
  findRequestById,
  confirmRequestOwner
} = RequestServices;
const { changeRoomStatus } = RoomService;
const { updateAccommodations, findAllAccommodationsByLocation } = AccommodationService;
const { findUserByEmail, findUserById } = UserService;
const Util = new Utils();
let sign;
let status;
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
    return res.status(403).json({
      status: res.statusCode,
      message: 'You are not allowed to retrieve other users requests'
    });
  }

  /**
    * @function getRequestById
    * @param {Object} req request
    * @param {Oject} res request
    * @returns {Object} object
    */
  static async getRequestById(req, res) {
    const request = await findRequestById(req.params.id);
    if (!request) return res.status(404).json({ status: 404, message: 'Request not found' });
    const confirmedOwner = await confirmRequestOwner(req.params.id, req.user.id);
    if (!confirmedOwner) return res.status(403).json({ status: 403, error: 'Forbidden action. Only owners allowed' });

    return res.status(200).json({
      status: res.statusCode,
      message: 'Request',
      data: request
    });
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

    // attach user_id on payload to save it directly


    const allDestinationsIds = [];
    // getting all destinations ids
    allDestinationsIds.push(request.location_id);
    for (let i = 0; i < request.destinations.length; i++) {
      allDestinationsIds.push(request.destinations[i].destination_id);
    }
    // find if all locations ids provided exists or not
    const nonExistentIds = await findIfLocationsExists(allDestinationsIds);
    if (nonExistentIds.length > 0) return res.status(404).json({ status: res.statusCode, error: `the location ${nonExistentIds} does not exists, please enter valid locations` });

    // find if the user has a valid line manager
    const lineManager = await findUserByEmail(user.line_manager);
    if (lineManager === null) return res.status(400).json({ status: res.statusCode, error: 'Your line manager does not exists in our database, please edit your profile and add a valid line manager' });

    let message = await isDatesValid(request);
    if (message) return res.status(400).json(message);

    message = await isCheckDatesValid(request.destinations);
    if (message) return res.status(400).json(message);

    const samePlace = await isSamePlace(request);
    if (samePlace) return res.status(400).json({ status: res.statusCode, error: 'Your location and destination should be different' });

    const destinationDifferent = await isDestinationsDifferent(request);
    if (destinationDifferent === false) return res.status(400).json({ status: res.statusCode, error: 'Destination id\'s or accomodation id\'s should be different' });

    const alreadyExistRequest = await isRequestUnique(request.reason, request.departure_date);
    if (alreadyExistRequest) return res.status(409).json({ status: res.statusCode, error: 'Request already exists based on your reason and departure date' });
    const dbRequest = await createRequest(request);
    // Update accommodations table
    sign = '-';
    req.accommodations.forEach((accommodation) => updateAccommodations(accommodation, sign));
    // Update rooms table
    status = false;
    req.requestedRooms.forEach((requestedRoom) => changeRoomStatus(requestedRoom, status));
    // build base URL
    const baseUrl = `${req.protocol}://${req.header('host')}`;
    // send Request Email to Line Manager
    const responseOne = sendRequestEmail(user, dbRequest, baseUrl);
    // send info e-mail to the user
    let responseTwo = true;

    if (user.isEmailAllowed === 'true') {
      responseTwo = sendUserEmail(
        'You sent a new trip request',
        'Trip request confirmation sent',
        'was succesfully received', user, request
      );
    }

    if (responseOne && responseTwo) {
      return res.status(201).json({
        status: res.statusCode,
        message: 'Sent request. Please wait travel admin to approve it',
        data: dbRequest
      });
    }
    return res.status(500).json({
      status: res.statusCode,
      message: 'Failed to send request email try again later!',
    });
  }

  /**
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} updated request
 */
  static async updateRequest(req, res) {
    const request = req.body;
    const { user } = req;

    if (typeof request.destinations === 'string') {
      request.destinations = JSON.parse(request.destinations);
    }

    const requestToUpdate = await findRequestById(req.params.id);
    if (!requestToUpdate) return res.status(400).json({ status: 400, error: 'This request does not exist' });
    if (!user.line_manager) return res.status(400).json({ status: 400, error: 'Ensure you have a line manager' });
    const confirmedOwner = await confirmRequestOwner(req.params.id, user.id);
    if (!confirmedOwner) return res.status(403).json({ status: 403, error: 'Forbidden action!!! Only owners allowed' });

    const updatedRequest = await updateRequest(req.params.id, request);

    // build base URL
    const baseUrl = `${req.protocol}://${req.header('host')}`;
    // send Request Email to Line Manager

    // send info e-mail to the user
    const responseTwo = sendRequestEmail(user, updatedRequest, baseUrl,
      'Trip request update',
      'Trip request  update');

    if (responseTwo) {
      return res.status(200).json({
        status: res.statusCode,
        message: 'Request Updated and is awaiting review',
        data: updatedRequest
      });
    }
    return res.status(500).json({
      status: res.statusCode,
      message: 'Failed to send request email try again later!',
    });
  }

  /**
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} updated request
 */
  static async mostTravelledDestinations(req, res) {
    if (req.query.mostTraveledDestination === 'true') {
      const allDestinations = [];
      const allDestinationsIds = [];

      const allRequests = await fetchApprovedRequests();
      if (allRequests.length < 1) return res.status(200).json({ status: res.statusCode, message: 'The most traveled destination is not found because we currently don\'t have requests' });
      for (let i = 0; i < allRequests.length; i++) {
        allDestinations.push(allRequests[i].dataValues.destinations);
      }

      for (let i = 0; i < allDestinations.length; i++) {
        for (let j = 0; j < allDestinations[i].length; j++) {
          allDestinationsIds.push(allDestinations[i][j].destination_id);
        }
      }

      const mostTravelledCity = await findMostTravelledDestination(allDestinationsIds);
      if (!mostTravelledCity) return res.status(200).json({ status: res.statusCode, message: 'All the cities have the same amount of trips' });

      return res.status(200).json({
        status: res.statusCode,
        message: `${mostTravelledCity.dataValues.name} is the most travelled destination`,
        data: mostTravelledCity.dataValues
      });
    }
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
  static async requestAction(req, res) {
    const { id, action, token } = req.params;
    const { role_value: roleValue } = req.user || {};
    const role = roleValue || 0;
    // making redis client.hget & hdel return promise
    const hGetAsync = promisify(redisClient.hget).bind(redisClient);
    const hDelAsync = promisify(redisClient.hdel).bind(redisClient);
    // only manager can approve/reject w/o hash token if authenticated
    if (!token && role < 4) {
      return res.status(403).json({
        status: res.statusCode,
        message: `Manager only can ${action} request`
      });
    }
    if (token) {
      // check hash if is correct
      const storedHash = await hGetAsync('requests_otp', id);
      if (storedHash !== token) {
        return res.status(400).json({
          status: res.statusCode,
          message: `Invalid  ${action} URL provided!`
        });
      }
    }
    const [rowUpdated, rows] = await actionOnTrip(id, action);
    const [request] = rows;


    const user = await findUserById(request.user_id);
    if (rowUpdated === 0) {
      return res.status(200).json({
        status: res.statusCode,
        message: 'The request with the given id does not exists'
      });
    }
    // remove stored token
    await hDelAsync('requests_otp', id);
    // sending action made emails
    const decision = action === 'approve' ? 'congratulation We accepted It ' : 'Sorry am affraid to tell that we can\'t accept it';
    RequestController.sendUserEmail('Trip request update', 'Decision made', 'was carefully review', user, request, decision);
    // emit notification
    eventEmitter.emit('travel_request_response', request);
    // release room in accommodation
    if (request.status === 'Rejected') {
      sign = '+';
      status = true;
      request.destinations
        .map((destination) => destination.accomodation_id)
        .forEach((accommodation) => updateAccommodations(accommodation, sign));
      request.destinations
        .map((destination) => destination.room_id)
        .forEach((room) => changeRoomStatus(room, status))
    }
    // return reponse to user
    return res.status(200).json({
      status: res.statusCode,
      message: action === 'approve'
        ? 'Trip request Approved' : 'Trip request rejected'
    });
  }

  /**
   * @func managerRequests
   * @param {*} req
   * @param {*} res
   * @returns {*} requests
   */
  static async managerRequests(req, res) {
    if (req.user.role_value < 7) {
      return res.status(403).json({
        status: res.statusCode,
        message: 'You must be a manager to access this URL'
      });
    }
    // get array of user ids that i manage
    const userIds = await managerUsers(req.user.email);
    // find requests for those above users
    const { sort } = req.query;
    const requests = await requestByIds(userIds, v.capitalize(sort, true));
    if (requests.length > 0) {
      return res.status(200).json({
        status: res.statusCode,
        message: 'requests from user\'s you manage',
        data: requests
      });
    }
    return res.status(200).json({
      status: res.statusCode,
      message: 'No requests found!'
    });
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
