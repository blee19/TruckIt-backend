const mongoose = require('mongoose');
const User = require('../models/schemas/user');
const config = require('../models/config');
var disconnect = false;

mongoose.Promise = global.Promise;

// open connection if doesn't exist
if (mongoose.connection.readyState === 0) {
	console.log('opening mongoose connection...');
	mongoose.connect(config.dbUrl, {server:{socketOptions:{keepAlive:120}}});

	// close connection if running as standalone script
	disconnect = true;
}

User.find({email: config.superAdminEmail}, (err, superAdmins) => {
	if (err) return console.log(err);

	if (superAdmins.length > 0) {
		if (disconnect) {
			console.log('closing mongoose connection...');
			mongoose.connection.close();
		}
		return;
	}

	console.log(`${config.superAdminEmail} account not detected`);

	var newSuperAdmin = User({
		firstName: config.superAdminfirstName,
		email: config.superAdminEmail,
		password: config.superAdminPassword,
		venmo: config.superAdminVenmo,
		phone: config.superAdminPhone,
		phoneProvider: config.superAdminPhoneProvider,
		isSuperAdmin: true,
		isAdmin: true
	});

	newSuperAdmin.save((err) => {
		if (disconnect) {
			console.log('closing mongoose connection...');
			mongoose.connection.close();
		}
		if (err) {
			console.log('error creating super admin');
			return console.log(err);
		}
		console.log(`created super admin ${config.superAdminEmail}`);
		return;
	});
});
