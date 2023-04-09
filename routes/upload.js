module.exports = function (app, middles) {
    //multer
    var multer = require('multer')
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/upload')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        },
    })
    var upload = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            console.log(file)
            if (
                file.mimetype == 'image/bmp' ||
                file.mimetype == 'image/png' ||
                file.mimetype == 'image/jpeg' ||
                file.mimetype == 'image/jpg'
            ) {
                cb(null, true)
            } else {
                return cb(new Error('Only image are allowed!'))
            }
        },
    }).single('avatar')

    app.post('/upload', function (req, res) {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.log('A Multer error occurred when uploading.')
            } else if (err) {
                console.log('An unknown error occurred when uploading.' + err)
            } else {
                console.log(req.file.filename)
                res.json({ result: 1, message: req.file.filename })
            }
        })
    })
}
