const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.use(new LocalStrategy({

    usernameField: 'email',
    passReqToCallback: true
},
    function (req, email, password, done) {

        //find a user and establish identity

        User.findOne({ email: email }).then(function (user) {

            if (!user || user.password != password) {

                req.flash('error', 'Invalid Username/Password');

                return done(null, false);
            }

            return done(null, user);

        }).catch(function (err) {

            req.flash('error', err);
            return done(err);
        });
    }
));

//serializing the user to decide which key is to be kept in the cookies

passport.serializeUser(function (user, done) {

    done(null, user.id);
});

//desrializing the user from the key in the cookies

passport.deserializeUser(async function (id, done) {

    try {

        let user = await User.findById(id);

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {

        console.log('Error: ', err);

        return;
    }
});

passport.checkAuthentication = function (req, res, next) {

    if (req.isAuthenticated()) {

        res.locals.user = req.user;
        return next();
    }

    return res.redirect('/users/login');
}

passport.checkNotAuthenticated = function (req, res, next) {

    if (!req.isAuthenticated()) {

        return next();
    }

    return res.redirect('/');
}

passport.setAuthenticatedUser = function (req, res, next) {

    if (req.isAuthenticated()) {

        // req.user contains the current signed in user from the session cookie, we are just sending this to the locals for ejs views

        res.locals.user = req.user;
    }

    next();
}

module.exports = passport;