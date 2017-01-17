const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var orderSchema = new Schema({
	
	user: {type: String, required: true, trim: true},
	truck: {type: Schema.ObjectId, ref: 'Item', required: true},
	item: [{
		name: ,
		price: ,
		quantity:
	}]
	
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


var Order = mongoose.model('Order', orderSchema);

module.exports = Order;