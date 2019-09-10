/* eslint-disable no-useless-catch */
/* eslint-disable require-jsdoc */
import database from '../database/models';

class UserService {
  static async findUserByEmail(userEmail) {
    const user = await database.User.findOne({ where: { email: userEmail } });
    if (!user) return null;
    return user.dataValues;
  }

  static async storeToken(userInfo) {
    try {
      return await database.PasswordResets.create(userInfo);
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
