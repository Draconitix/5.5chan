var exp = module.exports = {};
db = require('../../models/functions/dbMethods');

exp.main = function(data, query, user, httpMethod, cb){
    if(httpMethod === "PUT"){
        var mainCall = function(stat, response){
            if(stat == 200){
                 cb(200, response);
            } else {
                 cb(stat, response);
            }
        };
        query.user = user;
        data.user = user;
        db.put('chat', query, data, mainCall);
    } else {
         cb(400, 'Unknown Method.');
    }
};