var exports = module.exports = {};
var mongoose = require('mongoose');
require('../../config/db');
var chatroom = require('../chatrooms');
var sfs = require('./$sfs');

var mdlChat = require('../chatrooms'),
mdlUser = require('../users'),
mdlAssets = require('../assets'),
mdlPosts = require('../posts');    

// NOTE!!! Callback Function must have err, data, and client (in order of err, data, client) parameters that are handled. I.E set null for no error. Callback is required.

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
        case 'posts':
            currentModel = mdlPosts;
      }
};

exports.get = function(dataModel, query, loginBool, callback){
    setModel(dataModel);
            if(query == null || query == undefined || Object.keys(query).length == 0 ){
                        currentModel.find({}, function(err, docs){
                           if(err) { callback(400, err); } else {
                                callback(200, sfs(docs));
                            }
                        });        
           } else { 
                    currentModel.find(query, function(err, docs){
                       if(err) { callback(400, err); } else {
                            if(loginBool == true){
                                callback(200, docs);
                            } else {
                                callback(200, sfs(docs));
                            }
                        }
                    });     
           }    
};

/* exports.getOne = function(dataModel, id, callback){
    setModel(dataModel);
    
    client.get(dataModel + id, function(err, reply){
        var cReply;
        if(reply == null || reply == "[]"){ cReply = []; } else { cReply = reply; }
        if(cReply.length != 0){
            if(err) { callback(400, err); } else {
                    callback(200, sfs(JSON.parse(cReply)));   
                }
        } else {
            currentModel.findOne({ _id: id }, function(err, doc){  
               if(err) { callback(400, err); } else {
                    var cache = JSON.stringify(doc);
                    client.set(dataModel + ":" + id, cache);
                    callback(200, sfs(docs));
                }
            });
        }    
    });
};*/

exports.post = function(dataModel, data, callback){
    setModel(dataModel);
    var document = new currentModel(data);
    document.save(function(err, doc){
       if(err) { callback(400, err); } else {
            callback(200, sfs(doc));
        }
    });
}; 

exports.put = function(dataModel, query, data, callback){
    setModel(dataModel);
        currentModel.update(query, {$set: data }, {"multi": true}, function(err, doc){
            if(err) { callback(400, err); } else {
                callback(200, sfs(doc));
            }
        });    
};

exports.delete = function(dataModel, query, callback){
    setModel(dataModel);
     currentModel.remove(query, function(err, doc){
        if(err) { callback(400, err); } else {
            callback(200, sfs(doc));
        }
    });  
};

exports.deleteId = function(dataModel, id, callback){
    setModel(dataModel);
    currentModel.findById(id, function(err, docs){
        console.log(docs)
       if(err) { callback(400, err); } else {
            currentModel.remove(docs, function(err, doc){
            if(err) { callback(400, err); } else {
                callback(200, sfs(doc));
            }
        }); 
        }
    });
};