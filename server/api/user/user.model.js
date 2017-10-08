const mongoose = require('mongoose');
const bCrypt = require('bcrypt');

const constants = require('../../constants');
const UserSchema = require('./user.schema');

UserSchema.methods.getLight = function () {
  return {
    _id: this._id,
    admin: this.admin,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName
  };
};

UserSchema.methods.isAdmin = function () {
  return this.admin;
};

UserSchema.methods.isValidPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

UserSchema.pre('save', function (next) {
  let user = this;

  user.email = user.email.toLowerCase();

  user.firstName = user.firstName.toLowerCase().replace(/(^|\s)./g, function (c) {
    return c.toUpperCase();
  });

  user.lastName = user.lastName.toUpperCase();

  if (user.isModified('password')) {
    user.password = bCrypt.hashSync(user.password, constants.SALT_WORK_FACTOR);
  }

  next();
});

UserSchema.statics.create = user => new Promise((resolve, reject) => {
  new User(user).save((error, saved) => {
    error ? reject(error.message) : resolve(saved);
  });
});

UserSchema.statics.delete = id => new Promise((resolve, reject) => {
  User.findByIdAndRemove(id, error => {
    error ? reject(error.message) : resolve();
  });
});

UserSchema.statics.doesExist = id => new Promise((resolve, reject) => {
  User.count({_id: id}, (error, count) => {
    error ? reject(error.message) : resolve(count > 0);
  });
});

UserSchema.statics.edit = (id, updatedFields) => new Promise((resolve, reject) => {
  User.findById(id, (error, user) => {

    if (error) {
      reject(error.message)
    }

    for (let key in updatedFields) {
      if (updatedFields.hasOwnProperty(key)) {
        user[key] = updatedFields[key];
      }
    }

    user.save((error, saved) => {
      error ? reject(error.message) : resolve(saved);
    });
  });
});

UserSchema.statics.get = id => new Promise((resolve, reject) => {
  User.findById(id, (error, user) => {
    error ? reject(error.message) : resolve(user);
  });
});

UserSchema.statics.getAll = () => new Promise((resolve, reject) => {
  User.find({}, (error, users) => {
    error ? reject(error.message) : resolve(users.map(user => user.getLight()));
  });
});

UserSchema.statics.isThereAdmin = () => new Promise((resolve, reject) => {
  User.count({admin: true}, (error, count) => {
    error ? reject(error.message) : resolve(count > 0);
  });
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
