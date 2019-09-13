import redisClient from '../utils/RedisConnection';
import Response from '../utils/Response';
import UserServices from '../services/UserServices';
import AuthHelper from '../utils/AuthHelper';

const { jwtVerify } = AuthHelper;
const { findUserByEmail } = UserServices;

const response = new Response();

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
    try {
      const token = req.params.token || req.header('Authorization').replace('Bearer ', '');
      const payload = jwtVerify(token);
      const searchUser = await findUserByEmail(payload.email);
      if (!searchUser) return res.status(404).json({ status: 404, error: 'Email is not registered' });
      redisClient.get(payload.email, (err, reply) => {
        if (reply === token) {
          response.setError(401, 'Invalid token');
          return response.send(res);
        }
      });
      const {
        password, createdAt, updatedAt, ...user
      } = searchUser;
      req.user = user;
      next();
    } catch (ex) {
      res.status(400).json({ status: res.statusCode, error: 'Invalid token' });
    }
  }
}

export default UserAuthentication;
