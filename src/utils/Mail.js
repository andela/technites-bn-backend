/* eslint-disable lines-between-class-members */
/* eslint-disable require-jsdoc */
import sgMail from '@sendgrid/mail';
import Util from './Utils';

const util = new Util();
export default class Mail {
  constructor() {
    this.to = null;
    this.token = null;
    this.username = null;
    this.email = null;
  }

  setMessage(to, token, username, email) {
    this.to = to;
    this.token = token;
    this.username = username;
    this.email = email;
  }
  send(res) {
    const message = {
      to: this.to,
      from: 'noreply@barefootnomad.com',
      subject: 'Password Reset',
      text: 'Password Reset',
      html: `<div style="width: 90%; margin: 5rem auto; box-shadow: 0 0 10px rgba(0,0,0,.9);">

        <div>

            <div>

                <div style="background-color: #FFF; width: 80%;border-radius: 10px;">

                <img src="https://lh3.googleusercontent.com/c6WI1BiWRhDZ1cpREJxRRp02h9XTB4mG3R4lAJ12qodJg-rDeDkfKdDwLZQay0zB5UnEwnRd8oBTkcA74VUaSeoflyFM4zSfq4lizUY2Q8qh-YU99RFSWMo2qJQCE9PMXKS37DisYymrJz61WT06sDgKWjL7QMfD88AyqR4Yb2fEjvnZCireBF0s24BNuiiURiFK8voBhcarildssUwpStRdZQCeUCYBPw5pDNNToLc8dVjF6X-bXFFrPjp1YttLANWt0YiYx-U1ikB5S0wvG8o_kaslCMrsPM0SNQKIg0MxoaCRLsoWZz_G7E-kGRi4WJniyG4XPPZ7-5qSQoKkfB_HJzuKgsSM2dvcgVW_RKMBlTb1IZTwuU-yMYX3FCfOz4F65uiEJCN54ZboUQ9e5qr0TmyEH4vnHjI9n08tn-PDRL1q-_pZQPUtE_7S5l7eT6Wegr_NhGb536KhWPKPSBoP9VWT-RwGVlLgwjQ2avOQYfn3spIl57sRWsQVMzPW_LMds597w4_GP0a_UCjOnlStJwLrERlvTf_ESLxX-wYm5eSIFDD-b5G0TsCcQ4Azib0Q7ItfNlWXiwlnjsVPlnQ-sBL0LaUOEW3l2j-rXfIU-9zqwtglwqvLyR-FucKiazexaX7K4FLFVHSWaMk-pgURd3uQXGAF-TgmmNyXZPgPsPvWBSX-9Q=w111-h94-no"style="     margin-left: 300px;width: 100px;height: 100px;"/> 

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
    sgMail.send(message).then(() => {
      util.setSuccess(200, 'Email sent successfully', this.token);
      return util.send(res);
    }).catch(() => {
      util.setError(400, 'Failed to send email');
      return util.send(res);
    });
  }
}
