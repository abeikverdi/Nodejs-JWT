var express = require('express');
var router = express.Router();
var authenticate = require('./auth/middleware');

var User = require('../model/user');


router.get('/me', authenticate,
   function(req, res) {
      User.find({_id: req.decoded._doc._id}, {password: 0}, function(err, users) {
         res.json(users);
      });
   }
);

module.exports = router;