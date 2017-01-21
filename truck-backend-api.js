const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const config = require('./models/config');

const users = require('./controllers/users');

const admins = require('./controllers/admins');
const auth = require('./controllers/auth');

mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl, {server: {socketOptions: {keepAlive: 120}}});

var app = express();
var router = express.Router();

if (app.get('env') !== 'production') app.use(logger('dev'));

// run init script
require('./init/init');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// ==================================================
// Middleware
// ==================================================

router.param('id', (req, res, next, id) => {
	if (!id.match(/^[0-9a-fA-F]{24}$/))
		return res.status(400).send('Invalid ID');
	next();
});

// ==================================================
// Routes
// ==================================================

router.route('/users')
	.get(auth.superAdminRequired, users.getAllUsers)
	.post(users.createUser, auth.loginUser);
// router.route('/users/pending')
// 	.get(auth.adminRequired, users.getUndeliveredAndUnpaidPurchases);
router.route('/users/:id')
	.get(auth.validateToken, users.getUserById)
	.put(auth.validateToken, users.updateUser)
	.delete(auth.validateToken, users.deleteUser);

// router.route('/users/pending/:id')
// 	.get(auth.adminRequired, users.getPendingOrders);

router.route('/orders')
	.get(auth.adminRequired, users.getAllOrders)
	.post(auth.validateToken, users.placeOrder);

router.route('/orders/:id')
	.get(auth.validateToken, users.getUserOrderHistory);

//TODO THESE ARE NOT DONE YET....
router.route('/users/cart')
	.get(auth.validateToken, users.getCart);

// router.route('/users/cart/:id')
// 	.get(auth.adminRequired, users.getACart)

// router.route('/users/history/:id')
// 	.get(auth.adminRequired, users.getOrderHistory);


router.route('/admins/:id')
	.post(auth.superAdminRequired, users.makeAdmin)
	.delete(auth.superAdminRequired, users.removeAdminPrivs);


router.route('/trucks')
	.get(users.getActiveTrucks)
	.post(auth.adminRequired, users.makeTruck);
router.route('/trucks/:id')
	.put(auth.adminRequired, users.editTruck)
	.get(users.getTruck)
	.delete(auth.adminRequired, users.deleteTruck);


// TODO these do not work... yet
router.route('/trucks/history/:id')
	.get(auth.adminRequired, admins.getOrderHistory);
router.route('/trucks/pending/:id')
	.get(auth.adminRequired, admins.getPendingOrders);
router.route('/trucks/orders/:id')
	.put(auth.adminRequired, admins.markOrderComplete);


// router.route('/items/:truckId/:id')
// 	.get(auth.adminRequired,admins.getMenuItem)
// 	.post(auth.adminRequired, admins.createItem)
// 	.put(auth.adminRequired, admins.updateItem)
// 	.delete(auth.adminRequired, admins.deleteItem);

// router.route('/items/:id')
// 	.get(items.getItemById)
// 	.post(auth.validateToken, items.purchaseItem)
// 	.put(auth.adminRequired, items.updateItemById)
// 	.delete(auth.adminRequired, items.deleteItem);
//
router.route('/auth/token')
 	.post(auth.loginUser);

app.use('/', router);

// handle 404
app.use((req, res, next) => {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// developement error handler
if (app.get('env') === 'development') {
	app.use((err, req, res, next) => {
		console.log(err.message);
		var status = err.status || 500;
		if (status >= 400 && status < 500 && err.message)
			var message = err.message;
		else var message = ''
		res.status(status).send(message);
	});
}

app.use((err, req, res, next) => {
	var status = err.status || 500;
	if (status >= 400 && status < 500 && err.message)
		var message = err.message;
	else var message = '';
	res.status(status).send(message);
});

var server = app.listen(config.port);

console.log('server port:', server.address().port);
console.log('Listening at http://localhost:%s in %s mode',
	server.address().port, app.get('env'));

module.exports = app;
