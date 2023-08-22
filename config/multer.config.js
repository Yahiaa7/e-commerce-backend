const multer = require('multer');
const path = require('path');

const singleUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/images/users');
        },
        filename: (req, file, cb) =>
            cb(null, `userImage-${Date.now()}${path.extname(file.originalname).toLowerCase()}`)
    }),
    fileFilter: (req, file, cb) => {   
        cb(null, true);
    }
});

const multiUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'public/images/products'),
        filename:
            (req, file, cb) => cb(null, `productImage-${Date.now()}${path.extname(file.originalname).toLowerCase()}`)
    }),
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

module.exports = {
    multer,
    singleUpload,
    multiUpload
};