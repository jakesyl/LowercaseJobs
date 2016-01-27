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
passport = require('./config/passport');
var passport = passport();

mongoose.connect(database.url);
// mongoose.connect('mongodb://localhost:27017');


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride('_method'))
app.use(session({secret: 'mysecret'}));
app.use(passport.initialize());
app.use(passport.session());

require('./app/routes')(app);


var UserSchema = new mongoose.Schema({
    email: String,
    password: String

});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


var User = mongoose.model('User', UserSchema);



passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        //process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({
            'local.email': email
        }, function(err, user) {
            // if there are any errors, return the error
            if (err)

                return done(err);
            // check to see if theres already a user with that email
            if (user) {} else {
                // if there is no user with that email
                // create the user
                var newUser = new User();

                // set the user's local credentials
                newUser.email = email;
                newUser.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

        //    });

    }));

passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, res, email, password, done) { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists

        User.findOne({
            email: email
        }, function(err, user, done) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                console.log('No User Found, Please Sign Up');


            // if the user is found but the password is wrong
            if (bcrypt.compareSync(password, user.password) === false)
                console.log('Wrong Password for Login');

            // all is well, return successful user
            return done(null, user);

            res.send(json);
        });

    }));


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()); {
        return next();
    }

    res.redirect('/');
}

app.listen(process.env.PORT || 3000)
console.log('App running on 3000')
