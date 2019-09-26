/* eslint-disable camelcase */
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();
// setting sendgrid Key
const { SENDGRID_API_KEY, NODE_ENV, EMAIL_MESSAGE_FROM } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

/**
 * class MailHelper
 */
class MailHelper {
  /**
     *
     * @param {*} subject object
     * @param {*} html template to use
     * @param {*} to destination email
     * @param {*} from sender email
     * @return {Boolean} true or false
     */
  static async sendEmail(subject, html, to, from = EMAIL_MESSAGE_FROM) {
    let message = {
      from,
      to,
      subject,
      html
    };
    if (NODE_ENV === 'test') {
      message = { ...message, mail_settings: { sandbox_mode: { enable: true } } };
    }
    try {
      await sgMail.send(message);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * @func requestEmailTheme
   * @param {*} content
   * @returns {string} html
   */
  static requestEmailTheme(content) {
    const {
      title,
      request,
      origin,
      destination,
      token,
      baseUrl,
      user
    } = content;
    const {
      id,
      request_type,
      return_date,
      reason,
      departure_date
    } = request;

    const returnDate = request_type === 'OneWay' ? 'Not specified' : return_date;

    return `<body style="font-family: sans-serif;">
       <div style="
       margin: auto;
       background-color: rgb(245, 245, 245);
       width: 650px;
       height: 400px;
       text-align: center;
       box-shadow: 0px 5px 15px 0px rgb(153, 153, 153, 0.5);
       border-radius: 8px;">
  
       <h4 style="color: rgb(93, 93, 93); font-size: 28px; padding-top: 40px;">${title}</h4>
          <p style="text-align: left; margin-left: 30px; margin-top: 20px; color: rgb(93, 93, 93);">${user.firstname} has requested a trip from ${origin} to ${destination}</p>
          <p style="text-align: left; margin-left: 30px; margin-top: 20px; color: rgb(93, 93, 93);">Reason: ${reason}</p>
          <p style="text-align: left; margin-left: 30px; margin-top: 20px; color: rgb(93, 93, 93);">Departure date: ${departure_date},</p>
          <p style="text-align: left; margin-left: 30px; margin-top: 20px; line-height: 0; color: rgb(93, 93, 93);">Return date date: ${returnDate}</p>
  
          <a style="background-color: rgb(54, 0, 179); /* Green */
              width: 120px;
              height: 16px;
              outline: none;
              border-radius: 360px;
              color: white;
              margin: 16px;
              padding: 15px 32px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 14px;
              font-weight: bold;
              cursor: pointer;" href="${baseUrl}/api/v1/requests/${id}/approve/${token}">CONFIRM</a>
  
          <a style="
              width: 120px;
              height: 16px;
              outline: none;
              border-radius: 360px;
              color: rgb(54, 0, 179);
              margin: 16px;
              padding: 15px 32px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 14px;
              font-weight: bold;
              border: 1px solid rgb(54, 0, 179);
              cursor: pointer;" href="${baseUrl}/api/v1/requests/${id}/reject/${token}">DECLINE</a>
     
     </div>
     </body>`;
  }

  /**
   * @func UserConfirmTheme
   * @param {*} content
   * @returns {String} html
   */
  static userConfirmTheme(content) {
    const {
      user,
      request,
      title,
      message,
      decision
    } = content;
    const {
      request_type,
      return_date, reason,
      departure_date,
      origin,
      destinations
    } = request;
    const returnDate = request_type === 'OneWay' ? 'Not specified' : return_date;
    const Decision = decision === undefined ? 'Kindly wait for the response from your line manager' : decision;
    return `
      <body style="font-family: sans-serif;">
       <div style="
       margin: auto;
       background-color: rgb(245, 245, 245);
       width: 650px;
       height: 400px;
       text-align: center;
       box-shadow: 0px 5px 15px 0px rgb(153, 153, 153, 0.5);
       border-radius: 8px;">
  
       <h4 style="color: rgb(93, 93, 93); font-size: 28px; padding-top: 40px;">${title}</h4>
          <p style="text-align: left; margin-left: 30px; margin-top: 20px; color: rgb(93, 93, 93);"> Dear ${user.firstname} your trip request from ${origin} to ${destinations} ${message}, ${Decision}</p>
          <p style="text-align: left; margin-left: 30px; margin-top: 20px; color: rgb(93, 93, 93);">Reason: ${reason}</p>
          <p style="text-align: left; margin-left: 30px; margin-top: 20px; color: rgb(93, 93, 93);">Departure date: ${departure_date},</p>
          <p style="text-align: left; margin-left: 30px; margin-top: 20px; line-height: 0; color: rgb(93, 93, 93);">Return date date: ${returnDate}</p>
     
     </div>
     </body>
      `;
  }
}

export default MailHelper;
