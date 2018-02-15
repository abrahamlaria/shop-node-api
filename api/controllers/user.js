const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//Create a new user (Signup)
exports.user_signup_user = (req, res, next) => {
    //Avoid duplicate emails
    User
        .find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res
                    .status(409)
                    .json({message: 'This email already exists.'});
            } else {
                //Encrypt the password and create a user.
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res
                            .status(500)
                            .json({error: err});
                    } else {
                        const user = new User({_id: new mongoose.Types.ObjectId, email: req.body.email, password: hash});
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res
                                    .status(201)
                                    .json({message: 'User created'});
                            })
                            .catch(err => {
                                console.log(err);
                                res
                                    .status(500)
                                    .json({error: err});
                            });
                    }
                })
            }
        })
}

//Login users
exports.user_login_user = (req, res, next) => {
    User.find({
        email: req.body.email
    })
        .exec()
        .then(user => {
            //If there's no user return a 401 (Unauthorized) insted of 404 (Not found) to prevent brute force attacks. 
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            }
            //if there's a user then compare the provided password with the one stored in the database.
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Authentication failed'
                    });
                }
                if (result) {
                    console.log(user[0].email, user[0]._id)
                    //Generate a token
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    });
                    //Return the auth token
                    return res.status(200).json({
                        message: 'Authorization successful',
                        token: token
                    });
                }
                //If for some reason none of the if statements can't be reached, return an 401 error.
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

//Delete a user
exports.user_delete_user = (req, res, next) => {
    User.remove({
        _id: req.params.userId
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}