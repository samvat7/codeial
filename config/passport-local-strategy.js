const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/users');

passport.use(new LocalStrategy({

        usernameField: 'email'
},
    function(email,password, done){

        //find a user and establish identity

        User.findOne({ email: email }).then(function (user) {

            if (!user || user.password != password) {

                console.log('Invalid Username/Password');

                return done(null, false);
            }

            return done(null, user);

        }).catch(function (err) {

            console.log('Error finding user --> Passport');
            return done(err);
        });
    }
));

//serializing the user to decide which key is to be kept in the cookies

passport.serializeUser(function(user, done){

    done(null, user.id);
});

//desrializing the user from the key in the cookies

passport.deserializeUser(function(id, done){

    User.findById(id).then(function(user){

        if(!user){
            return done(null, false);
        }

        return done(null, user);
    }).catch(function(err){

        console.log('Error finding user --> Pasport');
        return done(null, false);
    });
});

passport.checkAuthentication = function(req,res,next){

    if(req.isAuthenticated()){

        res.locals.user = req.user;
        return next();
    }

    return res.redirect('http://localhost:8000/users/login');
}

passport.checkNotAuthenticated = function(req,res,next){

    if(!req.isAuthenticated()){

        return next();
    }

    return res.redirect('http://localhost:8000/users/profile');
}

passport.setAuthenticatedUser = function(req, res, next){

    if(req.isAuthenticated()){

        // req.user contains the current signed in user from the session cookie, we are just sending this to the locals for ejs views

        res.locals.user = req.user;
    }

    next();
}

module.exports = passport;