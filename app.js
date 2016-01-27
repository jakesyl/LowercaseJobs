var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session')
var bcrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var methodOverride = require('method-override');

var database = require('./config/database');
// passport = require('./config/passport');
// var passport = passport();

mongoose.connect(database.url);
// mongoose.connect('mongodb://localhost:27017');


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride('_method'))
app.use(session({secret: 'mysecret'}));
// app.use(passport.initialize());
// app.use(passport.session());

require('./app/routes')(app);


app.listen(process.env.PORT || 3000)
console.log('App running on 3000')
