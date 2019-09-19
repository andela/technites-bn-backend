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
   * @param {*} next  Calls the next route passing the user and the verified token
   * in the request object
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
}

export default UserAuthentication;
