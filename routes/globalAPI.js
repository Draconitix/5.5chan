var express = require('express'),
colors = require('colors'),
router = express.Router(),
gCall = require('../controllers/api/callbacks'),
multer = require('multer'),
rString = require('randomstring'),
path = require('path'),    
upload = multer({  storage: multer.diskStorage({ destination: 'dist/tmp/', filename: function(req, file, cb){
    cb(null, rString.generate(16) + path.extname(file.originalname));
}})});        

// Routing

/* GET home page. 
router.get('/', function(req, res, next) {
    res.render('indexAPI');
});*/

/* Global API */

router.get('/', gCall.get);

router.post('/', gCall.post);

router.put('/', gCall.put);

router.delete('/', gCall.delete);

/* File Uploads */

router.post('/uploads', upload.single('msgImgUpload'), gCall.post);

router.delete('/uploads', gCall.delete);

module.exports = router;
