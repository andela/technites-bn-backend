import AuthHelper from '../utils/AuthHelper';
import userService from '../services/UserServices';

const { jwtVerify } = AuthHelper;

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

      const searchUser = await userService.findUserByEmail(payload.email);
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
}
export default UserAuthentication;
