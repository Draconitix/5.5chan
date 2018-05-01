var exp = module.exports = {};
db = require('../../models/functions/dbMethods');

exp.main = function(query, httpMethod, cb){
    if(httpMethod == "GET"){
        if(typeof query == "object"  && typeof query.chatroom == "string"){
        var mainCall = function(stat, response){
            if(stat == 200){
                 cb(200, response);
            } else {
                 cb(stat, response);
            }
        };
        db.get('posts', query, false, mainCall);
        } else {
             cb(400, 'No chatroom given');
        }
    } else {
        cb(400, "Unknown method.")
    }
};