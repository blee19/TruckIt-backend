const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var orderSchema = new Schema({
	
	user: {type: Schema.ObjectId, ref: 'User', required: true, trim: true},
	truck: {type: Schema.ObjectId, ref: 'Truck' required: true},
	purchasedItems: [{
		item: {
			price: Number,
			name: String,
			quantity: Number
		}
	}],
	isPaid: Boolean,
	isComplete: Boolean,
	datePlaced: Date
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