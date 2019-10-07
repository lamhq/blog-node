const express = require('express');
const handlers = require('./handlers');

const router = express.Router();

router.get('/cm/files/upload-params', handlers.getUploadParams);

// test sendmail
router.post('/test/mail', handlers.sendTestEmail);

// test render html
router.get('/test/view', handlers.testView);

module.exports = router;
