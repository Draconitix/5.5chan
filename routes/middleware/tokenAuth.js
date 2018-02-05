var exp = module.exports = {};
var jwt = require('jsonwebtoken');
var colors = require('colors');
require('dotenv');
exp.main = function(req, res, next, rFunc){
    var header = req.headers["authorization"];
    if(rFunc == "login" || rFunc == "register" || rFunc == "list"){
        if(header == undefined){
            next();
        } else {
            res.status(400);
            res.end('You are already logged in.')
        }
    } else {
        if(typeof header !== 'undefined'){
            var bearer = header.split(" ");
            var bearerToken = bearer[1];
            jwt.verify(bearerToken, process.env.JWT_SECRET, function(err, user){
                if(err == null){
                    req.user = user;
                    // console.log(colors.green(req.user.username));
                    next();
                } else {
                    // console.log(colors.red(err));
                    res.status(403);
                    res.end("You are not authorized to access this resource.");
                }
            });
        } else {
            res.status(403);
            res.end("You are not authorized to access this resource.");
        }    
    }
};