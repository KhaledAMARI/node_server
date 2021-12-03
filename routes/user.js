const express = require('express');
const router = express.Router();

const { register, confirmMail, login, logout, userHome } = require('../Controllers/user');
const authentificationMiddleware = require('../Middlewares/auth');

router.route('/').get(authentificationMiddleware, userHome);
router.route('/register').post(register);
router.route('/confirm_email').get(confirmMail);
router.route('/login').post(login);
router.route('/logout').post(logout);

module.exports = router;