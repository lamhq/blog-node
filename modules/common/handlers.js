const s3 = require('./s3');
const { sendTestMail } = require('./mail');

// get upload params to support uploading file on front end
async function getUploadParams(req, res, next) {
  try {
    return res.json(s3.getUploadParams());
  } catch (err) {
    return next(err);
  }
}

async function sendTestEmail(req, res, next) {
  try {
    await sendTestMail({ to: req.body.email });
    res.json({ message: 'Email sent' });
  } catch (err) {
    next(err);
  }
}

function testView(req, res, next) {
  try {
    res.render('test', {
      name: 'John',
      appName: 'handel',
      abn: '123456',
      email: 'a@m.mm',
      phone: '0909397890',
      address: '208 nguyen huu canh',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUploadParams,
  sendTestEmail,
  testView,
};
