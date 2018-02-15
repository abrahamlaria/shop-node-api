const multer = require('multer');


//Storage a product image in the uploads folder
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

exports.images_storage = storage;


//Accept only .jpg and .png images files
const fileFilter = (req, file, cb) => {
    
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

exports.images_storage = fileFilter;

//Uploads the image and limits the file size to 2Mb
exports.images_upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 2 //Up to 2Mb
    },
    fileFilter: fileFilter
});