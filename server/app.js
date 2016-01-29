// dependencies
var express = require('express'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressSession = require('express-session'),
    mongoose = require('mongoose'),
    path = require('path'),
    passport = require('passport'),
    localStrategy = require('passport-local' ).Strategy;

// mongoose
var dburl = "mongodb://localhost:27017"

//       mongodb://lcjobs:lcjobs@ds047325.mongolab.com:47325/lowercasejobs
//       mongodb://localhost:27017

mongoose.connect(dburl);

// user schema/model
var User = require('./models/user.js');

// create instance of express
var app = express();

// require routes
var loginroutes = require('./routes/login.js');
var postroutes = require('./routes/posts.js');


// define middleware
app.use(express.static(path.join(__dirname, '../client')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes
app.use('/user/', loginroutes);
app.use('/', postroutes);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.get('/login', function(req, res) {
  res.redirect('/#/login');
});

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/panel', loggedIn, function(req, res, next) {
    // req.user - will exist
    //  res.json("works");
    res.sendFile(path.join(__dirname, '../client', 'panel.html'));
});

module.exports = app;
