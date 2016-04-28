var mongoose = require('mongoose'),
	Schema = mongoose.Schema,

	Group = new Schema({
		name: {
			type: String,
			required: true
		},
		admin: [{
			type: Schema.ObjectId, 
			ref: 'User'
		}],
		users: [{
			type: Schema.ObjectId, 
			ref: 'User'
		}]
	});

module.exports = mongoose.model('Group', Group);
	