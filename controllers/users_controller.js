const passport = require('passport');
const User = require('../models/user');

module.exports.users = function(req,res){

    console.log(req);

    res.render('users', {

        title: "Codeial Users"
    });
}

module.exports.profile = function(req, res) {
    
        console.log(res.locals.user);

        res.render('user_profile_logged', {
            title: `${res.locals.user.name}'s Profile`, // res.locals.user passed on by passport local
            user: res.locals.user
        });
};

module.exports.posts = function(req,res){

    res.end(`<h1>User's Posts</h1>`);
}

module.exports.register = function(req, res){

    return res.render('register', {

        title: "Codeial | Register"
    });
};

module.exports.login = function(req, res){

    return res.render('login', {
        title: "Codeial | Log In"
    });
};

//get the registeration data
module.exports.create = function(req,res){

    console.log(req.body);

    if(req.body.password != req.body.confirmpassword){

        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }).then(function(user){
        if (!user) {
            User.create(req.body).then(function(newUser) {
                return res.redirect('http://localhost:8000/users/login');
            }).catch(function(err) {
                console.log('Error in creating user while signing up');
            });
        } else {

            console.log('User with this email already exists');
            res.redirect('back');
        }
    }).catch(function(err) {
        console.log('Error finding user in signing up.', err);
    });
};

module.exports.logout = function(req,res){

    req.logout(function(err) {
        if (err) {
            console.log('Error logging out:', err);
            return res.redirect('/');
        }
        // Redirect to the home page or any other page you want after successful logout
        return res.redirect('/');
    });
};

module.exports.createSession = function(req,res){

    return res.redirect('http://localhost:8000/users/profile');
}