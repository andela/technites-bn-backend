import redisClient from '../utils/RedisConnection';
import UserServices from '../services/UserServices';
import AuthHelper from '../utils/AuthHelper';

const { jwtVerify } = AuthHelper;
const { findUserByEmail } = UserServices;

/** *
 * @class UserAuthentication
 */
class UserAuthentication {
  /**
   * @description verifies the token of a user about to login
   * @param {*} req Object with the user data
   * @param {*} res  Object with respose to the user
<<<<<<< HEAD
   * @param {*} next  Calls the next route passing the user and the verified token
   * in the request object
=======
   * @param {*} next  Calls the next route handler
>>>>>>>  - set up migrations to add role column
   * @returns {Object} Response
   */
  static async verifyToken(req, res, next) {
    try {
      const token = req.params.token || req.header('Authorization').replace('Bearer ', '');
      const payload = jwtVerify(token);

      const searchUser = await findUserByEmail(payload.email);
      redisClient.get(payload.email, (err, reply) => {
        if (token === reply) {
          return res.status(401).json({ status: 401, error: 'Login required' });
        }
        if (!searchUser) return res.status(404).json({ status: 404, error: 'Email is not registered' });
        const {
          password, createdAt, updatedAt, ...user
        } = searchUser;
        req.user = user;
        req.token = token;
        next();
      });
    } catch (ex) {
      res.status(400).json({ status: res.statusCode, error: 'Invalid token' });
    }
  }

  /**
   * @description verifies if the user has role admin
   * @param {*} req Object with the user data
   * @param {*} res  Object with respose to the user
   * @param {*} next  Calls the next route handler
   * @returns {Object} Response
   */
  static async isSuperAdmin(req, res, next) {
    if (req.user.role_value === 7) next();
    else res.status(401).send({ status: 401, message: 'Not authorized' });
  }
}

export default UserAuthentication;
