
import database from '../database/models';
/**
 * @class HostService
 */
class HostService {
  /**
   * @param {Object} userEmail
   * @returns {Object} user
   */
  static async findHostByEmail(userEmail) {
    const user = await database.User.findOne({ where: { email: userEmail, role_value: 0 } });
    if (!user) return null;
    return user.dataValues;
  }
}
export default HostService;
