app.service('interface', function($cookies, $http, $q, jwtHelper, messageParser){
    var token = $cookies.get('accessToken');
    var user = jwtHelper.decodeToken(token);
    var socket = io.connect('', {
        'query': 'token=' + token
    });
    
    // Messaging methods
    
    var sendMessage = function(text){
        var parts = messageParser(text);
        socket.emit('sendMessage', { parts: parts, user: user.username });
    }
    
    // Messaging callback
    
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
    
    // Error handling
    
    var errorMain = function(cb){
        cbErr = cb;
    };
    
    var cbErr;
    
    var errorCb = function(err){
        cbErr(err)
    };
    
    socket.on('chatPromise', function(data){
        if(data.error){
            errorCb(data.error);
        } else {
            $cookies.put('chatroom', data.name);
            errorCb();
        }
    });
    
    socket.on('postRoom', function(data){
        errorCb('update');
    });
    
    return { promise: errorMain, join: joinChat, getRooms: getRooms, createRoom: createRoom, deleteRoom: deleteRoom, editRoom: editRoom, getUsers: getUsers, leave: leaveChat, send: sendMessage, incoming: messageMain };
});