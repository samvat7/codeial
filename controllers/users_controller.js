const User = require('../models/users');

module.exports.users = function(req,res){

    res.render('users', {

        title: "Codeial Users"
    });
}

module.exports.profile = function(req,res){

    res.render('user_profile', {
        title: "Profile page"
    });
}

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

    User.findOne({email: req.body.email}).then(function(err, user){

        if(err){ console.log('Error finding user in signing up.'); return}

        if(!user){

            User.create(req.body).then(function(err, user){

                return res.redirect('http://localhost:8000/users/login');
            }).catch(function(err){

                console.log('Error in creating user while signing up');
            });
        }
        else{

            res.redirect('back');
        }
    });
}

//sign in and create a session
module.exports.createSession = function(req, res){

    //TODO Later
}