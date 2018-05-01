var exp = module.exports = {};
db = require('../../models/functions/dbMethods');

exp.main = function(data, user, httpMethod, cb){
    if(httpMethod == "DELETE"){
        if(typeof query == "object"){
        var mainCall = function(stat, response){
            if(stat == 200){
                 cb(200, response);
            } else {
                 cb(stat, response);
            }
        };
        //console.log(data);
        db.delete('chat', { chatroom: data.chatroom, user: user, text: data.text }, mainCall);
        } else {
             cb(400, 'No data given');
        }
    } else {
        cb(400, "Unknown method.")
    }
};