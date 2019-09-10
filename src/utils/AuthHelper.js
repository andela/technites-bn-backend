/* eslint-disable lines-between-class-members */
/* eslint-disable require-jsdoc */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();
const { JWT_SECRET } = process.env;
const SaltRounds = 8;

class AuthHelper {
  static jwtSignReset(email) {
    return jwt.sign({ email }, JWT_SECRET, { expiresIn: '600s' });
  }

  static jwtVerify(token) {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  }

  static comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  static hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(SaltRounds));
  }
}

export default AuthHelper;
