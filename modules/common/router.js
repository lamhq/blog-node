const express = require('express');
const handlers = require('./handlers');

const router = express.Router();

router.route('/cm/files/upload-params').get(handlers.getUploadParams);

// test sendmail
router.route('/test/mail').post(handlers.sendTestEmail);

// test render html
router.get('/test/view', handlers.testView);

module.exports = router;
