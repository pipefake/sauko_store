const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage({
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
            const uniqueName = Date.now() + '-' + file.originalname;
            cb(null, uniqueName);
        } else {
            cb(new Error('Solo imágenes .jpg, .jpeg o .png'));
        }
    }
});

const upload = multer({ storage });

module.exports = upload;
