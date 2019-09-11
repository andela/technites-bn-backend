import bcrypt from 'bcrypt';
import userService from '../services/UserServices';
import { getPublicProfile } from '../utils/UserUtils';
import AuthenticationHelper from '../utils/AuthHelper';
import Response from '../utils/Response';

const response = new Response();
const { jwtSign } = AuthenticationHelper;

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
      res.status(201).send({
        status: 201, message: 'user successfully registered', data: getPublicProfile(newUser), token
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
}


export default UserController;
