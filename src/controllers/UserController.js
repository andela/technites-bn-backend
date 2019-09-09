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

const util = new Util();
const mail = new Mail();
const { jwtSign, jwtSignReset, jwtVerify } = AuthenticationHelper;
class UserController {
  /**
   * @api {post} /api/user Create user
   * @apiName Create new user
   * @apiPermission user
   * @apiGroup User
   *
   * * @apiParam  {String} [username] username
   * @apiParam  {String} [email] email
   * @apiParam  {String} [password] password
   * @apiParam  {String} [firstname] Status
   * @apiParam  {String} [lastname] Status
   *
   * @apiSuccess (200) {Object} mixed `User` object
  */

  /**
   * @param {object} [req] object
   * @param {object} [res] object
   * @returns {object} user on succesful sign up\q
   * */
  static async register(req, res) {
    /**
     * @returns user object on succesful sign up
    */
    const foundUser = await userService.findUserByEmail(req.body.email);
    if (foundUser) {
      res.status(409).send({ status: 409, error: `User with email ${req.body.email} already exists` });
    } else {
      req.body.is_admin = false;
      req.body.password = bcrypt.hashSync(req.body.password, 8);
      const newUser = await userService.addUser(req.body);
      const token = jwtSign(req.body);
      res.status(201).send({
        status: 201, message: 'user successfully registered', data: getPublicProfile(newUser), token
      });
    }
  }

  static async reset(req, res) {
    // check whether email address is correct

    // check whether email address is recorded
    const searchUser = await userService.findUserByEmail(req.body.email);
    if (!searchUser) {
      util.setError(409, 'Email not found');
      return util.send(res);
    }
    // sign token
    const token = jwtSignReset(req.body.email);
    // store password reset
    const userinfo = {
      user_id: searchUser.id,
      token
    };
    const savetoken = await userService.storeToken(userinfo).then(() => {
    // creating mail message
      const msg = {
        to: req.body.email,
        subject: 'Password Reset',
        text: 'Password Reset',
        html: `<strong><h1>Barefoot Nomad</h1><h3>Dear ${searchUser.firstname} You have requested to reset your password,<br><br> click on this link to reset your password</h3></strong><br><br> <a href="localhost:3000/api/v1/auth/reset/${token}">localhost:3000/api/v1/auth/reset/${token}</a>`
      };
      // send email
      mail.setMessage(msg.to, msg.subject, msg.text, msg.html);
      return mail.send(res);
    });
  }

  static async updateCredentials(req, res) {
    // check if password looks alike
    if (req.body.password === req.body.confirm_password) {
    // Decode token
      try {
        const user = jwtVerify(req.params.token);
        // encrypt password
        const newpassword = bcrypt.hashSync(req.body.password, 8);
        // Update credentials
        const updateUser = await userService.updateCredentials(user.email, newpassword).then(() => {
          util.setSuccess(200, 'Password reset succesfully');
          return util.send(res);
        });
      } catch (error) {
        util.setError(409, 'Token has expired, please try again');
        return util.send(res);
      }
    } else{
      util.setError(409, 'Password mismatch');
      return util.send(res);
    }
  }
}

export default UserController;
