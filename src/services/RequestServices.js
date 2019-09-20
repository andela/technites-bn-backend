/* eslint-disable no-irregular-whitespace */
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import database from '../database/models';
import getRequestConfirmation from '../utils/ConfirmationRequest';

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
   * @param  {String} token
   * @param  {Object} user
   * @param  {Object} request
   * @returns {Object} result;
   */
  static async sendRequestConfirmation(token, user, request) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    let message = {
      to: user.email,
      from: process.env.EMAIL_MESSAGE_FROM,
      subject: 'Request Confirmation',
      html: getRequestConfirmation(token, user, request),
    };

    if (process.env.NODE_ENV === 'test') {
      message = { ...message, mail_settings: { sandbox_mode: { enable: true } } };
    }

    return sgMail.send(message);
  }
}

export default UserRequest;
