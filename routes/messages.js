const express = require('express');
const router = express.Router();

const { getMessage, addMessage } = require('../Controllers/messages');

router.route('/').post(getMessage);
router.route('/new_message').post(addMessage);

module.exports = router;