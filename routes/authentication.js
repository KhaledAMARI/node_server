const express = require('express');
const router = express.Router();

const { register, confirmMail, login } = require('../Controllers/authentication');

router.post('/register', register);
router.post('/confirm_email', confirmMail);
router.post('/login', login);

module.exports = router;