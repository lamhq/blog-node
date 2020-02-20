const mailer = require('nodemailer');
const pug = require('pug');
const { logInfo } = require('./log');
const config = require('../config');

/**
 * Send email using nodemailer
 *
 * @param {Object} message
 *   let message = {
 *     from: 'Sender Name <sender@example.com>',
 *     to: 'Recipient <recipient@example.com>',
 *     subject: 'mailer is unicode friendly',
 *     html: '<p><b>Hello</b> to {{username}}</p>'
 *     templatePath: '/email/template1.html',
 *     params: {
 *       '{{username}}': 'test'
 *     }
 *   }
 */
async function sendMail({
  params, templatePath, from, to, subject, html,
}) {
  const message = {
    from, to, subject, html,
  };

  // if template was provided, compile it and get the real email content
  if (templatePath) {
    const compiledFunction = pug.compileFile(templatePath);
    message.html = compiledFunction(params);
  }

  // send the mail
  logInfo(`Going to send mail to ${message.to}: "${message.subject}"`);
  const transporter = mailer.createTransport(config.mail.transport);
  const previewUrl = await transporter.sendMail(message);

  // Preview only available when sending through an Ethereal account
  if (process.env.NODE_ENV === 'dev') {
    logInfo('Mail\'s preview url: %s', mailer.getTestMessageUrl(previewUrl));
  }
}

/**
 * Send test email using nodemailer
 *
 * @param {Object} message
 *   let message = {
 *     from: 'Sender Name <sender@example.com>',
 *     to: 'Recipient <recipient@example.com>',
 *     subject: 'mailer is unicode friendly',
 *     html: '<p><b>Hello</b> to {{username}}</p>'
 *     templatePath: '/email/template1.html',
 *     params: {
 *       '{{username}}': 'test'
 *     }
 *   }
 */
function sendTestMail(data = null) {
  const message = {
    from: 'Tester <tester@gmail.com>',
    to: 'Recipient <daibanglam@gmail.com>',
    subject: 'This is a test email from Nodemailer',
    html: '<p>This <strong>email</strong> is used to check that our mail server is working</p>',
    ...data,
  };
  return sendMail(message);
}

module.exports = {
  sendMail,
  sendTestMail,
};
