var exports = module.exports = {};
var db = require('../../../models/functions/dbMethods');

// What httpMethods can we use?

exports.httpMethods = { get: { bool: true, specialOnly: false }, post: { bool: true, specialOnly: false }, put: { bool: true, specialOnly: false }, del: { bool: true, specialOnly: false }};


var req = null,
res = null,
query = null,
data = null,
defCall = function(err, docs){
        if(err) { return res.end(JSON.stringify(err)) };
        res.end(JSON.stringify(docs));
};

exports.clientReqVars = function(reqP, resP){
    req = reqP;
    res = resP;
    query = reqP.body.query;
    data = reqP.body.data;
};

exports.chatList = function(){
    db.get('chatroom', query, defCall);
    console.log('list')
}

exports.chatCreate = function(){
    db.post('chatroom', query, defCall);
};

exports.chatFind = function(){
    db.get('chatroom', req.params._id, defCall);
};

exports.chatEdit = function(){
    if(data == null || query == null) { res.status(400); res.send('Bad request, no change data was sent.');} else {
        db.put('chatroom', query, data, defCall);
    }
};

exports.chatDelete = function(){
    if(query == null){  res.status(400); res.send('Bad request, no query criteria was sent.'); } else {
        db.delete('chatroom', query, defCall);
    }
};