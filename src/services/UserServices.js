/* eslint-disable no-plusplus */
/* eslint-disable no-useless-catch */
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import Sequelize from 'sequelize';
import database from '../database/models';
import getConfirmationEmail from '../utils/ConfirmationEmail';
import checkService from '../utils/UserServicesResponse';

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
 *  * @param {object} tokenOwner
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


  /**
   *
   * @param {*} id
   * @param {*} profile
   * @returns {*} updated profile
   */
  static async updateProfile(id, profile) {
    const checkProfile = await database.User.findOne({
      where: { id }
    });

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
      attributes:
      ['id', 'firstname',
        'lastname', 'email',
        'username', 'is_verified',
        'role_value', 'phone', 'gender',
        'dob', 'address', 'country',
        'language', 'currency', 'image_url',
        'company', 'department', 'line_manager',
        'createdAt', 'updatedAt'],
      where: {
        id,
        [Op.not]: [{ role_value: 7 }]
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
    return checkService(searchUser);
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
    return checkService(users);
  }
}

export default UserService;
