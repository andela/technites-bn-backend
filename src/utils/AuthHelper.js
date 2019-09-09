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
   * @param {Object} user object
   * @returns {Object} token
   */
  static jwtSign(user) {
    // remove password from User Model
    const { password, ...patchedUser } = user;
    return jwt.sign(patchedUser, JWT_SECRET, { expiresIn: '24h' });
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

  /**
   *
   * @param {*} email
   * @returns {object} - returns a jwt sign token
   */
  static jwtSignReset(email) {
    return jwt.sign({ email }, JWT_SECRET, { expiresIn: '600s' });
  }
}

export default AuthHelper;
