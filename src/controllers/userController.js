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
import AuthenticationHelper from '../utils/AuthenticationHelper';

const util = new Util();
const mail = new Mail();
const { jwtSignReset, jwtVerify } = AuthenticationHelper;
class UserController {
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
