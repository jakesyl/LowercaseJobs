var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session')


mongoose.connect('mongodb://admin:lowercase@ds047325.mongolab.com:47325/lowercasejobs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));


app.use(session({
  secret: 'mysecret'
}));
app.use(passport.initialize());
app.use(passport.session());



passport.use(new Strategy({
    consumerKey: 'jAd1T9NxbjnkTEIhlIYJvtfSO',
    consumerSecret: 'SXUKm48tASfDkO6MS5R69dNMAITMtSQtCvcQWPSzJ3swWz5phA',
    callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, cb) {
    return cb(null, profile);
  }));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


var PostSchema = new mongoose.Schema({
  position: String,
  description: String,
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
/*
app.post('/api/submit', function(req, res) {

  Post.create({
    position: req.body.position,
    description: req.body.description,
    company: req.body.company,
    moreinfo: req.body.moreinfo
  }, function(err, post) {
    if (err)
      res.send(err);
    res.redirect('/')
  });
});
*/
app.get('/', function(req, res) {
  res.sendfile('./public/index.html');
});

app.get('/submit', function(req, res) {
  res.sendfile('./public/submit.html');
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', passport.authenticate('twitter', {
  failureRedirect: '/fail',
  successRedirect: '/'
}));

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()); {
    return next();
  }


  res.redirect('/');
}


app.get('/checklogin',function(req,res){
  if (req.user)
    res.send(true);
  else
    res.send(false);
});

app.listen(process.env.PORT || 3000)
console.log('App running on 3000')
