/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
import bcrypt from 'bcrypt';
import moment from 'moment';
import Sequelize from 'sequelize';
import Util from '../utils/Utils';
import Mail from '../utils/Mail';
import redisClient from '../utils/RedisConnection';
import UserService from '../services/UserServices';
import { getPublicProfile } from '../utils/UserUtils';
import AuthenticationHelper from '../utils/AuthHelper';
import database from '../database/models';
import { uploadImage } from '../utils/ImageUploader';

const { Op } = Sequelize;
const util = new Util();
const mail = new Mail();
const { jwtSign, jwtVerify, comparePassword } = AuthenticationHelper;
const {
  addUser,
  findUserByEmail,
  storeToken,
  updateCredentials,
  sendConfirmationEmail,
  storedToken,
  destroyToken,
  updateProfile,
  findUserById,
  displayAllUsers,
  findUserByCompany,
  updateEmailNotification,
  updateNotificationsAsSeen,
  getAllUserNotifications
} = UserService;

let msgType = null;
/**
 * @class UserController
 */
class UserController {
  /**
   * @param {Object} req object
   * @param {Object} res object
   * @param {Object} next object
   * @returns {Object} res
   */
  static async register(req, res, next) {
    try {
      const foundUser = await findUserByEmail(req.body.email);
      if (foundUser) {
        res.status(409).send({ status: 409, error: `User with email ${req.body.email} already exists` });
      } else {
        req.body.is_verified = false;
        req.body.role_value = 1;
        req.body.password = bcrypt.hashSync(req.body.password, 8);
        const newUser = await addUser(req.body);
        const token = jwtSign({ email: req.body.email });
        const searchUser = await findUserByEmail(req.body.email);
        if (!searchUser) {
          return res.status(404).json({ status: 404, error: 'Email is not registered' });
        }
        sendConfirmationEmail(token, searchUser.email);
        res.status(201).send({
          status: 201,
          message:
          'Sign up successful. Please confirm your account by clicking on the verification link in the email we sent you',
          data: getPublicProfile(newUser),
          token
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description contoller function that logs a user in
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - response object
   * @returns {object} user - Logged in user
   */
  static async loginUser(req, res, next) {
    const { email, password } = req.body;
    try {
      const searchUser = await findUserByEmail(email);
      if (!searchUser) {
        return res
          .status(401)
          .json({ status: 401, error: 'Invalid user credentials' });
      }
      const isVerified = searchUser.is_verified;
      if (!isVerified) {
        return res
          .status(401)
          .json({ status: 401, error: 'Email verification required' });
      }
      const comparePass = comparePassword(password, searchUser.password);
      if (!comparePass) {
        return res
          .status(404)
          .json({ status: 404, error: 'Invalid user credentials' });
      }
      const {
        password: xx, createdAt, updatedAt, ...user
      } = searchUser;
      const token = jwtSign({ email: searchUser.email });
      util.setSuccess(200, 'You have successfully logged in', { token, user });
      util.send(res);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description contoller function that logs a user out
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - middleware object
   * @returns {object} user - Logged in user
   */
  static async logoutUser(req, res, next) {
    const { email } = req.user;
    try {
      redisClient.set(email, req.token);
      util.setSuccess(200, 'You have logged out');
      return util.send(res);
    } catch (error) {
      res.status(500).json({ status: res.statusCode, error: 'Oops something went wrong!' });
    }
  }

  /**
 *
 * @param {req} req - Receive Email
 * @param {res} res for reset
 * @param {*} next
 * @returns {token} - it returns a token
 */
  static async reset(req, res, next) {
    try {
      // check whether email address is recorded
      const searchUser = await findUserByEmail(req.body.email);
      if (!searchUser) {
        util.setError(404, 'Email not found');
        return util.send(res);
      }
      // sign token
      const token = jwtSign({ email: req.body.email, use: 'Reset' }, '600s');
      // store password reset
      const userinfo = {
        user_id: searchUser.id,
        token,
        valid: true
      };
      storeToken(userinfo).then(() => {
        // send email
        mail.setMessage(
          req.body.email,
          token,
          searchUser.firstname,
          req.body.email,
          (msgType = 'ResetRequest')
        );
        return mail.send(res);
      });
    } catch (error) { return next(error); }
  }

  /**
   *
   * @param {req} req - Receive Email
   * @param {res} res for reset
   * @returns {message} - it returns a successful message
   */
  static async updateCredentials(req, res) {
    // check if password looks alike
    if (req.body.password === req.body.confirm_password) {
      try {
        // check whether token is valid
        const verifyToken = await storedToken(req.params.token);
        if (!verifyToken.valid === true) {
          util.setError(
            400,
            'You have already reset your password, request another reset if you dont remember your password'
          );
          return util.send(res);
        }
        // Decode token
        const user = jwtVerify(verifyToken.token);
        // Check whether token is used for resetting only
        if (!user.use === 'Reset') {
          util.setError(
            400,
            'The token used here is not for resetting password, Use the appropriate one'
          );
          return util.send(res);
        }
        // encrypt password
        const newpassword = bcrypt.hashSync(req.body.password, 8);
        // Update credentials
        const newValidity = false;
        updateCredentials(user.email, newpassword).then(() => {
          destroyToken(req.params.token, newValidity).then(() => {
            mail.setMessage(
              user.email,
              req.params.token,
              'User',
              user.email,
              (msgType = 'Reset')
            );
            return mail.send(res);
          });
        });
      } catch (error) {
        util.setError(400, 'Oops Something went wrong');
        return util.send(res);
      }
    } else {
      util.setError(401, 'Passwords do not match');
      return util.send(res);
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {*}  edited profile
   */
  static async editProfile(req, res) {
    // Check if user is verified
    if (!req.user.is_verified === true) {
      util.setError(401, 'Please Verify your account first');
      return util.send(res);
    }
    // can not update to an existing email
    // check if user provided email
    if (req.body.email) {
      // check if email provided by user is the same as the one signed
      if (req.user.email !== req.body.email) {
        // Search if email already exists
        const searchUser = await findUserByEmail(req.body.email);
        if (searchUser) {
          util.setError(
            409,
            'The email you are trying to use is already registered'
          );
          return util.send(res);
        }
      }
    }
    const profile = req.body;
    // Add picture if user added it
    if (req.files && req.files.image) {
      // uploading to cloudinary
      const imageUrl = await uploadImage(req.files.image.path);
      if (!imageUrl) {
        util.setError(415, 'Please Upload a valid image');
        return util.send(res);
      }
      profile.image_url = imageUrl;
    }
    // update profile
    updateProfile(req.user.id, profile).then(() => {
      util.setSuccess(200, 'Profile Updated!', profile);
      return util.send(res);
    });
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {*} user
   */
  static async viewSingleProfile(req, res) {
    // Ensure passed value from the params is an integer value
    if (isNaN(req.params.id)) {
      util.setError(400, 'User id must be an Integer');
      return util.send(res);
    }
    const searchUser = await findUserById(req.params.id);
    if (!searchUser) {
      util.setError(404, 'User not found');
      return util.send(res);
    }
    const { password, ...foundUser } = searchUser;
    util.setSuccess(200, 'User found!', foundUser);
    return util.send(res);
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {*} all users
   */
  static async viewAllProfiles(req, res) {
    const allUsers = await displayAllUsers();
    util.setSuccess(200, 'All users!', allUsers);
    return util.send(res);
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {*} all users
   */
  static async viewProfilesByCompany(req, res) {
    const allUsers = await findUserByCompany(req.params.company);
    if (allUsers.length === 0) {
      util.setError(404, `No users found working for ${req.params.company}`);
      return util.send(res);
    }
    util.setSuccess(200, 'All users!', allUsers);
    return util.send(res);
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns {*} all users
   */
  static async enableOrDisableEmailNotifications(req, res) {
    await updateEmailNotification(req.user.email, req.query.emailAllowed);
    if (req.query.emailAllowed === 'true') {
      return res
        .status(200)
        .json({
          status: res.statusCode,
          message: 'You subscribed to email notifications'
        });
    }

    return res
      .status(200)
      .json({
        status: res.statusCode,
        message: 'You unsubscribed to email notifications'
      });
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {*} user
   */
  static async getUserTrips(req, res, next) {
    const { years, months, days } = req.query;
    // convert to days
    req.user.id = Number(req.user.id);
    req.params.id = Number(req.params.id);
    const dataArray = [years * 365, months * 30, days];
    const daysArray = dataArray.filter((number) => number > 0);
    const totalDays = daysArray.reduce((a, b) => a + b, 0);
    if (totalDays === 0) {
      return res
        .status(400)
        .send({ status: res.statusCode, error: 'Incomplete query params' });
    }
    // get startt date with moment
    const startDate = moment()
      .subtract(totalDays, 'day')
      .toDate();
    const currentDate = moment().toDate();
    if (
      req.user.id !== req.params.id
      && (req.user.role_value === 1
        || req.user.role_value === 4
        || req.user.role_value <= 0
        || req.user.role_value > 7)
    ) {
      return res
        .status(401)
        .send({ status: res.statusCode, error: 'Not allowed' });
    }
    try {
      const result = await database.Request.findAll({
        where: {
          user_id: req.params.id,
          status: 'Approved',
          departure_date: {
            [Op.between]: [startDate, currentDate]
          }
        }
      });
      const totalTrips = result.length;
      return res
        .status(200)
        .send({ status: res.statusCode, totalTrips, data: result });
    } catch (e) {
      next(e);
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {*} message
   */
  static async markNotificationsAsSeen(req, res, next) {
    try {
      await updateNotificationsAsSeen(req.user.id);
      return res
        .status(200)
        .json({
          status: res.statusCode,
          message: 'All notifications are marked as read'
        });
    } catch (e) {
      next(e);
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {*} all notifications
   */
  static async getAllNotifications(req, res, next) {
    let results = null;
    let notifications = null;
    try {
      if (req.query.seen) {
        results = await getAllUserNotifications(req.user.id, req.query.seen);
        notifications = results.rows.map(
          ({ dataValues: notification }) => notification
        );
        return UserController.sendNotificationResponse(
          res,
          results.count,
          notifications
        );
      }

      results = await getAllUserNotifications(req.user.id);
      notifications = results.rows.map(
        ({ dataValues: notification }) => notification
      );
      UserController.sendNotificationResponse(
        res,
        results.count,
        notifications
      );
    } catch (e) {
      next(e);
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {*} all notifications
   */
  static async markOneSeenNotification(req, res, next) {
    try {
      const id = Number(req.params.id);
      const results = await getAllUserNotifications(req.user.id);
      const foundNot = results.rows.find((not) => not.id === Number(id));
      await database.Notification.update({ seen: true }, { where: { id } });
      res.status(200).send({ data: foundNot });
    } catch (e) {
      next(e);
    }
  }

  /**
   * @param {*} res
   * @param {*} count
   * @param {*} notifications
   * @returns {*} all notifications
   */
  static async sendNotificationResponse(res, count, notifications) {
    return res.status(200).json({
      status: res.statusCode,
      message: 'All notifications are successfully retrieved',
      number: count,
      data: notifications
    });
  }
}

export default UserController;
