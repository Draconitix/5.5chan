var exp = module.exports = {};
var db = require('../../models/functions/dbMethods');
var ObjectId = require('mongodb').ObjectID;

exp.main = function(query, user, httpMethod, cb){
    if(httpMethod == "DELETE"){
        if(typeof query == "object"){
        var mainCall = function(stat, response){
            if(stat == 200){
                 cb(200, response);
            } else {
                 cb(stat, response);
            }
        };
        console.log(query);
        query.user = user;
        db.deleteId('posts', query._id, mainCall);
        } else {
             cb(400, 'No data given');
        }
    } else {
        cb(400, "Unknown method.")
    }
};