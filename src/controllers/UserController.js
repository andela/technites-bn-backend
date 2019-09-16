/* eslint-disable no-unused-vars */
import bcrypt from 'bcrypt';
import Util from '../utils/Utils';
import Mail from '../utils/Mail';
import redisClient from '../utils/RedisConnection';
import UserService from '../services/UserServices';
import { getPublicProfile } from '../utils/UserUtils';
import AuthenticationHelper from '../utils/AuthHelper';
import Response from '../utils/Response';

const util = new Util();
const mail = new Mail();
const { jwtSign, jwtVerify, comparePassword } = AuthenticationHelper;
const response = new Response();
const {
  addUser,
  findUserByEmail,
  storeToken,
  updateCredentials,
  sendConfirmationEmail,
  storedToken,
  destroyToken
} = UserService;
let msgType = null;
/**
 * @class UserController
 */
class UserController {
  /**
     * @description set the diffrent states of a user
     */
  constructor() {
    this.userToken = null;
  }

  /**
   * @param {Object} req object
   * @param {Object} res object
   * @returns {Object} res
   */
  static async register(req, res) {
    const foundUser = await findUserByEmail(req.body.email);
    if (foundUser) {
      res.status(409).send({ status: 409, error: `User with email ${req.body.email} already exists` });
    } else {
      req.body.is_admin = false;
      req.body.password = bcrypt.hashSync(req.body.password, 8);
      const newUser = await addUser(req.body);
      const token = jwtSign(req.body);

      // check if user is registered before sending user a verification email
      const searchUser = await findUserByEmail(req.body.email);
      if (!searchUser) return res.status(404).json({ status: 404, error: 'Email is not registered' });

      sendConfirmationEmail(token, searchUser.email);

      res.status(201).send({
        status: 201, message: 'Sign up successful. Please confirm your account by clicking on the verification link in the email we sent you', data: getPublicProfile(newUser), token
      });
    }
  }

  /**
   * @description contoller function that logs a user in
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} user - Logged in user
   */
  static async loginUser(req, res) {
    const { email, password } = req.body;
    const searchUser = await findUserByEmail(email);
    if (!searchUser) return res.status(401).json({ status: 401, error: 'Invalid user credentials' });
    const comparePass = comparePassword(password, searchUser.password);
    if (!comparePass) return res.status(404).json({ status: 404, error: 'Invalid user credentials' });
    const {
      password: xx, createdAt, updatedAt, ...user
    } = searchUser;
    const token = jwtSign(user);

    response.setSuccess(200, 'You have successfully logged in', { token, user });
    response.send(res);
  }

  /**
   * @description contoller function that logs a user out
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} user - Logged in user
   */
  static async logoutUser(req, res) {
    const { email } = req.user;
    try {
      redisClient.set(email, req.token, () => {
      });
      response.setSuccess(200, 'You have logged out');
      return response.send(res);
    } catch (error) {
      res.status(500).json({ status: res.statusCode, error: 'Oops something went wrong!' });
    }
  }


  /**
 *
 * @param {req} req - Receive Email
 * @param {res} res for reset
 * @returns {token} - it returns a token
 */
  static async reset(req, res) {
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
        mail.setMessage(req.body.email, token, searchUser.firstname, req.body.email, msgType = 'ResetRequest');
        return mail.send(res);
      });
    } catch (error) {
      util.setError(409, 'Failed to send email request');
      return util.send(res);
    }
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
          util.setError(400, 'You have already reset your password, request another reset if you dont remember your password');
          return util.send(res);
        }
        // Decode token
        const user = jwtVerify(verifyToken.token);
        // Check whether token is used for resetting only
        if (!user.use === 'Reset') {
          util.setError(400, 'The token used here is not for resetting password, Use the appropriate one');
          return util.send(res);
        }
        // encrypt password
        const newpassword = bcrypt.hashSync(req.body.password, 8);
        // Update credentials
        const newValidity = false;
        updateCredentials(user.email, newpassword).then(() => {
          destroyToken(req.params.token, newValidity).then(() => {
            mail.setMessage(user.email, req.params.token, 'User', user.email, msgType = 'Reset');
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
}

export default UserController;
