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
  }

  /**
 *
 * @param {*} to  to whom the email is regarded
 * @param {*} token his token
 * @param {*} username his Name
 * @param {*} email His email
 * @returns {object} email
 */
  setMessage(to, token, username, email) {
    this.to = to;
    this.token = token;
    this.username = username;
    this.email = email;
  }

  /**
 *
 * @param {*} res
 * @returns {object} email
 */
  send(res) {
    let message = {
      to: this.to,
      from: 'noreply@barefootnomad.com',
      subject: 'Password Reset',
      text: 'Password Reset',
      html: `<div style="width: 90%; margin: 5rem auto; box-shadow: 0 0 10px rgba(0,0,0,.9);">

        <div>

            <div>

                <div style="background-color: #FFF; width: 80%;border-radius: 10px;">

                <h1 style="color:#8E7FFF; font-family: fantasy; font-size:2em; text-align:center;"> Barefoot Nomad </h1> 

                </div>

                <h1 style="margin-left:300px;font-family: fantasy;    color: #000;">Dear ${this.username}!</h1>

            </div>

            <div style=" padding: 0px 20px 20px 20px">

                <div>

                <p style="color: #000;font-size: 1.3em;font-family: fantasy;">You recently requested a password reset with the email: <strong>${this.email}</strong> </p>

                <p style="color: #000;font-size: 1.3em;font-family: fantasy;">In order to reset your password, Please click on the button below.</p>
                <div style="padding-left:200px">
                <button style="width:50%;height:20%;color: white; background-color: #8E7FFF; border: none; font-family: fantasy;border-radius: 10px; padding: 5px;"><a href="http://localhost:3000/api/v1/auth/reset/${this.token}" style="font-family: fantasy;font-size: 2em;width:50%; text-align:center;text-decoration: none; color: white;background-color: #8E7FFF;width: 50%; border: none; border-radius: 10px;">Reset password</a></button>
                
                </div>
            </div>

            <div style="background-color: #FFF; width: 80%;border-radius: 10px;">

                  <h4 style="font-family: auto;text-align: center; color: #000; padding-top: 10px;font-family: auto;font-family: fantasy;">2019  &copy; Technites</h4>

            </div>

            </div>

        </div>

    </div>`
    };


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
      util.setSuccess(200, 'Email sent successfully', this.token);
      return util.send(res);
    }).catch(() => {
      util.setError(400, 'Failed to send email');
      return util.send(res);
    });
  }
}
