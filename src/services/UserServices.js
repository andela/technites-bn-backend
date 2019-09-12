/* eslint-disable no-useless-catch */
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import database from '../database/models';
import getConfirmationEmail from '../utils/ConfirmationEmail';

dotenv.config();

/**
 * @class UserService
 * @description user service methods
 */
class UserService {
  /**
   *
   * @param {Object} newUser
   * @returns {Object} newUser
   */
  static async addUser(newUser) {
    const addedUser = await database.User.create(newUser);
    return addedUser;
  }

  /**
   *
   * @param {Object} userEmail
   * @returns {Object} user
   */
  static async findUserByEmail(userEmail) {
    const user = await database.User.findOne({ where: { email: userEmail } });
    if (!user) return null;
    return user.dataValues;
  }

  /**
   *
   * @param {object} userInfo
   * @returns {object} user
   */
  static async storeToken(userInfo) {
    try {
      return await database.PasswordResets.create(userInfo);
    } catch (error) {
      throw error;
    }
  }

  /**
 *
 * @param {object} userEmail
 * @param {object} password
 * @returns {object} user
 */
  static async updateCredentials(userEmail, password) {
    try {
      const userToUpdate = await database.User.findOne({
        where: { email: userEmail }
      });
      if (userToUpdate) {
        const newUser = {
          password,
        };
        await database.User.update(newUser, { where: { email: userEmail } });
        return newUser;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param  {String} token
   * @param  {String} email
   * @returns {Object} result;
   */
  static async sendConfirmationEmail(token, email) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    let message = {
      to: email,
      from: process.env.EMAIL_MESSAGE_FROM,
      subject: 'Confirmation email',
      html: getConfirmationEmail(token),
    };

    if (process.env.NODE_ENV === 'test') {
      message = { ...message, mail_settings: { sandbox_mode: { enable: true } } };
    }

    return sgMail.send(message);
  }
}

export default UserService;
