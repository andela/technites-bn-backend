import crypto from 'crypto';
import redisClient from '../utils/RedisConnection';
import requestServices from '../services/RequestServices';
import MailHelper from '../utils/MailHelper';

const { findOrigin, findDestination } = requestServices;
const { requestEmailTheme, userConfirmTheme, sendEmail } = MailHelper;


/**
 * @class EmailController
 */
class EmailController {
  /**
   * @func sendUserEmail
   * @param {*} emailTitle
   * @param {*} contentHeader
   * @param {*} contentMessage
   * @param {*} user
   * @param {*} request
   * @param {*} decision
   * @returns {Boolean} sent
   */
  static async sendUserEmail(emailTitle, contentHeader, contentMessage, user, request, decision) {
    // departure location name
    const origin = await findOrigin(request.location_id);
    // destinations locations
    const destionsArray = await findDestination(request.destinations);
    const destinations = destionsArray.map(({ name }) => name).join(',');
    request = { ...request, origin, destinations };
    const content = {
      user,
      title: contentHeader,
      message: contentMessage,
      request,
      decision
    };
    const theme = userConfirmTheme(content);
    // send e-mail to owner
    const sent = await sendEmail(
      emailTitle,
      theme,
      user.email
    );
    if (sent) return true;
    return false;
  }

  /**
   * @func sendRequestEmail
   * @param {*} user
   * @param {*} request
   * @param {*} baseUrl
   * @param {*} emailTitle
   * @param {*} contentTitle
   * @returns {Boolean} sended
   */
  static async sendRequestEmail(user, request, baseUrl, emailTitle, contentTitle) {
    const EmailTitle = emailTitle || 'Trip approval requested';
    const ContentTitle = contentTitle || 'Requesting trip confirmation';
    // generate token
    const token = crypto.randomBytes(64).toString('hex');

    redisClient.hset('requests_otp', `${request.id}`, token);
    const origin = await findOrigin(request.location_id);
    // destinations locations
    const destArr = await findDestination(request.destinations);
    const destinations = destArr.map(({ name }) => name).join(',');
    const content = {
      origin,
      token,
      user,
      baseUrl,
      title: ContentTitle,
      destination: destinations,
      request,
    };
    const theme = requestEmailTheme(content);
    const result = await sendEmail(EmailTitle, theme, user.line_manager);
    if (result) return true;
    return false;
  }
}

export default EmailController;
