/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable no-irregular-whitespace */
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import moment from 'moment';
import database from '../database/models';
import getRequestConfirmation from '../utils/ConfirmationRequest';
import getRequestUpdateConfirmation from '../utils/UpdateRequest';
import getUserConfirmationEmail from '../utils/UserRequest';

dotenv.config();

/**
 * @class UserService
 * @description user service methods
 */
class UserRequest {
  /**
   *
   * @param {Integer} req
   * @param {Integer} res
   * @returns {Object} user
   */
  static async fetchRequests(req) {
    return database.Request.findAll({ where: { user_id: req.params.id } });
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
    await database.Request.update(request, { where: { id } });
    return request;
  }

  /**
   *
   * @param {Integer} requestId
   * @returns {Object} user
   */
  static async approveTrip(requestId) {
    return database.Request.update(
      { status: 'Approved' },
      { where: { id: requestId } }
    );
  }

  /**
   *
   * @param {Integer} requestId
   * @returns {Object} user
   */
  static async rejectTrip(requestId) {
    return database.Request.update(
      { status: 'Rejected' },
      { where: { id: requestId } }
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
    return origin.dataValues.name;
  }

  /**
 *
 * @param {*} destinations
 * @returns {*} locations
 */
  static async findDestination(destinations) {
    const foundDestinations = [];
    for (let i = 0; i < destinations.length; i++) {
      const { dataValues } = await database.location.findOne({
        where: { id: destinations[i].destination_id }
      });

      foundDestinations.push(dataValues.name);
    }

    return foundDestinations;
  }

  /**
   * @param  {String} token
   * @param  {Object} user
   * @param  {Object} request
   * @param {Object} msgType
   * @returns {Object} result;
   */
  static async sendRequestConfirmation(token, user, request, msgType) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const origin = await UserRequest.findOrigin(request.location_id);
    const stopCities = await UserRequest.findDestination(request.destinations);
    const destination = stopCities[stopCities.length - 1];

    let message = {
      to: user.line_manager,
      from: process.env.EMAIL_MESSAGE_FROM,
      subject: 'Request Confirmation',
      html: getRequestConfirmation(token, user, request, origin, destination, stopCities),
    };
    if (msgType === 'Request Update') {
      message.subject = 'Request Updated';
      message.html = getRequestUpdateConfirmation(token, user, request, origin, destination);
    }

    if (process.env.NODE_ENV === 'test') {
      message = { ...message, mail_settings: { sandbox_mode: { enable: true } } };
    }
    await UserRequest.sendUserEmail(user, request, origin, destination, stopCities);
    return sgMail.send(message);
  }

  /**
   *
   * @param {*} user
   * @param {*} request
   * @param {*} origin
   * @param {*} destination
   * @param {*} stopCities
   * @returns {*}  email sent to requester
   */
  static async sendUserEmail(user, request, origin, destination, stopCities) {
    let message = {
      to: user.email,
      from: process.env.EMAIL_MESSAGE_FROM,
      subject: 'Request Confirmation',
      html: getUserConfirmationEmail(user, request, origin, destination, stopCities),
    };

    if (process.env.NODE_ENV === 'test') {
      message = { ...message, mail_settings: { sandbox_mode: { enable: true } } };
    }
    return sgMail.send(message);
  }
}

export default UserRequest;
