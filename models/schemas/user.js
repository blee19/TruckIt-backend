const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
	firstName: {type: String, required: true, trim: true},
	lastName: {type: String, trim: true},
	hash: String,
	venmo: {type: String, unique: true, required: true},
	email: {type: String, trim: true},
	phone: {type: String, required: true, unique: true, sparse: true},
	phoneProvider: {type: String, required: true},
	isAdmin: [String],
	isSuperAdmin: boolean,
	token: String
	},

	{
		toObject: {getters: true},
		timestamps: {
			createdAt: 'createdDate',
			updatedAt: 'updatedDate'
		}
	}
);

userSchema.methods.comparePassword = function(pw, callback) {
	bcrypt.compare(pw, this.hash, (err, isMatch) => {
		if (err) return callback(err);
		callback(null, isMatch);
	});
};


var User = mongoose.model('User', userSchema);

module.exports = User;