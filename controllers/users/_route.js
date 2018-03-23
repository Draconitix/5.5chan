var exp = module.exports = {},
multer = require('multer'),
profile = multer().single('profile'),
methods = require('./_methods');

exp.main = function(req, res) {
    
    var mainCallback = function(stat, response){
        res.status(stat);
        res.send(response);
    };
    profile(req, res, function(err){
        if(err) {
            mainCallback(400, err.stack);
        } else {
            methods.exec(req.params.function, req.body, req.method, req.query, req.file, req.user, mainCallback);    
        }
    });
};