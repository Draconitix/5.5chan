app.service('userSocket', function($cookies, $http, $q, jwtHelper){
    var token = $cookies.get('accessToken');
    var user = jwtHelper.decodeToken(token);
    var socket = io.connect('', {
        'query': 'token=' + token
    });
    
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
        console.log(roomData)
        var deferred = $q.defer();
        $http({ method: 'POST', url: 'chat/chatroom/create', headers: { 'Authorization': 'Bearer ' + token}, data: roomData }).then(function(res){
            deferred.resolve(res.data)
            socket.emit('postRoom', res.data);
        }, function(err){
            deferred.reject(err)
        });
        return deferred.promise;
    }
    
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
        errorCb();
    });
    
    return { promise: errorMain, join: joinChat, getRooms: getRooms, createRoom: createRoom, getUsers: getUsers, leave: leaveChat };
});