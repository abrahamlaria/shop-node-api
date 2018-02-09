const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

//Create a new user
route.post('/signup', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId,

    });
});


module.exports = router;