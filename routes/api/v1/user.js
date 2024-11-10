const express = require('express');

const router = express.Router();

const usersApi = require('../../../controllers/api/v1/users_api');
const passport = require('passport');

router.get('/', passport.authenticate('jwt', {session: false}), usersApi.userInfo);

module.exports = router;
