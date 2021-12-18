const express = require('express');
const router = express.Router();

const { userHome } = require('../Controllers/user');
const authentificationMiddleware = require('../Middlewares/auth');

router.route('/').get(authentificationMiddleware, userHome);


module.exports = router;