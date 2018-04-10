var exp = module.exports = {};
var db = require('../../models/functions/dbMethods');

exp.main = function(data, httpMethod, cb){
    if(httpMethod === "GET"){
        var mainCall = function(stat, response){
            if(stat == 200){
                cb(200, response);
            } else {
                cb(stat, response);
            }
        };
        if(data.password == undefined){
           db.get('assets', data, false, mainCall); 
        } else {
           cb(400, 'Query must not contain sensitive information.')
        }
    } else {
        cb(400, 'Unknown Method.');
    }
}