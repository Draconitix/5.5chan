var exports = module.exports = {};
var dbMethods = require('../../../models/functions/dbMethods');
var chatrooms = require('../methods/chatrooms');
var users = require('../methods/users');
var assets = require('../methods/assets');

var methodPermission = function(mdlName){
    switch(mdlName) {
        case 'user': 
            return users.httpMethods.get;
            break;
        case 'chat':
            return chatrooms.httpMethods.get;
            break;
        case 'assets':
            return assets.httpMethods.get;
            break;
        default: 
            return false;
    }
};

exports.main = function(req, res){
    var query = null;
    var splc = req.query.q.split('_');
    var dbModel = splc[0];
    var permit = methodPermission(dbModel);
    if(permit.bool == false){
        res.status(404);
        res.end('DB method not found.');
    }
    var id = splc[1];    
    var specialFunc = req.query.s;
    if(typeof id === "undefined"){
        query = null;    
    } else {
        query = { "_id": id };
    }
     var defCall = function(err, docs){
        if(err) { return res.end(JSON.stringify(err))};
        if(docs.length == 1){ res.end(JSON.stringify(docs[0]));} else {
            res.end(JSON.stringify(docs))
        }
    };
    if(typeof specialFunc === "undefined" && permit.specialOnly == false){
        dbMethods.get(dbModel, query, defCall);    
    } else {
        switch(dbModel){
            case 'user':
                users.clientReqVars(req, res);
                switch(specialFunc){  
                    case 'session':
                        users.getSession();
                        break;
                    default:
                        res.status(404)
                        res.end('Invalid query.');
                }
                break;
            default:
                res.status(404)
                res.end('Invalid query.');    
        }
    }
};