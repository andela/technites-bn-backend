import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import Response from '../utils/Response';
import UserServices from '../services/UserServices';
import AuthHelper from '../utils/AuthHelper';

const response = new Response();

const { jwtVerify } = AuthHelper;
const { findUserByEmail } = UserServices;

/** *
 * @class UserAuthentication
 */
class UserAuthentication {
  /**
   * @param {*} req Object
   * @param {*} res  Object
   * @param {*} next  Object
   * @returns {Object} Response
   */
  static async verifyToken(req, res, next) {
    const token = req.params.token || req.header('Authorization').replace('Bearer ', '');

    try {
      const payload = jwtVerify(token);

      const searchUser = await findUserByEmail(payload.email);
      if (!searchUser) return res.status(404).json({ status: 404, error: 'Email is not registered' });
      const {
        password, createdAt, updatedAt, ...user
      } = searchUser;

      req.user = user;
      next();
    } catch (ex) {
      res.status(400).json({ status: 400, error: 'Invalid token' });
    }
  }

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
    console.log(errors);

    if (!errors.isEmpty()) {
      response.setError(400, UserValidation.formatErrors(errors));
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

export default UserAuthentication;
