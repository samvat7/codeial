const express = require('express');

const router = express.Router();

const passport = require('passport');

const usersController = require('../controllers/users_controller'); 

router.get('/', usersController.users);

router.get('/profile/:id', passport.checkAuthentication, usersController.profile); //mapping the profile route to the users controller

router.get('/posts', usersController.posts);

router.get('/register', passport.checkNotAuthenticated , usersController.register);

router.get('/login', passport.checkNotAuthenticated , usersController.login);

router.post('/create', usersController.create);

router.post('/update', passport.checkAuthentication, usersController.update);

//use passport as middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: 'http://localhost:8000/users/login'}
), usersController.createSession);

router.get('/logout', usersController.logout);

module.exports = router;
