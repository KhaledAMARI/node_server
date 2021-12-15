const express = require('express');
const router = express.Router();

const { register, confirmMail, login, userHome } = require('../Controllers/user');
const authentificationMiddleware = require('../Middlewares/auth');

router.route('/').get(authentificationMiddleware, userHome);
router.route('/register').post(register);
router.route('/confirm_email').post(confirmMail);
router.route('/login').post(authentificationMiddleware, login);

module.exports = router;