var mongoose = require('mongoose');

module.exports = mongoose.model('Post', {
  position: String,
  company: String,
  moreinfo: String
});
