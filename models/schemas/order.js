const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var orderSchema = new Schema({

	user: {type: Schema.ObjectId, required: true, trim: true},
	truck: {type: Schema.ObjectId, required: true},
	purchasedItems: [{
		item: {
			price: Number,
			name: {type: String, required: true},
			quantity: Number
		}
	}],
	paid: Date,
	completed: Date,
	totalPrice: {type: Number, required: true}
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
