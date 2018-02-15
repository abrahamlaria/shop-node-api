const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ImagesController = require('../controllers/images');

//Storage a product image in the uploads folder
const storage = ImagesController.images_storage;

//Accept only .jpg and .png images files
const fileFilter = ImagesController.images_file_filter;

//Uploads the image and limits the file size to 2Mb
const upload = ImagesController.images_upload;

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