const express = require('express');

const cookieParser = require('cookie-parser');

const expressLayouts = require('express-ejs-layouts');

const app = express();

const port = 8000;

const db = require('./config/mongoose');

const session = require('express-session');

const passport = require('passport');

const passportLocal = require('./config/passport-local-strategy');

const MongoStore = require('connect-mongo');

const sassMiddleware = require('node-sass-middleware');

app.use(sassMiddleware({

    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

app.use(express.urlencoded({extended:false}));

app.use(cookieParser());

app.use(express.static('./assets'));

app.use(expressLayouts); // has to be before routes 

//extract style and scripts from sub pages into the layout

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//setup the view engine

app.set('view engine','ejs');

app.set('views', './views');

// mongo store is used to store the session cookie in the db

app.use(session({
    name: 'codeial',
    //TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {

        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/codeial_development', 
        autoRemove: 'disabled',
    }, function(err) {
        console.log(err || 'Connect-mongodb setup done');
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//use express router

app.use('/',require('./routes'));

app.listen(port, function(err){

    if(err) console.log(`Error in running the server: ${err}`);

    console.log(`Server is up and running on port: ${port}`);
});

