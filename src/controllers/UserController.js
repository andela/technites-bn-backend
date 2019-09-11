/* eslint-disable no-else-return */
/* eslint-disable keyword-spacing */
/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Util from '../utils/Utils';
import Mail from '../utils/Mail';
import userService from '../services/UserServices';
import { getPublicProfile } from '../utils/UserUtils';
import AuthenticationHelper from '../utils/AuthHelper';
import Response from '../utils/Response';

const util = new Util();
const mail = new Mail();
const { jwtSign, jwtSignReset, jwtVerify } = AuthenticationHelper;
const response = new Response();

/**
 * @class UserController
 */
class UserController {
  /**
   * @param {Object} req object
   * @param {Object} res object
   * @returns {Object} res
   */
  static async register(req, res) {
    const foundUser = await userService.findUserByEmail(req.body.email);
    if (foundUser) {
      res.status(409).send({ status: 409, error: `User with email ${req.body.email} already exists` });
    } else {
      req.body.is_admin = false;
      req.body.password = bcrypt.hashSync(req.body.password, 8);
      const newUser = await userService.addUser(req.body);
      const token = jwtSign(req.body);

      // check if user is registered before sending user a verification email
      const searchUser = await userService.findUserByEmail(req.body.email);
      if (!searchUser) return res.status(404).json({ status: 404, error: 'Email is not registered' });

      userService.sendConfirmationEmail(token, searchUser.email);

      res.status(201).send({
        status: 201, message: 'Signed up successful, please confirm your account by clicking on the verification link in the email we sent you', data: getPublicProfile(newUser), token
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
    const { password, ...currentUser } = req.user;
    try {
      const userToken = jwtSign(currentUser);
      const resposeData = {
        user: currentUser,
        userToken
      };
      response.setSuccess(200, 'you have successfully logged in', resposeData);
      response.send(res);
    } catch (error) {
      response.setError(500, 'ServerError - Could not generate token');
      return response.send(res);
    }
  }

  /**
 *
 * @param {req} req - Receive Email
 * @param {res} res for reset
 * @returns {token} - it returns a token
 */
  static async reset(req, res) {
    try{
      // check whether email address is recorded
      const searchUser = await userService.findUserByEmail(req.body.email);
      if (!searchUser) {
        util.setError(404, 'Email not found');
        return util.send(res);
      }
      // sign token
      const token = jwtSign({ email: req.body.email }, '600s');
      // store password reset
      const userinfo = {
        user_id: searchUser.id,
        token
      };
      userService.storeToken(userinfo).then(() => {
      // send email
        mail.setMessage(req.body.email, token, searchUser.firstname, req.body.email);
        return mail.send(res);
      });
    }catch (error) {
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
        // Decode token
        const user = jwtVerify(req.params.token);
        // encrypt password
        const newpassword = bcrypt.hashSync(req.body.password, 8);
        // Update credentials
        const updateUser = await userService.updateCredentials(user.email, newpassword).then(() => {
          util.setSuccess(200, 'Password reset succesfully');
          return util.send(res);
        });
      } catch (error) {
        util.setError(401, 'Token has expired, please try again');
        return util.send(res);
      }
    } else{
      util.setError(401, 'Passwords do not match');
      return util.send(res);
    }
  }
}

export default UserController;
