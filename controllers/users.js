const mongoose = require('mongoose');
const User = require('../models/schemas/user');
const validator = require('email-validator');
const Truck = require('../models/schemas/truck');
const Order = require('../models/schemas/order');

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
    if (typeof req.body.phone !== 'string')
        return res.status(400).send('No phone');
    if (typeof req.body.phoneProvider !== 'string')
        return res.status(400).send('No phoneProvider');

    var userData = {};

    if (req.body.firstName && typeof req.body.firstName === 'string')
        userData.firstName = req.body.firstName;
    if (req.body.lastName && typeof req.body.lastName === 'string')
        userData.lastName = req.body.lastName;

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

    if (req.body.password) {
        req.body.hash = req.body.password;
    }

    var newUser = new User(userData);
    newUser.save((err, user) => {
        if (err) {
            if (err.code === 11000)
                return res.status(400).send('Email or phone number already registered');
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
    if (Truck.findById(req.user.isAdmin) === )

    if ( req.user.isAdmin !== req.params.id && !req.user.isSuperAdmin)
        return res.status(403).send("You don't have permission to do that");
    if ()
    User.findByIdAndUpdate(req.user.id, req.body, (err, doc) => {

    })
}

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

//TODO fix so that it gets a users pending orders from Orders DB
exports.getPendingOrders = (req, res, next) => {
    User.aggregate([
        { $match: {
            $and: [
                {'purchases.purchasedDate': {$exists: true}},
                {$or: [
                    {'purchased.isPaid': false},
                    {'purchased.deliveredDate': {$exists: false}}
                ]}
            ]
        }},
        { $project: {
            email: true,
            purchases: { $filter: {
                input: '$purchases',
                as: 'p',
                cond: { $or: [
                    { $ne: ['$$p.isPaid', true] },
                    { $lt: ['$$p.deliveredDate', 1 ]}
                ]}
            }}
        }}
    ]).exec().then((users) => res.json(users))
    .catch((err) => next(err));
};

//TODO get a list of active trucks
exports.getActiveTrucks = (req, res, next) => {
    Truck.find({ isActive: true }, (err, trucks) => {
        if (err) return next(err);
        res.json(trucks);
    });
};


//TODO adds item to user's current order (add to sessionStorage).
exports.editOrder = (req, res, next) => {
    Order.findByIdAndUpdate(req.params.id, req.body, (err, order) => {
        if (err) return next(err);
        if (!order) return res.status(404).send('No item with that ID');
        res.Status(200).json({
            message: 'We updated your order'
        });
    });
};

//TODO have a way for a user to check what's in their cart
exports.getCart = (req, res, next) => {

};

//TODO allows users to place orders
exports.placeOrder = (req,res, next) => {

};

//TODO gets users purchase history
exports.getOrderHistory = (req, res, next) => {

};

//TODO make a function that creats an admin. should be the exact same as the one that makes users except also adds an admin field.
exports.makeAdmin = (req,res,next) => {

};

//TODO make a fucntion that updaetes the admin value for a specific user.
exports.removeAdminPrivs = (req, res, next) => {

};
