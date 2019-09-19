import dotenv from 'dotenv';
import database from '../database/models';

dotenv.config();

/**
 * @class UserService
 * @description user service methods
 */
class UserRequest {
  /**
   *
   * @param {Integer} userId
   * @returns {Object} user
   */
  static async userRequest(userId) {
    const requests = await database.Request.findAll({ where: { user_id: userId } });
    if (!requests) return [];
    return requests;
  }
}

export default UserRequest;
