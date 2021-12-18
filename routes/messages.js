const express = require('express');
const router = express.Router();

const { getMessage, createMessage } = require('../Controllers/messages');

router.route('/').post(getMessage);
router.route('/new_message').post(createMessage);

module.exports = router;