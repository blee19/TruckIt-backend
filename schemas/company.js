const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var companySchema = new Schema({
		firstName: {type: String, required: true, trim: true},
		lastName: String,
		venmo: String,
		email: String,
		phone: String,
		phoneProvider: String,
		purchases: {},
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


var Company = mongoose.model('Company', companySchema);

module.exports = Company;