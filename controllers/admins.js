const User = require('../models/schemas/user');

exports.getAllItems = (req, res, next) => {
    Item.find({}, (err, items) => {
        if (err) return next(err);
        res.json(items);
    });
};

exports.getItemById = (req, res, next) => {
    Item.findById(req.params.id, (err, item) => {
        if (err) return next(err);
        if (!item) return res.status(404).send('No item with that ID');
        res.json(item);
    });
};

exports.createItem = (req, res, next) => {
    var newItem = new Item(req.body);
    newItem.save()
    .then((ret) => res.sendStatus(200))
    .catch((err) => next(err));
};

exports.updateItemById = (req, res, next) => {
    Item.findByIdAndUpdate(req.params.id, req.body, (err, doc) => {
        if (err) return next(err);
        if (!doc) return res.status(404).send('No item with that ID');
        res.sendStatus(200);
    });
};

exports.deleteItem = (req, res, next) => {
    Item.findByIdAndRemove(req.params.id, (err) => {
        if (err) return next(err);
        res.sendStatus(200);
    });
};

exports.completeOrder = (req, res, next) => {
    Item.findByIdAndUpdate(req.params.id, {isComplete: true}, (err, doc) => {
        if (err) return next(err);
        if (!doc) return res.status(404).send('No item with that ID');
        res.sendStatus(200);
    });
};