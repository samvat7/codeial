const passport = require('passport');
const JWTStartegy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

const env = require('./environment');


let opts = {

    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret
}


passport.use(new JWTStartegy(opts, function(jwtPayLoad, done){

    User.findById(jwtPayLoad._id).then(function(user){

        if(user){

            return done(null, user);
        }
        else{

            return done(null, false);
        }
    }).catch((err) => {

        console.log('Error: ', err);
        return;
    });

        
    ;
}));

module.exports = passport;