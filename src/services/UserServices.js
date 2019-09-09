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

  static async storeToken(userInfo) {
    try {
      return await database.Password_resets.create(userInfo);
    } catch (error) {
      throw error;
    }
  }

  static async updateCredentials(userEmail, password) {
    try {
      const userToUpdate = await database.User.findOne({
        where: { email: userEmail }
      });
      if (userToUpdate) {
        const newUser = {
          password,
        };
        await database.User.update(newUser, { where: { email: userEmail } });
        return newUser;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
