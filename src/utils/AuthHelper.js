import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();
const { JWT_SECRET } = process.env;
const SaltRounds = 8;
/**
 * @class AuthHelper
 */
class AuthHelper {
  /**
   * @param {Object} payload object
   * @param {Object} time object
   * @returns {Object} token
   */
  static jwtSign(payload, time = '24h') {
    // remove password from User Model
    if ('password' in payload) {
      const { password, ...patchedUser } = payload;
      return jwt.sign(patchedUser, JWT_SECRET, { expiresIn: time });
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: time });
  }

  /**
   * @function jwtVerify
   * @param {String} token String
   * @returns {Object} decoded token
   */
  static jwtVerify(token) {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  }

  /**
   * @function comparePassword
   * @param  {String} password string
   * @param  {String} hash string
   * @returns {Boolean} compare result
   */
  static comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  /**
   * @function hashPassword
   * @param  {String} password
   * @returns {String} hash
   */
  static hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(SaltRounds));
  }
}

export default AuthHelper;
