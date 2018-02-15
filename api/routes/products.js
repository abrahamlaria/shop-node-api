const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 2 //Up to 2Mb
    },
    fileFilter: fileFilter
});

const ProductsController = require('../controllers/products');

// Returns all products
router.get('/', ProductsController.products_get_all);

//Creates a new product and use the check-auth middleware to protect the route and allow access to it only under a valid access token
router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

//Returns a single product by ID
router.get('/:productId', ProductsController.products_get_product);

router.patch('/:productId', checkAuth, ProductsController.products_update_product);

//Delete a product by ID
router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;