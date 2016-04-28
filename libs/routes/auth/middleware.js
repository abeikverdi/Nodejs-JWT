var jwt = require("jsonwebtoken");
var libs = process.cwd() + '/libs/';
var config = require(libs + 'config');


var authenticate = function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, config.get("security:secret"), function(err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});

	} else {
	// if there is no token
	// return 403 error
	return res.status(403).send({
	    success: false,
	    message: 'No token provided.'
	});

	}
}

module.exports = authenticate;