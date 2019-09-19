/* eslint-disable no-restricted-globals */

import database from '../database/models';
import UserService from '../services/UserServices';
import getRoleName from '../utils/GetRoleUtil';

const { findUserByEmail } = UserService;
/**
 * @class UserController
 */
class AdminController {
  /**
   * @param {Object} req object
   * @param {Object} res object
   * @returns {Object} res
   */
  static async changeRole(req, res) {
    try {
      const foundUser = await findUserByEmail(req.body.email);
      if (!foundUser) return res.status(404).send({ status: 404, error: `User with email ${req.body.email} does not exist` });
      const oldRole = foundUser.role_value;
      if (Number(oldRole) === Number(req.body.new_role)) return res.status(409).send({ status: 409, message: 'User already has the role', errpr: 'conflict' });
      await database.User.update(
        { role_value: req.body.new_role },
        { where: { email: req.body.email } }
      );
      res.status(200).send({
        status: 200, message: 'successful', oldRole: getRoleName(oldRole), newRole: getRoleName(req.body.new_role)
      });
    } catch (e) {
      throw Error(e);
    }
  }
}

export default AdminController;
