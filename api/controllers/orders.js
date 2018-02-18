const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const mongoose = require('mongoose');

//Get all orders controller
exports.orders_get_all = (req, res, next) => {
    //First the user making the request in the database
    User
        .findById(req.userData.userId)
        .exec()
        .then(user => {
            // Check if the user is an Admin and if it is, return all existing orders. If it
            // is not an Admin only returns the orders that belongs to that user.
            Order
                .find()
                .select('product quantity _id createdBy date')
                .exec()
                .then(docs => {
                    const orders = () => {
                        if (user.admin) {
                            return docs.map(doc => {
                                return {
                                    _id: doc._id,
                                    product: doc.product,
                                    quantity: doc.quantity,
                                    createdBy: doc.createdBy,
                                    date: doc.date,
                                    totalPrice: doc.totalPrice,
                                    request: {
                                        type: 'GET',
                                        url: 'http://localhost:3000/orders/' + doc._id
                                    }
                                }

                            });
                        } else {
                            return docs
                                .filter(doc => doc.createdBy == req.userData.userId)
                                .map(doc => {
                                    return {
                                        _id: doc._id,
                                        product: doc.product,
                                        quantity: doc.quantity,
                                        createdBy: doc.createdBy,
                                        date: doc.date,
                                        totalPrice: doc.totalPrice,
                                        request: {
                                            type: 'GET',
                                            url: 'http://localhost:3000/orders/' + doc._id
                                        }
                                    }

                                });
                        }
                    }
                    res
                        .status(200)
                        .json({count: docs.length, orders: orders()});
                })
                .catch(err => {
                    res
                        .status(500)
                        .json({error: err});
                });

        })
        .catch(err => {
            res
                .status(500)
                .json({error: err});
        });

}

//Create order controller
exports.orders_create_order = (req, res, next) => {
    //Check if a product exist before creating an order
    Product
        .findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res
                    .status(404)
                    .json({message: 'Product not found'});
            }
            console.log(product.price);
            //If the product exist the create a new order object
            const order = new Order({
                _id: new mongoose
                    .Types
                    .ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId,
                createdBy: req.userData.userId,
                date: new Date().toISOString(),
                totalPrice: Number(product.price) * Number(req.body.quantity)
            });
            //Save the order that was created and handle responses
            return order.save();
        })
        .then(result => {
            console.log(result);
            res
                .status(201)
                .json({
                    message: 'Order stored',
                    createdOrder: {
                        _id: result._id,
                        product: result.product,
                        quantity: result.quantity,
                        createdBy: result.createdBy,
                        date: result.date,
                        totalPrice: result.totalPrice
                    },
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id
                    }
                });
        })
        .catch(err => {
            console.log(err);
            res
                .status(500)
                .json({error: err});
        });
}

//Get a specific order by ID controller
exports.orders_get_order = (req, res, next) => {
    Order
        .findById(req.params.orderId)
        .exec()
        .then(order => {
            if (!order) {
                return res
                    .status(404)
                    .json({message: 'Order not found'});
            }
            res
                .status(200)
                .json({
                    order: order,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders'
                    }
                });
        })
        .catch(err => {
            res
                .status(500)
                .json({error: err});
        });
}

//Delete a specific order by ID
exports.orders_delete_order = (req, res, next) => {
    Order
        .remove({_id: req.params.orderId})
        .exec()
        .then(result => {
            res
                .status(200)
                .json({
                    message: 'Order deleted',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/orders',
                        body: {
                            productId: 'ID',
                            quantity: 'Number'
                        }
                    }
                });
        })
        .catch(err => {
            res
                .status(500)
                .json({error: err});
        });
}