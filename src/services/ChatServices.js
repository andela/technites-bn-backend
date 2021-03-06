import database from '../database/models';
import UserService from './UserServices';

const { findUserById } = UserService;

/**
 * @class ChatService
 */
class ChatService {
  /**
     *
     * @param {*} chat
     * @returns {*} chat
     */
  static async storeChat(chat) {
    const newChat = await database.Chats.create(chat);
    return newChat;
  }

  /**
 *
 * @returns {*} chats
 */
  static async fetchAllChats() {
    const chats = await database.Chats.findAll({
      attributes: {
        exclude: ['from', 'to', 'updatedAt']
      },
      include: [{
        model: database.User,
        attributes:
        ['id', 'firstname',
          'lastname', 'image_url'],
        required: true
      }],
      order: [
        ['id', 'ASC']]
    });
    if (!chats) return null;
    return chats.map((chat) => chat.dataValues);
  }
}
export default ChatService;
