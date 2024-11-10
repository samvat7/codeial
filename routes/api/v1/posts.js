const express = require('express');
const router = express.Router();
const postsApi = require('../../../controllers/api/v1/post_api');
const passport = require('passport');

router.get('/', postsApi.index);

router.post('/', passport.authenticate('jwt',{session:false}),postsApi.create);

router.delete('/:id', passport.authenticate('jwt',{session:false}),postsApi.destroy);

module.exports = router;