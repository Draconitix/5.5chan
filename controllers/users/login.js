var exp = module.exports = {};
var jwt = require('jsonwebtoken'),
validator = require('./$validator'),
sfs = require('../../models/functions/$sfs'),
db = require('../../models/functions/dbMethods');
require('dotenv');

exp.main = function(data, httpMethod, cb){
    if(httpMethod == "POST"){
        var vResult = validator(data);
        var mainCall = function(stat, response){
            if(stat == 200 && response[0] != undefined && data.password == response[0].password && vResult.flags == 0){
                var payload = sfs(JSON.stringify(response[0]));
				console.log(payload);
                jwt.sign(payload, process.env.JWT_SECRET, function(err, token){
                    cb(200, { token: token });
                });
            } else if(vResult.flags > 0) { 
                cb(400, vResult.errors);
            } else {
                cb(404, 'User not found.');
            }
        }
        db.get('user', data, true, mainCall);
    } else {
        cb(400, 'Unknown Method.')
    }
};