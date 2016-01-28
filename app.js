var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session')
var bcrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var methodOverride = require('method-override');
var path = require('path');

var database = require('./config/database');
var User = require('./models/user.js');

// passport = require('./config/passport');

mongoose.connect(database.url);
// mongoose.connect('mongodb://localhost:27017');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride('_method'))
app.use(session({secret: 'mysecret'}));
app.use(passport.initialize());
app.use(passport.session());

require('./app/routes/posts')(app);
require('./app/routes/users')(app);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

app.get('/submit', function(req, res) {
    res.sendfile('./public/submit.html');
});


app.listen(process.env.PORT || 3000)
console.log('App running on 3000')
