const jwt = require('jsonwebtoken');

//Verify that the token is valid and then export the function to be used as middleware to protect some routes that should be behind a login
module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch(error) {
        return res.status(401).json({
            message: 'Authentication failed'
        });
    }    
};