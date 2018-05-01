var exp = module.exports = {},
methods = require('./_methods');

exp.main = function(req, res) {
    
    var mainCallback = function(stat, response){
        res.status(stat);
        res.send(response);
    };
 
    methods.exec(req.params.function, req.body, req.query, req.user, req.method, mainCallback);    
};