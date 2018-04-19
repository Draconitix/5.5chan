var exp = module.exports = {},
multer = require('multer'),
file = multer().single('file'),
methods = require('./_methods');

exp.main = function(req, res) {
    
    var mainCallback = function(stat, response){
        res.status(stat);
        res.send(response);
    };
    file(req, res, function(err){
        if(err) {
            mainCallback(400, err);
        } else {
            methods.exec(req.params.function, req.body, req.method, req.query, req.file, req.user, mainCallback);    
        }
    });
};