var User = require('../../models/user.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var methodOverride = require('method-override');
var bodyParser = require('body-parser');


module.exports = function(app) {

  app.get('/api/users', function(req, res) {
      User.find(function(err, user) {
          if (err)
              res.send(err)
          res.json(user)
      });
  });

  app.get('/', function (req, res) {
      res.render('index', { user : req.user });
  });

  app.get('/register', function(req, res) {
      res.render('register', { });
  });

  app.post('/register', function(req, res) {
      User.register(new User({ username : req.body.username }), req.body.password, function(err, account) {
          if (err) {
            return res.status(500).json({err: err});
          }

          passport.authenticate('local')(req, res, function () {
            return res.status(200).json({status: 'Registration successful!'});
          });
      });
  });

  app.get('/login', function(req, res) {
      res.sendfile('public/login.html');
  });

  app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.status(500).json({err: err});
    }
    if (!user) {
      return res.status(401).json({err: info});
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({err: 'Could not log in user'});
      }
      res.status(200).json({status: 'Login successful!'});
    });
  })(req, res, next);
});


  app.get('/logout', function(req, res) {
    req.logout();
  res.status(200).json({status: 'Bye!'});
});

  app.get('/ping', function(req, res){
      res.status(200).send("pong!");
  });

};
