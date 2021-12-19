const express = require('express');
const router = express.Router();

const authenticateUser = require('../Middlewares/auth');

const { register, confirmMail, login } = require('../Controllers/authentication');

router.post('/register', register);
router.post('/confirm_email', authenticateUser, confirmMail);
router.post('/login', login);

module.exports = router;