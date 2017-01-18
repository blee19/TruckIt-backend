const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const favicon = require('serve-favicon');
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
// run init scripts
else require('./init/init');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// ==================================================
// Middleware
// ==================================================

router.param('id', (req, res, next, id) => {
	if (!id.match(/^[0-9a-fA-F]{24}$/))
		return res.status(400).send('Invalid ID');
	next();
});

router.param('subId', (req, res, next, id) => {
	if (!id.match(/^[0-9a-fA-F]{24}$/))
		return res.status(400).send('Invalid second ID');
	next();
});

// ==================================================
// Routes
// ==================================================

router.route('/users')
	.get(users.getAllUsers)
	.post(users.createUser);
// router.route('/users/pending')
// 	.get(auth.adminRequired, users.getUndeliveredAndUnpaidPurchases);
router.route('/users/:id')
	.get(auth.validateToken, users.getUserById)
	.put(auth.validateToken, users.updateUser)
	.delete(auth.validateToken, users.deleteUser);

router.route('/users/pending/:id')
	.get(auth.adminRequired, users.getPendingByUserId);

router.route('/users/cart/:id')
	.get(auth.adminRequired, users.getCart)
	.post(auth.adminRequired, users.placeOrder);
router.route('/users/history/:id')
	.get(auth.adminRequired, users.getOrderHistory);


router.route('/admins/:id')
	.post(auth.superAdminRequired, users.makeAdmin)
	.delete(auth.superAdminRequired, users.removeAdminPrivs);

router.route('/trucks')
	.get(users.getActiveTrucks);

router.route('/trucks/:truckId')
	.get(admins.getMenuItems);
router.route('/trucks/history/:truckId')
	.get(auth.adminRequired, admins.getOrderHistory);
router.route('/trucks/pending/:truckId')
	.get(auth.adminRequired, admins.getPendingOrders);
router.route('/trucks/orders/:orderId')
	.put(auth.adminRequired, admins.markOrderComplete);


router.route('/items/:truckId/:itemId')
	.get(auth.adminRequired,admins.getMenuItem)
	.post(auth.adminRequired, admins.createItem)
	.put(auth.adminRequired, admins.UpdateItem)
	.delete(auth.adminRequired, admins.deleteItem);

// router.route('/items/:id')
// 	.get(items.getItemById)
// 	.post(auth.validateToken, items.purchaseItem)
// 	.put(auth.adminRequired, items.updateItemById)
// 	.delete(auth.adminRequired, items.deleteItem);
//
// router.route('/auth/token')
// 	.post(auth.loginUser);

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
	else var message = ''
	res.status(status).send(message);
});

var server = app.listen(config.port);

console.log('server port:', server.address().port);
console.log('Listening at http://localhost:%s in %s mode',
	server.address().port, app.get('env'));

module.exports = app;
