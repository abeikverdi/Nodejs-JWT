var express = require('express');
var router = express.Router();
var authenticate = require('./auth/middleware');
var libs = process.cwd() + '/libs/';
var config = require(libs + 'config');
var db = require(libs + 'db/mongoose');
var User = require('../model/user');
var jwt = require("jsonwebtoken");
var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);

router.get('/', function (req, res) {
    res.json({
    	msg: 'Moim is alive'
    });
});

router.post('/login', function(req, res) {

  	// find the user
	User.findOne({
		username: req.body.username
	}, function(err, user) {

	if (err) {
		return log.error(err);
	}

	if (!user) {
		res.json({ success: false, message: 'Authentication failed. User not found.' });
	} else if (user) {
		// check if password matches
		console.log(user.password);
		if (!user.isValidPassword(req.body.password)) {
			res.json({ success: false, message: 'Authentication failed. Wrong password.' });
		} else {
			// if user is found and password is right
			// create a token
			var token = jwt.sign(user, config.get("security:secret"), {
				expiresIn: config.get("security:tokenLife")
			});

			// return the information including token as JSON
			res.json({
				success: true,
				message: 'Enjoy your token!',
				token: token
			});
		}   
	}

	});
});

router.post('/signup', function(req, res) {

  	// query db to see if username is taken or not
	User.findOne({
		username: req.body.username
	}, function(err, user) {

	if (err) {
		return log.error(err);
	}

	if (user) {
		res.json({ success: false, message: 'User already exists with this username' });
	} else {

		var user = new User({
			username: req.body.username,
			password: req.body.password
		});
		 user.save(function(err, user){
		 	if (err) return log.error(err);
		 	else {
		 		log.info("New user - %s:%s", user.username, user.password);

		 		// create a token
				var token = jwt.sign(user, config.get("security:secret"), {
					expiresIn: config.get("security:tokenLife")
				});

				// return the information including token as JSON
				res.json({
					success: true,
					userId: user._id,
					token: token
				});
		 	}
		 })
	}

	});
});


module.exports = router;