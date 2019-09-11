import database from '../database/models';

/**
 * @class UserService
 * @description user service methods
 */
class UserService {
  /**
   *
   * @param {Object} newUser
   * @returns {Object} newUser
   */
  static async addUser(newUser) {
    const addedUser = await database.User.create(newUser);
    return addedUser;
  }

  /**
   *
   * @param {Object} userEmail
   * @returns {Object} user
   */
  static async findUserByEmail(userEmail) {
    const user = await database.User.findOne({ where: { email: userEmail } });
    if (!user) return null;
    return user.dataValues;
  }
}

export default UserService;
