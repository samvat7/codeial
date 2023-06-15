const express = require('express');

const router = express.Router();

const usersController = require('../conrtollers/users_controller'); 

router.get('/', function(req,res){

    res.end('<h1>Users</h1>');
})

router.get('/profile', usersController.profile); //mapping the profile route to the users controller

router.get('/posts', usersController.posts);



module.exports = router;
