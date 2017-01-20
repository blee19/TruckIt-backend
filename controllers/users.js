const mongoose = require('mongoose');
const twilio = require('twilio');
const User = require('../models/schemas/user');
const validator = require('email-validator');
const Truck = require('../models/schemas/truck');
const Order = require('../models/schemas/order');
const config = require('../models/config');
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.emailFromAddress,
        pass: config.emailPassword
    }
});


exports.getAllUsers = (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) return next(err);
        res.json(users);
    });
};

exports.getUserById = (req, res, next) => {
    if (req.params.id !== req.user.id && !req.user.isSuperAdmin)
        return res.status(403).send("You don't have permission to do that");
    User.findById(req.params.id, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).send('No user with that ID');
        res.json(user);
    });
};

exports.createUser = (req, res, next) => {

    var userData = {};

    if (req.body.firstName && typeof req.body.firstName === 'string') {
        userData.firstName = req.body.firstName;
    } else {res.status(400).send('No first name');}
    if (req.body.email && typeof req.body.email === 'string') {
        userData.email = req.body.email;
    } else {res.status(400).send('No email');}
    if (req.body.password && typeof req.body.password === 'string') {
        userData.password = req.body.password;
    } else {res.status(400).send('No password');}
    if (req.body.venmo && typeof req.body.venmo === 'string') {
        userData.venmo = req.body.venmo;
    } else {res.status(400).send('No venmo');}
    if (req.body.lastName && typeof req.body.lastName === 'string') {
        userData.lastName = req.body.lastName;
    }
    if (typeof req.body.phone !== 'string')
        return res.status(400).send('No phone');
    if (typeof req.body.phoneProvider !== 'string')
        return res.status(400).send('No phoneProvider');

    if (req.body.phoneProvider === 'other') {
        if (typeof req.body['other-provider'] !== 'string')
            return res.status(400).send('Missing other-provider');
        userData.phoneProvider = req.body['other-provider'];
    } else userData.phoneProvider = req.body.phoneProvider;

    //validate phone (just needs 10 digits)
    var phone = '';
    for (var i = 0; i < req.body.phone.length; i++) {
        if (!isNaN(req.body.phone[i]) && req.body.phone[i] !== ' ')
            phone += req.body.phone[i];
    }
    if (phone.length !== 10)
        return res.status(400).send('Invalid phone');
    userData.phone = phone;

    //validate email
    if (req.body.email) {
        if (!validator.validate(req.body.email))
            return res.status(400).send('Invalid email');
        else
            userData.email = req.body.email;
    }

    var newUser = new User(userData);
    newUser.save((err, user) => {
        if (err) {
            console.log(err);
            if (err.code === 11000)
                return res.status(400).send('Email, phone, or venmo account number already registered');
            return next(err);
        }
        return res.sendStatus(200);
    });
};

// TODO verification if inputs are good
exports.updateUser = (req, res, next) => {
    if (req.params.id !== req.user.id && !req.user.isSuperAdmin)
        return res.status(403).send("You don't have permission to do that");
    User.findByIdAndUpdate(req.params.id, req.body, (err, doc) => {
        if (err) return next(err);
        if (!doc) return res.status(404).send('No user with that ID');
        res.sendStatus(200);
    });
};

exports.deleteUser = (req, res, next) => {
    if (req.params.id !== req.user.id && !req.user.isSuperAdmin)
        return res.status(403).send("You don't have permission to do that");
    User.findByIdAndRemove(req.params.id, (err) => {
        if (err) return next(err);
        res.sendStatus(200);
    });
};

exports.makeAdmin = (req, res, next) => {
    if (!Truck.findById(req.user.isAdmin) && !req.user.isSuperAdmin)
        return res.status(403).send("You don't have permission to do that");
    User.findByIdAndUpdate(req.params.id, { isAdmin: req.body.isAdmin }, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).send('No user with that ID');
        res.sendStatus(200);
    });
};

exports.removeAdminPrivs = (req, res, next) => {
    if (!Truck.findById(req.user.isAdmin) && !req.user.isSuperAdmin)
        return res.status(403).send("You don't have permission to do that");
    User.findByIdAndUpdate(req.params.id, { isAdmin: null }, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).send('No user with that ID');
        res.sendStatus(200);
    });
};

// //TODO fix so that it gets a users pending orders from Orders DB
exports.getAllOrders = (req, res, next) => {
    Order.find({}, (err, orders) => {
        if (err) return next(err);
        res.send(orders);
    });
};

//TODO get a list of active trucks
exports.getActiveTrucks = (req, res, next) => {
    Truck.find({ isActive: true }, (err, trucks) => {
        if (err) return next(err);
        res.json(trucks);
    });
};

exports.getTruck = (req, res, next) => {
    if (req.params.id !== req.user.id && !req.user.isAdmin)
        return res.status(403).send("You don't have permission to do that");
    Truck.findById(req.params.id, (err, truck) => {
        if (err) return next(err);
        if (!truck) return res.status(404).send('No user with that ID');
        res.json(truck);
    });
};


//TODO adds item to user's current order (add to sessionStorage).
exports.editOrder = (req, res, next) => {
    Order.findByIdAndUpdate(req.params.id, req.body, (err, order) => {
        if (err) return next(err);
        if (!order) return res.status(404).send('No item with that ID');

        // allows users to see their cart of orders
        sessionStorage.cart.push(req.body);

        res.status(200).json({
            message: 'We updated your order'
        });
    });
};

exports.editTruck = (req, res, next) => {
    Truck.findByIdAndUpdate(req.params.id, req.body, (err, order) => {
        if (err) return next(err);
        if (!order) return res.status(404).send('No truck with that id');
        
        res.status(200).json({
            message: 'We have updated your truck'
        });
    });
};

// TODO have a way for a user to check what's in their cart
exports.getCart = (req, res, next) => {
    if (req.params.id !== req.user.id && !req.user.isSuperAdmin)
        return res.status(403).send("You don't have permission to do that");

    res.status(200).send(sessionStorage.cart);
};

exports.getACart = (req, res, next) => {
    
};

//TODO allows users to place orders
exports.placeOrder = (req, res, next) => {

    if (!req.user.id) return res.status(403).send('Account required');
    
    if (req.params.id !== req.user.id && !req.user.isAdmin)
        return res.status(403).send("You don't have permission to do that");
    
    var orderData = {
        user: req.user.id,
        truck: req.body.truck, // TODO THIS SHOULD BE FROM THE FORM
        purchasedItems: req.body.items, // TODO EACH ITEM SHOULD HAVE NAME PRICE AND QUANTITY
        completed: new Date()
    };
    
    console.log('orderData:', orderData);
    
    var newOrder = new Order(orderData);
    var orderPromise = newOrder.save();
    orderPromise.then((order) => {
    
        var mailConfig = {
            from: `"${config.emailFromName}" <${config.emailFromAddress}>`,
            to: user.email,
            subject: 'HSA Dorm Supplies Confirmation',
            text: `Thank you for purchasing ${req.body.items}. Please venmo $${req.body.totalPrice} to ${config.venmoAccount}.`
        };
        transporter.sendMail(mailConfig);
    })
    .then(() => {
        res.sendStatus(200)
    }).catch((err) => next(err));
};

//TODO gets users purchase history
exports.getUserOrderHistory = (req, res, next) => {
    Order.find({user: req.params.id}, (err, orders) => {
        if (err) return next(err);
        res.send(orders);
    });
    
};

//TODO make a function that creats an admin. should be the exact same as the one that makes users except also adds an admin field.
exports.makeTruck = (req,res,next) => {
    var newTruck = new Truck(req.body);
    newTruck.save((err, user) => {
        if (err) {
            console.log(err);
            if (err.code === 11000)
                return res.status(400).send('Email, phone, or venmo account number already registered');
            return next(err);
        }
        return res.sendStatus(200);
    });
};

//TODO make a fucntion that updaetes the admin value for a specific user.
exports.removeAdminPrivs = (req, res, next) => {

};

exports.deleteTruck = (req, res, next) => {
    if (req.params.id !== req.user.id && !req.user.isAdmin)
        return res.status(403).send("You don't have permission to do that");
    Truck.findByIdAndRemove(req.params.id, (err) => {
        if (err) return next(err);
        res.status(200).json({
            message: 'Deleted the truck'
        });
    });
};
