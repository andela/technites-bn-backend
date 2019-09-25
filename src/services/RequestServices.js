/* eslint-disable no-irregular-whitespace */
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
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
 * @param {*} destinationId
 * @returns {*} locations
 */
  static async findDestination(destinationId) {
    const destination = await database.location.findOne({
      where: { id: destinationId }
    });
    return destination.dataValues.name;
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
    const destination = await UserRequest.findDestination(request.destinations);
    let message = {
      to: user.line_manager,
      from: process.env.EMAIL_MESSAGE_FROM,
      subject: 'Request Confirmation',
      html: getRequestConfirmation(token, user, request, origin, destination),
    };
    if (msgType === 'Request Update') {
      message.subject = 'Request Updated';
      message.html = getRequestUpdateConfirmation(token, user, request, origin, destination);
    }

    if (process.env.NODE_ENV === 'test') {
      message = { ...message, mail_settings: { sandbox_mode: { enable: true } } };
    }
    await UserRequest.sendUserEmail(user, request, origin, destination);
    return sgMail.send(message);
  }

  /**
   *
   * @param {*} user
   * @param {*} request
   * @param {*} origin
   * @param {*} destination
   * @returns {*}  email sent to requester
   */
  static async sendUserEmail(user, request, origin, destination) {
    let message = {
      to: user.email,
      from: process.env.EMAIL_MESSAGE_FROM,
      subject: 'Request Confirmation',
      html: getUserConfirmationEmail(user, request, origin, destination),
    };

    if (process.env.NODE_ENV === 'test') {
      message = { ...message, mail_settings: { sandbox_mode: { enable: true } } };
    }
    return sgMail.send(message);
  }
}

export default UserRequest;
