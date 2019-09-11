import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import Response from '../utils/Response';
import UserServices from '../services/UserServices';

const response = new Response();
/**
 * @class UserAuthentication
 */
export default class UserAuthentication {
/**
   * @method loginCheck
   * @description Validates details provided by user when logging in
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - function to pass to next middleware
   * @returns {undefined}
   */
  static async loginCheck(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      response.setError(401, errors.array()[0].msg);
      return response.send(res);
    }


    const { email, password } = req.body;
    const user = await UserServices.findUserByEmail(email);
    if (!user) {
      response.setError(401, 'invalid user credentials');
      return response.send(res);
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      response.setError(403, 'invalid user credentials');
      return response.send(res);
    }
    req.user = user;
    next();
  }
}
