var mongoose = require('mongoose'),
	bCrypt = require('bcrypt-nodejs'),
	Schema = mongoose.Schema,

	User = new Schema({
		username: {
			type: String,
			unique: true,
			required: true,
			lowercase: true
		},
		password: {
			type: String,
			required: true
		},
		created: {
			type: Date,
			default: Date.now
		}
	});

User.pre('save', function(next) {
    this.password = this.createHash(this.password);
    next();
});

User.methods.isValidPassword = function(password) {
	return bCrypt.compareSync(password, this.password);
};

User.methods.createHash = function(password){
    // Generates hash using bCrypt
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};


module.exports = mongoose.model('User', User);
