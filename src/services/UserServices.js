/* eslint-disable no-plusplus */
/* eslint-disable no-useless-catch */
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import Sequelize from 'sequelize';
import database from '../database/models';
import getConfirmationEmail from '../utils/ConfirmationEmail';

const { Op } = Sequelize;
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
    try {
      const addedUser = await database.User.create(newUser);
      return addedUser;
    } catch (e) {
      throw Error(e);
    }
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
   * @param {Object} userEmail
   * @returns {Object} true or false
   */
  static async isAutoFill(userEmail) {
    const user = await database.User.findOne({ where: { email: userEmail } });
    if (!user) return null;
    return user.dataValues.auto_fill;
  }

  /**
   * @param {*} autoFill
   * @param {*} email
   * @returns {*} object
   */
  static async autoFill(autoFill, email) {
    return database.User.update({ auto_fill: autoFill }, { where: { email } });
  }

  /**
   * @param {*} userId
   * @returns {*} object
   */
  static async getUserLastRequest(userId) {
    return database.Request.findOne({ where: { user_id: userId }, order: [['id', 'DESC']] });
  }

  /**
 *
 * @param {object} userInfo
 * @param {object} tokenOwner
 * @returns {*} userInfo
 */
  static async storeToken(userInfo) {
    try {
      const searchToken = await database.PasswordResets.findOne({
        where: { user_id: userInfo.user_id }
      });
      if (searchToken) {
        await database.PasswordResets.update(userInfo, { where: { user_id: userInfo.user_id } });
        return userInfo;
      }
      const newToken = await database.PasswordResets.create(userInfo);
      return newToken;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {Object} token
   * @returns {Object} response
   */
  static async storedToken(token) {
    const storedToken = await database.PasswordResets.findOne({ where: { token } });
    if (!storedToken) return null;
    return storedToken.dataValues;
  }

  /**
   * @param {object} id
 * @returns {object} response
 */
  static async findTokenByUserID(id) {
    const storedToken = await database.PasswordResets.findOne({ where: { id } });
    if (!storedToken) return null;
    return storedToken.dataValues;
  }

  /**
 *
 * @param {object} token
 * @returns {object} destroy token
 */
  static async destroyToken(token) {
    try {
      const searchToken = await database.PasswordResets.findOne({
        where: { token }
      });
      if (searchToken) {
        const destroy = {
          valid: false,
        };
        await database.PasswordResets.update(destroy, { where: { token } });
        return destroy;
      }
      return null;
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
      const userToUpdate = await database.User.findOne({ where: { email: userEmail } });
      if (userToUpdate) {
        const newUser = { password, is_verified: true };
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


  /**
   *
   * @param {*} id
   * @param {*} profile
   * @returns {*} updated profile
   */
  static async updateProfile(id, profile) {
    const checkProfile = await database.User.findOne({ where: { id } });

    if (checkProfile) {
      await database.User.update(profile, { where: { id } });
      return profile;
    }
    return null;
  }

  /**
 *
 * @param {*} id
 * @returns {*} user
 */
  static async findUserById(id) {
    const searchUser = await database.User.findOne({
      attributes: {
        exclude: ['password']
      },
      where: {
        id
      }
    });
    if (!searchUser) return null;
    return searchUser.dataValues;
  }

  /**
 *
 * @param {*} company
 * @returns {*} user
 */
  static async findUserByCompany(company) {
    const searchUser = await database.User.findAll({
      attributes: {
        exclude: ['password']
      },
      where: {
        company,
        [Op.not]: [{ role_value: 7 }]
      }
    });
    return searchUser || null;
  }

  /**
   * @returns {*} users
   */
  static async displayAllUsers() {
    const users = await database.User.findAll({
      attributes: {
        exclude: ['password']
      },
      where: { [Op.not]: [{ role_value: 7 }] }
    });
    return users || null;
  }

  /**
   * @param {String} userEmail
   * @param {String} option
   * @returns {Integer} userId
   */
  static async updateEmailNotification(userEmail, option) {
    return database.User.update({ isEmailAllowed: option }, { where: { email: userEmail } });
  }

  /**
   * @param {Integer} userId;
   * @returns {Object} updated field
   */
  static async updateNotificationsAsSeen(userId) {
    return database.Notification.update({ seen: true }, { where: { user_id: userId } });
  }

  /**
   * @param {Integer} userId;
   * @param {Boolean} seen;
   * @returns {Object} updated field
   */
  static async getAllUserNotifications(userId, seen) {
    if (seen === 'false') {
      return database.Notification.findAndCountAll({ where: { user_id: userId, seen } });
    }
    if (seen === 'true') {
      return database.Notification.findAndCountAll({ where: { user_id: userId, seen } });
    }

    return database.Notification.findAndCountAll({ where: { user_id: userId } });
  }
}

export default UserService;
