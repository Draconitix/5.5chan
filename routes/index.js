var express = require('express'),
router = express.Router();
// Routing

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

module.exports = router;