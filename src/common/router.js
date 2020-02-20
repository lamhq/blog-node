const express = require('express');
const middlewares = require('./middlewares');

const router = express.Router();

router.get('/cm/files/upload-params', middlewares.getUploadParams);

// test sendmail
router.post('/test/mail', middlewares.sendTestEmail);

// test render html
router.get('/test/view', middlewares.testView);

module.exports = router;
