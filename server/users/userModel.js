var Promise = require('bluebird')
var mongoose = Promise.promisifyAll(require('mongoose'));
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  name: {
    first: String,
    last: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip_code: Number
  },
  verified: { type: Boolean, default: false },
  warning: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  stripe: {
    verified: { type: Boolean, default: false },
    customer: String,
    account: String
  },
  // This is not bank, it is a reflection of another source.
  credit: {type: Number, default: 0}
});

UserSchema.methods.comparePasswords = function(enteredPassword, callback) {
  var hashedPassword = this.password;
  bcrypt.compare(enteredPassword, hashedPassword, function(err, match) {
    callback(err, match);
  })
};

UserSchema.pre('save', function (next) {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, function(err, salt){
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, function(err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});

module.exports = mongoose.model('User', UserSchema);
