var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session')
var bcrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var methodOverride = require('method-override');

// mongoose.connect('mongodb://lcjobs:lcjobs@ds047325.mongolab.com:47325/lowercasejobs');
mongoose.connect('mongodb://localhost:27017');


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));
app.use(methodOverride('_method'))


app.use(session({
    secret: 'mysecret'
}));
app.use(passport.initialize());
app.use(passport.session());


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


var PostSchema = new mongoose.Schema({
    position: String,
    company: String,
    moreinfo: String
});

var Post = mongoose.model('Post', PostSchema);

app.get('/api/posts', function(req, res) {
    Post.find(function(err, post) {
        if (err)
            res.send(err)
        res.json(post)
    });
});

var testid = '56a7e377a3895c880e124989';

app.get('/api/posts/:id', function(req, res) {
    Post.findById(req.params.id, function(err, post) {
        if (err) {
            console.log('Error getting post by ID');
        } else {
            console.log('Retrieving: ' + post._id)
            res.json(post);
        }

    });
});

app.get('/api/posts/:id/edit', function(req, res) {

    Post.findById(req.params.id, function(err, post) {
        if (err) {
            console.log('Error getting post by ID for editing');
        } else {
            console.log('Retrieving to edit: ' + post._id)
            res.json(post);
        }

    });

});

app.put('/api/posts/:id/edit', function(req, res) {
    var position = req.body.position;
    var company = req.body.company;
    var moreinfo = req.body.moreinfo;
    var id = req.body.id;
    console.log(id);

      Post.findById(id, function(err, post) {
        post.update({
            position: position,
            company: company,
            moreinfo: moreinfo
        }, function(err, postID) {
            if (err) {
                res.send('Problem updating post: ' + err);
            } else {
                res.json(post);
            }
        });
    });
});

app.delete('/api/posts/:id/edit', function(req, res) {
    Post.findById(req.params.id, function(err, post) {
        if (err) {
            console.log(err);
        } else {
            post.remove(function(err, post) {
                if (err) {
                    return console.error(err);
                } else {
                    console.log("DELETING ID: " + post._id);
                    res.json(post);
                }
            });
        }
    });
});

app.get('/posts/edit/:id', function(req, res) {
  Post.findById(req.params.id, function(err, post) {
      if (err) {
          console.log(err);
      } else {
          res.sendfile('./public/edit.html')
        //  res.json(post);
      }
  });
});


app.post('/api/posts', function(req, res) {

    Post.create({
        position: req.body.position,
        company: req.body.company,
        moreinfo: req.body.moreinfo
    }, function(err, post) {
        if (err)
            res.send(err);
    });
});


app.post('/api/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup' // redirect back to the signup page if there is an error
}));

app.post('/api/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
}));

app.get('/api/users', function(req, res) {
    User.find(function(err, user) {
        if (err)
            res.send(err)
        res.json(user)
    });
});

app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

app.get('/submit', function(req, res) {
    res.sendfile('./public/submit.html');
});

app.get('/login', function(req, res) {
    res.sendfile('.public/login.html');
});

app.get('/signup', function(req, res) {
    res.sendfile('./public/signup.html')
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()); {
        return next();
    }

    res.redirect('/');
}


app.get('/checklogin', function(req, res) {
    if (req.user)
        res.send(true);
    else
        res.send(false);
});

app.listen(process.env.PORT || 3000)
console.log('App running on 3000')
