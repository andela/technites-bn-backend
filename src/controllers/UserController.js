/* eslint-disable consistent-return */
/* eslint-disable radix */
/* eslint-disable max-len */
/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-unresolved */
import bcrypt from 'bcrypt';
import userService from '../services/UserServices';
import { getPublicProfile } from '../utils/UserUtils';
import AuthenticationHelper from '../utils/AuthHelper';

const { jwtSign } = AuthenticationHelper;
/**
 * class that contains user controller
 */
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
}


export default UserController;
