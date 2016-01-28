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
              return res.render('register', { account : account });
          }

          passport.authenticate('local')(req, res, function () {
              res.redirect('/');
          });
      });
  });

  app.get('/login', function(req, res) {
      res.render('login', { user : req.user });
  });

  app.post('/login', passport.authenticate('local'), function(req, res) {
      res.redirect('/');
  });

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  app.get('/ping', function(req, res){
      res.status(200).send("pong!");
  });

};
