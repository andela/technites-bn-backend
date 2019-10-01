/* eslint-disable no-plusplus */
import Util from '../utils/Utils';
import UserService from '../services/UserServices';
import AuthenticationHelper from '../utils/AuthHelper';
import HostService from '../services/HostServices';
import MailHelper from '../utils/MailHelper';

const util = new Util();
const {
  jwtSign, hashPassword
} = AuthenticationHelper;
const {
  addUser,
  updateCredentials
} = UserService;
const { findHostByEmail } = HostService;
const { hostTheme, sendEmail } = MailHelper;
/**
 * @class HostController
 */
class HostController {
  /**
 *
 * @param {*} length
 * @param {*} chars
 * @returns {*} alphanumeric value
 */
  static randomString(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  /**
 *
 * @param {*} req
 * @param {*} res
 * @returns {*} host
 */
  static async addHost(req, res) {
    const host = req.body;
    host.username = req.body.firstname + req.body.lastname;
    host.role_value = 0;
    // Generate password
    const password = HostController.randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    // hash password
    host.password = hashPassword(password);
    await addUser(host);
      const content = {
      host,
      title: 'Welcome to Barefoot Nomad',
      password
    };
    const theme = hostTheme(content);
    const emailTitle = 'Welcome to Barefoot Nomad'
    const sent = await sendEmail(
      emailTitle,
      theme,
      req.body.email,
    );
    util.setSuccess(201, 'Host Added succesfully!');
    return util.send(res);
  }

  /**
 *
 * @param {*} req
 * @param {*} res
 * @returns {*} host
 */
  static async resetHost(req, res) {
    const host = await findHostByEmail(req.body.email);
    const newPassword = hashPassword(req.body.password);
    const hostUpdate = await updateCredentials(req.body.email, newPassword);
    const token = jwtSign({ email: req.body.email });
    const {
      password, createdAt, updatedAt, ...newHost
    } = host;
    util.setSuccess(200, 'Password succesfully Reset', { newHost, token });
    return util.send(res);
  }
}
export default HostController;
