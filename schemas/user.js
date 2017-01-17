const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
	firstName: {type: String, required: true, trim: true},
	lastName: String,
	venmo: String,
	email: String,
	phone: {type: String, required: true},
	phoneProvider: {type: String, required: true},
	purchases: [{
		date: Date,
		item: {
			id: {type: Schema.ObjectId, ref: 'Item', required: true},
			price: Number,
			name: String,
			quantity: Number
		},
		isPaid: Boolean,
		isPickedUp: Boolean
	}],
	isAdmin: [String]
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