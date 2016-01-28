var Post = require('../../models/post.js');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');

module.exports = function(app) {

  app.get('/api/posts', function(req, res) {
      Post.find(function(err, post) {
          if (err)
              res.send(err)
          res.json(post)
      });
  });

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

};
