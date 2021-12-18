const express = require('express');
const router = express.Router();

const { userHome } = require('../Controllers/user');

router.route('/').get(userHome);


module.exports = router;