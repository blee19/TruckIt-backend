const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const validator = require('email-validator');

var userSchema = new Schema({
	firstName: {type: String, required: true, trim: true},
	lastName: {type: String, trim: true},
	hash: {type: String, required: true},
	venmo: {type: String, unique: true, required: true},
	email: {type: String, required: true, trim: true, unique: true},
	phone: {type: String, required: true, unique: true, sparse: true},
	phoneProvider: {type: String, required: true},
	isAdmin: {type: Schema.ObjectId, ref: 'Truck'},
	isSuperAdmin: Boolean,
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

userSchema.pre('save', function (callback) {
	if (!this.email)
        return callback(new Error('Missing email'));
    if (!this.password)
        return callback(new Error('Missing password'));
    if (this.isModified('password'))
        this.password = bcrypt.passwordSync(this.password);

    if (!this.phone)
        return callback(new Error('Missing phone'));
    if (!this.phoneProvider)
        return callback(new Error('Missing phoneProvider'));

    if (this.email && !validator.validate(this.email))
        return callback(new Error('Invalid email'));

    // validate phone
    if (this.phone) {
        if (typeof this.phone !== 'string')
            return callback(new Error('Invalid phone'));
        var phone = '';
        for (var i = 0; i < this.phone.length; i++) {
            if (!isNaN(this.phone[i]))
                phone += this.phone[i];
        }
        if (phone.length !== 10)
            return callback(new Error('Invalid phone'));
        this.phone = phone;
    }

    callback();
});

// methods for validating password
userSchema.methods.comparePassword = function(pw, callback) {
    //console.log(pw + " " + this.password);
    bcrypt.compare(pw, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};
userSchema.methods.comparePasswordSync = function(pw) {
    return bcrypt.compareSync(pw, this.password);
};


var User = mongoose.model('User', userSchema);

module.exports = User;
