require('dotenv').config();

const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const app = express();
require('./config/view-helpers')(app);
const port = 8000;
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

//test
const cors = require('cors');

app.use(cors({
    origin: 'http://16.171.138.189:8000',  // replace with your application's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));
  

//setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);

const chatServerPort = 5000;
chatServer.listen(chatServerPort);
console.log(`Chat server is listening on port ${chatServerPort}`);
const path = require('path');

if(env.name == 'development'){
app.use(sassMiddleware({

    src: path.join(__dirname, env.asset_path, 'scss'),
    dest: path.join(__dirname, env.asset_path, 'css'),
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));
}

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(env.asset_path)); //being problematic after using env onject

app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts); // has to be before routes 

//extract style and scripts from sub pages into the layout

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//setup the view engine

app.set('view engine', 'ejs');

app.set('views', './views');

// mongo store is used to store the session cookie in the db

app.use(session({
    name: 'codeial',
    //TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {

        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/codeial_development',
        autoRemove: 'disabled',
    }, function (err) {
        console.log(err || 'Connect-mongodb setup done');
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());

app.use(customMware.setFlash);

//use express router

app.use('/', require('./routes'));

app.listen(port, function (err) {

    if (err) console.log(`Error in running the server: ${err}`);

    console.log(`Server is up and running on port: ${port}`);
});

