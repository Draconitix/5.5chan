app.service('interface', function($cookies, $http, $q, jwtHelper, messageParser){
    var token = $cookies.get('accessToken');
    var user = jwtHelper.decodeToken(token);
    var socket = io.connect('', {
        'query': 'auth_token=' + token
    });
    
    // Messaging methods
    
     var createMessage = function(data){
        var deferred = $q.defer();
        $http({ method: 'POST', url: 'chat/post/create', data: data, headers: { 'Authorization': 'Bearer ' + token}}).then(function(res){
            deferred.resolve(res.data);
        }, function(err){
            deferred.reject(err);
        })
        return deferred.promise;
    };
    
    var sendMessage = function(text, cb){
        var parts = messageParser(text);
        createMessage({ parts: parts, user: user.username, text: text, chatroom: $cookies.get('chatroom') }).then(function(res){
            cb(res);
            socket.emit('sendMessage', res);
        });
    }
    
    // Must make routing in backend though
    var getMessages = function(chatroom){
        var deferred = $q.defer();
        $http({ method: 'GET', url: 'chat/post/list', params: { chatroom: chatroom }}).then(function(res){
            deferred.resolve(res.data);
        }, function(err){
            deferred.reject(err);
        })
        return deferred.promise;
    };
    
   
    
    var delMessage = function(query){
        var deferred = $q.defer();
        $http({ method: 'DELETE', url: 'chat/post/remove', params: { _id: query._id }, headers: { 'Authorization': 'Bearer ' + token}}).then(function(res){
            deferred.resolve(res.data);
            socket.emit('messageUpdate', { msgId: query._id, method: 'DELETE'})
        }, function(err){
            deferred.reject(err);
        })
        return deferred.promise;
    }
    
    var editMessage = function(query, data){
        console.log('data.text ' + data.text)
        var deferred = $q.defer();
        $http({ method: 'PUT', url: 'chat/post/update', params: { _id: query._id, chatroom: query.chatroom, text: query.text, user: user.username }, data: data, headers: { 'Authorization': 'Bearer ' + token}}).then(function(res){
            deferred.resolve(res.data);
            console.log('data.text ' + data.text)
            socket.emit('messageUpdate', { msgId: query._id, method: 'PUT', text: data.text, parts: data.parts})
        }, function(err){
            deferred.reject(err);
        })
        return deferred.promise;
    }
    
    // Messaging callback
    var chatRoomUsers;
    
    var messageMain = function(cb){
        cbMsg = cb;
    };
    
    var cbMsg;
    
    var msgCb = function(msgData){
        cbMsg(msgData);
    };
    
    socket.on('message', function(data){
        msgCb(data);
    })
    
   // Chatroom methods
    
    var getRooms = function(){
        var deferred = $q.defer();
        $http({ method: 'GET', url: 'chat/chatroom/list'}).then(function(res){
            deferred.resolve(res.data)
        }, function(err){
            deferred.reject(err)
        });
        return deferred.promise;
    };
    
    var createRoom = function(roomData){
        var deferred = $q.defer();
        $http({ method: 'POST', url: 'chat/chatroom/create', headers: { 'Authorization': 'Bearer ' + token}, data: roomData }).then(function(res){
            deferred.resolve(res.data)
            socket.emit('postRoom', res.data);
        }, function(err){
            deferred.reject(err)
        });
        return deferred.promise;
    }
    
    var deleteRoom = function(roomData){
        var deferred = $q.defer();
        console.log(roomData)
        $http({ method: 'DELETE', url: 'chat/chatroom/remove', headers: { 'Authorization': 'Bearer ' + token }, params: { name: roomData.name, user: user.username } }).then(function(res){
            deferred.resolve(res.data)
            // Using Posting room event will cause everybody's listing to referesh
            socket.emit('postRoom', res.data);
        }, function(err){
            deferred.reject(err)
        });
        return deferred.promise;
    }
    
    var editRoom = function(query, data){
        var deferred = $q.defer();
        $http({ method: 'PUT', url: 'chat/chatroom/update', headers: { 'Authorization': 'Bearer ' + token}, params: { name: query.name, user: user.username }, data: data }).then(function(res){
            deferred.resolve(res.data)
            socket.emit('postRoom', data);
        }, function(err){
            deferred.reject(err)
        });
        return deferred.promise;
    }
    
    // User methods
    
    var getUsers = function(){
        var deferred = $q.defer();
        $http({ method: 'GET', url: 'chat/user/list'}).then(function(res){
            deferred.resolve(res.data)
        }, function(err){
            deferred.reject(err)
        });
        return deferred.promise;
    }
    
    var joinChat = function(room){
        socket.emit('chatJoin', { chatroom: room, user: user.username });
        
    };
    
    var leaveChat = function(room){
        socket.emit('chatLeave', { chatroom: room, user: user.username });
        $cookies.remove('chatroom');
    }
    
    // Promise handling
    
    var promiseMain = function(cb){
        cbPromise = cb;
    };
    
    var cbPromise;
    
    var promiseCb = function(err){
        cbPromise(err)
    };
    
    
    // New Msg
     
    var msgPromiseMain = function(cb){
        msgCbPromise = cb;
    };
    
    var msgCbPromise;
    
    var msgPromiseCb = function(msgs){
        msgCbPromise(msgs)
    };
    
    // Del Msg
    
    var msgDeleteMain = function(cb){
        msgDelPromise = cb;
    };
    
    var msgDelPromise;
    
    var msgDelCb = function(msgId){
        msgDelPromise(msgId)
    };
    
    // Edit Msg
    
    var msgEditMain = function(cb){
        msgEditPromise = cb;
    };
    
    var msgEditPromise;
    
    var msgEditCb = function(msgId, text, parts){
        msgEditPromise(msgId, text, parts)
    };
    
    
    socket.on('chatPromise', function(data){
        if(data.error){
            promiseCb(data.error);
        } else {
            $cookies.put('chatroom', data.name);
            chatRoomUsers = data.users;
            console.log(chatRoomUsers);
            promiseCb();
        }
    });
    
    socket.on('postRoom', function(data){
        promiseCb('update');
    });
    
    socket.on('messageDelete', function(data){
        msgDelCb(data._id)
    })
    
    socket.on('messageEdit', function(data){
        console.log('edit cb data.text = ' + data.text)
        msgEditCb(data._id, data.text, data.parts);
    })
    
    socket.on('roomUpdate', function(data){
        if(data.addUser == true) { if(chatRoomUsers.indexOf(data.user) == -1){ chatRoomUsers.push(data.user) } };
        if(data.addUser == false){ chatRoomUsers.map(function(e, i){ if(e == data.user){ chatRoomUsers.splice(i, 1) } }); }
    });
    
    return { promise: promiseMain, join: joinChat, getRooms: getRooms, createRoom: createRoom, deleteRoom: deleteRoom, editRoom: editRoom, getUsers: getUsers, leave: leaveChat, send: sendMessage, incoming: messageMain, users: chatRoomUsers, getMessages: getMessages, msgPromise: msgPromiseMain, editMessage: editMessage, delMessage: delMessage, msgDelPromise: msgDeleteMain, msgEditPromise: msgEditMain };
});