const express = require('express');

const router = express.Router();

const homeController = require('../conrtollers/home_controller');

console.log('Router loaded.');

router.get('/',homeController.home);

module.exports = router;