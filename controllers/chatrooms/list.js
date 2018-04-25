var exp = module.exports = {};
db = require('../../models/functions/dbMethods');

exp.main = function(data, httpMethod, cb){
    if(httpMethod === "GET"){
        var mainCall = function(stat, response){
            if(stat == 200){
                 cb(200, response);
            } else {
                 cb(stat, response);
            }
        };
        db.get('chat', data, false, mainCall);
    } else {
         cb(400, 'Unknown Method.');
    }
};