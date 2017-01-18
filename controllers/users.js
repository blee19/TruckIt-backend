const mongoose = require('mongoose');
const User = require('../models/schemas/user');

exports.getAllUsers = (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) return next(err);
        res.json(users);
    });
};

exports.getUserById = (req, res, next) => {
    if (req.params.id !== req.user.id && !req.user.isAdmin)
        return res.status(403).send("You don't have permission to do that");
    User.findById(req.params.id, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).send('No user with that ID');
        res.json(user);
    });
};

// TODO verification if inputs are good.
exports.createUser = (req, res, next) => {
    if (req.body.password) req.body.hash = req.body.password;
    var newUser = new User(req.body);
    newUser.save()
    .then((result) => next())
    .catch((err) => {
        if (err.code === 11000)
            return res.status(400).send('Email already registered');
        next(err)
    });
};

// TODO verification if inputs are good
exports.updateUser = (req, res, next) => {
    if (req.params.id !== req.user.id && !req.user.isAdmin)
        return res.status(403).send("You don't have permission to do that");
    User.findByIdAndUpdate(req.user.id, req.body, (err, doc) => {
        if (err) return next(err);
        if (!doc) return res.status(404).send('No user with that ID');
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

// //TODO get a list of active trucks
// exports.getActiveTrucks =
//
// //TODO adds item to user's current order (add to sessionStorage).
// exports.editOrder =
//
// //TODO have a way for a user to check what's in their cart
// exports.getCart =
//
// //TODO allows users to place orders
// exports.placeOrder =
//
// //TODO gets users purchase history
// exports.getOrderHistory =
