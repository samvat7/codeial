const passport = require('passport');

const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const crypto = require('crypto');

const User = require('../models/user');

const env = require('./environment')

/*
TODO: make a new Google OAuth Credential on console.developers.google.com 
*/

passport.use(new googleStrategy({

    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_callback_url
}, function (accessToken, refreshToken, profile, done) {

    User.findOne({ email: profile.emails[0].value }).then((user) => {

        console.log(profile);

        if (user) {

            done(null, user);
        }
        else {

            User.create({

                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            }).then(() => {

                return done(null, user);
            }).catch((err) => {
                console.log('Error in creating user google-strategy-passport: ', err);

                return;
            });
        }
    }).catch((err) => {
        console.log('Error in google-strategy-passport: ', err);

        return;
    });

}));

module.exports = passport;