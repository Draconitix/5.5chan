var exports = module.exports = {};
var chatrooms = require('../methods/chatrooms');
var users = require('../methods/users');
var assets = require('../methods/assets');

var methodPermission = function(mdlName){
    switch(mdlName) {
        case 'user': 
            return users.httpMethods.put;
            break;
        case 'chat':
            return chatrooms.httpMethods.put;
            break;
        case 'assets':
            return assets.httpMethods.put;
            break;
        default: 
            return false;
    }
};

exports.main = function(req, res){
    var defCall = function(err, docs){
    if(err) { return res.end(JSON.stringify(err))};
        if(docs.length == 1){ res.end(JSON.stringify(docs[0]));} else {
            res.end(JSON.stringify(docs))
        }
    }
    var query = req.body;
    var splc = req.query.q.split('_');
    var dbModel = splc[0];
    var permit = methodPermission(dbModel);
    if(permit.bool == false){
        res.status(404);
        res.end('DB method not found.');
    }
    var id = splc[1];    
    var specialFunc = req.query.s;
     if(typeof specialFunc === "undefined" && permit.specialOnly == false){
        dbMethods.put(dbModel, query, defCall);    
     } else {
        switch(dbModel){
            default:
                res.status(404)
                res.end('Invalid query.');
        }
    }
};