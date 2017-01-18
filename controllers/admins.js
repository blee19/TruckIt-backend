const User = require('../models/schemas/user');
const Order = require('../models/schemas/order');
const Truck = require('/..../models/schemas/truck');

exports.getMenuItems = (req, res, next) => {
    Truck.findById(req.params.truckId, (err, truck) => {
        if (err) return next(err);
        if (!truck) return res.status(404).send('No truck with that ID');
        truck.menu.find({}, (err, items) => {
            if (err) return next(err);
            if (!items) return res.status(404).send('No menu items under this truck');
            res.json(items);
        })

    });
};

exports.getMenuItem = (req, res, next) => {
    Truck.findById(req.params.TruckId, (err, truck) => {
        if (err) return next(err);
        if (!truck) return res.status(404).send('No truck with that ID');
        truck.menu.findById(req.params.itemId, (err, item) => {
            if (err) return next(err);
            if (!item) return res.status(404).send('No menu item with that ID');
            res.json(item);
        });

    });
};

// exports.getItemById = (req, res, next) => {
//     Item.findById(req.params.id, (err, item) => {
//         if (err) return next(err);
//         if (!item) return res.status(404).send('No item with that ID');
//         res.json(item);
//     });
// };

exports.createItem = (req, res, next) => {
     Truck.findById(req.params.TruckId, (err, truck) => {
            if (err) return next(err);
            if (!truck) return res.status(404).send('No truck with that ID');
            truck.menu.push(req.body);
            truck.save(function (err) {
                if (err) return handleError(err)
                console.log('Menu item added!');
            });
        });

    };


exports.updateItemById = (req, res, next) => {
        Truck.findById(req.params.TruckId, (err, truck) => {
            if (err) return next(err);
            if (!truck) return res.status(404).send('No truck with that ID');
            truck.items.findByIdAndUpdate(req.params.itemId, req.body, {new:true}, (err, truck) => {
                if (err) return next(err);
                if (!truck) return res.status(404).send('No item with that ID');
            })
            res.sendStatus(200);
    });
};

exports.deleteItem = (req, res, next) => {
    Truck.findById(req.params.TruckId, (err, truck) => {
            if (err) return next(err);
            if (!truck) return res.status(404).send('No truck with that ID');
            truck.items.findByIdAndUpdate(req.params.itemId, req.body, {new:true}, (err, truck) => {
                if (err) return next(err);
                if (!truck) return res.status(404).send('No item with that ID');
            })
            res.sendStatus(200);
    });
};

exports.getPendingOrders = (req, res, next) => {
    Order.find({truck: req.params.truckId, completed: null}, (err, orders) => {
        if (err) return next(err);
        if (!orders) return res.status(404).send('No pending orders for this truck');
        res.json(orders);
    });
};

exports.markOrderComplete = (req, res, next) => {
    Order.findByIdAndUpdate(req.params.id, {isComplete: true}, {new:true}, (err, doc) => { //not sure if this will error....:/
        if (err) return next(err);
        if (!doc) return res.status(404).send('No order with that ID');
        res.json(doc);
    });
};

exports.getOrderHistory = (req, res, next) => {
    Order.find({truck: req.params.truckId}, (err, orders) => {
        if (err) return next(err);
        if (!orders) return res.status(404).send('No order history for this truck');
        res.json(orders);
    });
};
