const multer = require('multer');
function findFolder(url) {
    if(url.indexOf("/api/product") !== -1){
        return 'products'
    }else if(url.indexOf('/api/user') !== -1) {
        return 'users'
    }
}
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const folder = findFolder(req.originalUrl)
        cb(null, `./uploads/${folder}`);
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        req.images += `|${name}`;
        cb(null, name)
    }
})
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else {
        cb(null, false,)
    }
}
const upload = multer({
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
