/* eslint-disable lines-between-class-members */
/* eslint-disable require-jsdoc */
import sgMail from '@sendgrid/mail';
import Util from './Utils';

const util = new Util();
export default class Mail {
  constructor() {
    this.to = null;
    this.subject = null;
    this.text = null;
    this.html = null;
  }

  setMessage(to, subject, text, html) {
    this.to = to;
    this.subject = subject;
    this.text = text;
    this.html = html;
  }
  send(res) {
    const message = {
      to: this.to,
      from: 'noreply@barefootnomad.com',
      subject: this.subject,
      text: this.text,
      html: this.html,
    };
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgMail.send(message).then(() => {
      util.setSuccess(200, 'Email sent successfully');
      return util.send(res);
    }).catch(() => {
      util.setError(400, 'Failed to send email');
      return util.send(res);
    });
  }
}
