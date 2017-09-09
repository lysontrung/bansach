const multer = require('multer');

// xet thu muc chua hinh anh
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './public/sach'),
    filename: (req, file, cb) => cb(null, `${Date.now()}${file.originalname}`)
});

// xet kich thuoc file
const limits = { fileSize: 500 * 1024 };

// xet định dang file
const fileFilter = (req, file, cb) => {
    const { mimetype } = file;
    const condition = mimetype === 'image/png' || mimetype === 'image/jpeg';
    if (condition) return cb(null, true);
    cb(new Error('File must be an image'));
};

const uploadConfig = multer({ storage, limits, fileFilter });

module.exports = uploadConfig;