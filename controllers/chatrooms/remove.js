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
        console.log(data);
        db.delete('chat', { name: data.name, user: user }, mainCall);
    } else {
         cb(400, 'Unknown Method.');
    }
};