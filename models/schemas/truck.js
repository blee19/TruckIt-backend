const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('email-validator');

var truckSchema = new Schema({
		companyName: {type: String, required: true, trim: true},
		location: String,
		venmo: {type: String, required: true, trim: true},
		email: {type: String, required: true, trim: true, unique: true},
		phone: {type: String, unique: true},
		phoneProvider: String,
		menu: [{
			item: {
				price: Number,
				name: String,
				img: String,
				inStock: Boolean,
				ordersPlaced: Number
			}
		}],
	},
	{
		toObject: {getters: true},
		timestamps: {
			createdAt: 'createdDate',
			updatedAt: 'updatedDate'
		}
	}
);

truckSchema.pre('save', function (callback) {
	if (!this.email)
        return callback(new Error('Missing email'));
    if (!this.phone)
        return callback(new Error('Missing phone'));

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

var Truck = mongoose.model('Truck', truckSchema);

module.exports = Truck;