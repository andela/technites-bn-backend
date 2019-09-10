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
import AuthenticationHelper from '../utils/AuthHelper';

const util = new Util();
const mail = new Mail();
const { jwtSignReset, jwtVerify } = AuthenticationHelper;
class UserController {
  static async reset(req, res) {
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
      // send email
      mail.setMessage(req.body.email, token, searchUser.firstname, req.body.email);
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
