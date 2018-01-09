var exp = module.exports = {};
db = require('../../models/functions/dbMethods');

exp.main = function(data, user, httpMethod, cb){
    if(httpMethod === "DELETE"){
        var mainCall = function(stat, response){
            if(stat == 200){
                 cb(200, response);
            } else {
                 cb(stat, response);
            }
        };
        data.user = user;
        db.delete('chat', data, mainCall);
    } else {
         cb(400, 'Unknown Method.');
    }
};