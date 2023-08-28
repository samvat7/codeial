const passport = require('passport');

const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const crypto = require('crypto');

const User = require('../models/user');


passport.use(new googleStrategy({

    clientID: "724587597516-aa28tjl534k9kfiemd0rpthvs1grkrnj.apps.googleusercontent.com",
    clientSecret: "GOOGLE_OAUTH_CLIENT_SECRET",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
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
