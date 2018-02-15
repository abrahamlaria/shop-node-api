const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

//Returns all orders
router.get('/', checkAuth, OrdersController.orders_get_all);

//Creates a new order
router.post('/', checkAuth, OrdersController.orders_create_order);

//Returns a single order by order Id
router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

//Deletes an order by order ID
router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);

module.exports = router;