app.service('interface', function($cookies, $http, $q, jwtHelper, messageParser){
    var token = $cookies.get('accessToken');
    var user = jwtHelper.decodeToken(token);
    var socket = io.connect('', {
        'query': 'auth_token=' + token
    });
    
    // Messaging methods
    
    var sendMessage = function(text){
        var parts = messageParser(text);
        socket.emit('sendMessage', { parts: parts, user: user.username, text: text });
    }
    
    var getMessages = function(chatroom){
        socket.emit('getMessages', { chatroom: chatroom });
    };
    
    
    
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
    
    socket.on('roomUpdate', function(data){
        if(data.addUser == true) { if(chatRoomUsers.indexOf(data.user) == -1){ chatRoomUsers.push(data.user) } };
        if(data.addUser == false){ chatRoomUsers.map(function(e, i){ if(e == data.user){ chatRoomUsers.splice(i, 1) } }); }
    });
    socket.on('getMessagesPromise', function(data){
            //console.log('on promise 4 users')
            if(data.messages){
                msgPromiseCb(data.messages)    
            }
    });
    
     var msgPromiseMain = function(cb){
        msgCbPromise = cb;
    };
    
    var msgCbPromise;
    
    var msgPromiseCb = function(msgs){
        msgCbPromise(msgs)
    };
    
    return { promise: promiseMain, join: joinChat, getRooms: getRooms, createRoom: createRoom, deleteRoom: deleteRoom, editRoom: editRoom, getUsers: getUsers, leave: leaveChat, send: sendMessage, incoming: messageMain, users: chatRoomUsers, getMessages: getMessages, msgPromise: msgPromiseMain };
});