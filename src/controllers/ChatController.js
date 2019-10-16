import Utils from '../utils/Utils';
import eventEmitter from '../utils/EventEmitter';
import ChatService from '../services/ChatServices';

const { storeChat, fetchAllChats } = ChatService;
const util = new Utils();

/**
 * @class ChatController
 */
class ChatController {
  /**
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @returns {*} message
     */
  static async sendMessage(req, res, next) {
    const chat = {
      from: req.user.id,
      to: req.body.to,
      message: req.body.message
    };
    try {
      const newChat = await storeChat(chat);
      chat.from = `${req.user.firstname} ${req.user.lastname}`;
      chat.to = 'All';
      eventEmitter.emit('message', chat);
      util.setSuccess(201, 'Message Sent!', newChat);
      return util.send(res);
    } catch (error) { return next(error); }
  }

  /**
     * @param {*} req
     * @param {*} res
     * @returns {*} all messages
     */
  static async fetchMessages(req, res) {
    const allMessages = await fetchAllChats();
    util.setSuccess(200, 'All Messages!', allMessages);
    return util.send(res);
  }
}

export default ChatController;
