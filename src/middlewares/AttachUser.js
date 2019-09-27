import redisClient from '../utils/RedisConnection';
import UserServices from '../services/UserServices';
import AuthHelper from '../utils/AuthHelper';

const { jwtVerify } = AuthHelper;
const { findUserByEmail } = UserServices;

/** *
 * @class AttachUser
 */
class AttachUser {
  /**
   * @description attach user object to req if available
   * @param {*} req Object with the user data
   * @param {*} res  Object with respose to the user
   * @param {*} next  Calls the next route passing the user and the verified token
   * in the request object
   * @returns {Object} Response
   */
  static async reqAttachUser(req, res, next) {
    try {
      const token = req.query.token || req.header('Authorization').replace('Bearer ', '');
      const payload = jwtVerify(token);

      const searchUser = await findUserByEmail(payload.email);
      redisClient.get(payload.email, (err, reply) => {
        if (token === reply) {
          return next();
        }
        if (!searchUser) return next();
        const {
          password, createdAt, updatedAt, ...user
        } = searchUser;
        req.user = user;
        next();
      });
    } catch (ex) {
      next();
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

export default AttachUser;
