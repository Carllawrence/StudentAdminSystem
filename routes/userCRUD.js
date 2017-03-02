var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose'),

  User = mongoose.model('User');
 
/**
 * Find user by id and store it in the request
 */
exports.user = function(req, res, next, id) {
  User.findById(id, function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load user ' + id));
    req.user = user;
    next();
  });
};
 
/**
 * List of user
 */
exports.query = function(req, res) {
  User.find().sort('-createdAt').exec(function(err, users) {
    if (err) return res.json(500, err);
    res.json(users);
  });
};
 
/**
 * Show a user
 */
exports.show = function(req, res) {
  res.json(req.user);
};
 
/**
 * Create a user
 */
exports.create = function(req, res) {
 User.register(new User({ username: req.body.username, firstname: req.body.firstname, 
    department: req.body.department, telephone: req.body.department, lastname: req.body.lastname, picUrl: req.body.picUrl, status: req.body.status }),
        req.body.password, function (err, account) {
            if (err) {
                return res.status(500).json({
                    err: err
                });
            }
          
        });

};
 
/**
 * Update a user
 */
exports.update = function(req, res) {
  User.update({ _id: req.user._id }, req.body, { }, function(err, updatedUser) {
    if (err) return res.json(500, err);
    res.json(updatedUser);
  });
};

/**
 * Remove a user
 */
exports.remove = function(req, res) {
  var user = req.user;
 
  user.remove(function(err) {
    if (err) return res.json(500, err);
    res.json(user);   
  });
};