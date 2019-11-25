import dotenv from 'dotenv';
import models from '../database/models';
import AuthHelper from '../utils/AuthHelper';

dotenv.config();

const { FRONTEND_URL } = process.env;
const { jwtSign } = AuthHelper;
/**
 * @class AuthController
 * @classdesc AuthController
 */
class AuthController {
  /**
   * Login Callback method.
   * @function loginCallback
   * @param {Object} req request Object.
   * @param {Object} res response Object.
   * @returns {Object} response Object.
   */
  static async loginCallback(req, res) {
    const [dbUser] = await models.User.findOrCreate({
      where: { email: req.user.email },
      defaults: req.user
    });
    // omit password and other unnecessary fields
    const {
      password, createdAt, updatedAt, ...user
    } = dbUser.dataValues;
    const token = jwtSign(user);

    return res.redirect(
      `${FRONTEND_URL}/login?token=${token}&status=ok`
    );
  }
}

export default AuthController;
