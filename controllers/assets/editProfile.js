var exp = module.exports = {};
var db = require('../../models/functions/dbMethods');

exp.main = function(data, user, httpMethod, cb){
    console.log();
    if(httpMethod === "PUT" && typeof data === "object" && Object.keys(data).length > 0){
        var changeToProfileCb = function(stat, res){
            if(stat == 200){
                cb(200, res)
            } else {
                cb(400, res)
            }
        };
        var prevProfileCb = function(stat, res){
            if(stat == 200){
                if(data.user == undefined || data.user == null || data.user == ''){
                    data.user = user.username;
                }
                db.put('assets', data, { location: 'profile'}, changeToProfileCb);
            } else {
                cb(400, res)
            }
        };
        db.put('assets', { user: user.username, location: 'profile' }, { location: 'gallery'}, prevProfileCb);
    } else if(typeof data === "object" && Object.keys(data).length == undefined){
        cb(400, 'No query given.')          
    } else {
        cb(400, 'Unknown Method.');
    }
}