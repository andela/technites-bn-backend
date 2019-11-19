import sgMail from '@sendgrid/mail';
import Util from './Utils';

const util = new Util();
/**
 * @class
 */
export default class Mail {
  /**
   * @constructor
   */
  constructor() {
    this.to = null;
    this.token = null;
    this.username = null;
    this.email = null;
    this.msgType = null;
  }

  /**
 *
 * @param {*} to  to whom the email is regarded
 * @param {*} token his token
 * @param {*} username his Name
 * @param {*} email His email
 * @param {*} msgType message type
 * @returns {object} email
 */
  setMessage(to, token, username, email, msgType) {
    this.to = to;
    this.token = token;
    this.username = username;
    this.email = email;
    this.msgType = msgType;
  }

  /**
 *
 * @param {*} res
 * @returns {object} email
 */
  send(res) {
    let MAIL_URL = null;
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
      MAIL_URL = process.env.MAIL_URL_DEVELOPMENT;
    } else {
      MAIL_URL = process.env.MAIL_URL_PRODUCTION;
    }
    let message = null;
    if (this.msgType === 'ResetRequest') {
      message = {
        to: this.to,
        from: 'noreply@barefootnomad.com',
        subject: 'Password Reset',
        text: 'Password Reset',
        html: `    <div style="
      margin: auto;
      background-color: rgb(245, 245, 245);
      width: 650px;
      height: 400px;
      text-align: center;
      box-shadow: 0px 5px 15px 0px rgb(153, 153, 153, 0.5);
      border-radius: 8px;">

        <div>

            <div>

                <div style=" width: 80%;border-radius: 10px;    padding-top: 20px;padding-left: 60px;">

                <h1 style="color:#8E7FFF; font-family: fantasy; font-size:2em; text-align:center;"> Barefoot Nomad </h1> 

                </div>

                <h1 style="font-family: fantasy;    color: #000;">Dear ${this.username}!</h1>

            </div>

            <div style=" padding: 0px 20px 20px 20px">

                <div>

                <p style="color: #000;font-size: 1.3em;font-family: fantasy;">You recently requested a password reset with the email: <strong>${this.email}</strong> </p>

                <p style="color: #000;font-size: 1.3em;font-family: fantasy;">In order to reset your password, Please click on the button below.</p>
                <div>
                <button style="width:50%;height:20%;color: white; background-color: #8E7FFF; border: none; font-family: fantasy;border-radius: 10px; padding: 5px;"><a href="${MAIL_URL}/${this.token}" style="font-family: fantasy;font-size: 2em;width:50%; text-align:center;text-decoration: none; color: white;background-color: #8E7FFF;width: 50%; border: none; border-radius: 10px;">Reset password</a></button>
                
                </div>
            </div>

            <div style="width: 80%;border-radius: 10px;padding-left: 50px;">

                  <h4 style="font-family: auto;text-align: center; color: #000; padding-top: 10px;font-family: auto;font-family: fantasy;">2019  &copy; Technites</h4>

            </div>

            </div>

        </div>

    </div>`
      };
    } else {
      message = {
        to: this.to,
        from: 'noreply@barefootnomad.com',
        subject: 'Password Reset Succesfully',
        text: 'Password Reset Succesfully',
        html: `    <div style="
      margin: auto;
      background-color: rgb(245, 245, 245);
      width: 650px;
      height: 400px;
      text-align: center;
      box-shadow: 0px 5px 15px 0px rgb(153, 153, 153, 0.5);
      border-radius: 8px;">

        <div>

            <div>

                <div style="width: 80%;border-radius: 10px;    padding-top: 80px; padding-left: 60px;">

                <h1 style="color:#8E7FFF; font-family: fantasy; font-size:2em; text-align:center;"> Barefoot Nomad </h1> 

                </div>

                

            </div>

            <div style=" padding: 0px 20px 20px 20px">

                <div>

                <p style="color: #000;font-size: 1.3em;font-family: fantasy;"> Your password have been reset succesfully</p><br><br>
                <p style="color: #000;font-size: 1.3em;font-family: fantasy;">Barefoot Nomad</p>

            </div>

            <div style=" width: 80%;border-radius: 10px;    padding-left: 60px;">

                  <h4 style="font-family: auto;text-align: center; color: #000; padding-top: 10px;font-family: auto;font-family: fantasy;">2019  &copy; Technites</h4>

            </div>

            </div>

        </div>

    </div>`
      };
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    if (process.env.NODE_ENV === 'test') {
      message = {
        ...message,
        mail_settings: {
          sandbox_mode: {
            enable: true
          }
        }
      };
    }
    sgMail.send(message).then(() => {
      if (this.msgType === 'ResetRequest') {
        util.setSuccess(200, 'Email sent successfully');
      } else {
        util.setSuccess(200, 'Password reset succesfully');
      }
      return util.send(res);
    }).catch(() => {
      util.setError(400, 'Failed to send email');
      return util.send(res);
    });
  }
}
