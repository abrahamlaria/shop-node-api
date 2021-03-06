const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb://nodeshop:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop-shard-00-00-eotmg.mongodb.net:27017,node-rest-shop-shard-00-01-eotmg.mongodb.net:27017,node-rest-shop-shard-00-02-eotmg.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin');
mongoose.Promise = global.Promise;

//Adds logs to the console
app.use(morgan('dev'));

//Makes the uploads folder public
app.use('/uploads', express.static('uploads'));

//Parses the body of the request to a readable format
app.use(bodyParser.urlencoded({
    extended: false
}));

//Extract json data and makes it readable
app.use(bodyParser.json());

//Adding headers to handle CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-', 
            'GET, POST, PUT, PATCH, DELETE'
        );
        return Response.status(200).json({});
    }
    next();
});

//Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

//Handles not found routes
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

//Handles any other errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;