var exports = module.exports = {};
var mongoose = require('mongoose'),
client = require('../../config/client').client;
require('../../config/db');
var chatroom = require('../chatrooms');

var mdlChat = require('../chatrooms'),
mdlUser = require('../users'),
mdlAssets = require('../assets');    

// NOTE!!! Callback Function must have err, data, and client (in order of err, data, client) parameters that are handled. I.E set null for no error. Callback is required.

// Strip data of fields with sensitive information

var sfs = function(data){
    var sfsArr = ['password', 'uploadsPath'];
    for(var i=0; i < data.length; i++){
        var currRep = data[i];
        for(var x in currRep){
            for(var y=0; y < sfsArr.length; y++){
                if(x == sfsArr[y]){
                    currRep[x] = undefined;
                }
            }
        }   
    }
    return data;
};

var currentModel = null;

var setModel = function(mdlName){
    switch(mdlName){
        case 'chat':
            currentModel = mdlChat;
            break;
        case 'user':
            currentModel = mdlUser;
            break;
        case 'assets':    
           currentModel = mdlAssets;
            break;
      }
};

exports.get = function(dataModel, query, callback){
    setModel(dataModel);
    
    
    if(query == null){
        client.get(dataModel + 'list', function(err, reply){
            var cReply;
            if(reply == null || reply == "[]"){ cReply = []; } else { cReply = reply; }
            if(cReply.length != 0){
               if(err) { callback(err, null); } else {
                        callback(null, sfs(JSON.parse(cReply)));
                }
            } else {
                currentModel.find({}, function(err, docs){
                   if(err) { callback(err, null); } else {
                        var cache = JSON.stringify(docs);
                        client.set(dataModel + 'list', cache);
                        callback(null, sfs(docs));
                    }
                });        
            }
        });
   } else {
       client.get(dataModel + 'list' + JSON.stringify(query), function(err, reply){
           var cReply;
           if(reply == null || reply == "[]"){ cReply = []; } else { cReply = reply; }
           if(cReply.length != 0){
               if(err) { callback(err, null); } else {   
                        callback(null, sfs(JSON.parse(cReply)));
                        console.log(reply + ' reply. ' + reply.length)
                }
           } else {
            currentModel.find(query, function(err, docs){
               if(err) { callback(err, null); } else {
                    var cache = JSON.stringify(docs);
                    client.set(dataModel + 'list' + JSON.stringify(query), cache);
                    //console.log(docs)
                    callback(null, sfs(docs));
                }
            });   
           }
       });
   }
};

exports.getOne = function(dataModel, id, callback){
    setModel(dataModel);
    
    
    client.get(dataModel + id, function(err, reply){
        var cReply;
        if(reply == null || reply == "[]"){ cReply = []; } else { cReply = reply; }
        if(cReply.length != 0){
            if(err) { callback(err, null); } else {
                    callback(null, sfs(JSON.parse(cReply)));   
                }
        } else {
            currentModel.findOne({ _id: id }, function(err, doc){  
               if(err) { callback(err, null); } else {
                    var cache = JSON.stringify(doc);
                    client.set(dataModel + ":" + id, cache);
                    callback(null, sfs(docs));
                }
            });
        }    
    });
};

exports.post = function(dataModel, data, callback){
    setModel(dataModel);
    var document = new currentModel(data);
    document.save(function(err, doc){
       if(err) { callback(err, null); } else {
            var cache = JSON.stringify(doc);
            client.set(dataModel + doc._id, cache);
            callback(null, sfs(doc));
        }
    });
}; 

exports.put = function(dataModel, query, data, callback){
    setModel(dataModel);
    currentModel.update(query, {$set: data }, function(err, doc){
       if(err) { callback(err, null); } else {
            var cache = JSON.stringify(doc);
            client.set(dataModel + doc._id, cache);
            callback(null, sfs(docs));
        }
    });
};

exports.delete = function(dataModel, query, callback){
    setModel(dataModel);
    currentModel.remove(query, function(err, docs){
       if(err) { callback(err, null); } else {
            client.del(dataModel + query._id);
            client.del(dataModel + 'list' + JSON.stringify(query));
            callback(null, sfs(docs));
        }
    });
};