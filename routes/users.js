const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users_controller'); 

router.get('/', usersController.users);

router.get('/profile', usersController.profile); //mapping the profile route to the users controller

router.get('/posts', usersController.posts);



module.exports = router;
