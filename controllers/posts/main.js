var io = require('../../config/socket_io').io;
var chatListMain = require('../chatrooms/list').main;

io.on('connection', function(socket){
    var cb = function(stat, response){
        if(stat == 200){
            return response;
        } else {
            return [];
        }    
    };
    var chatList = chatListMain({}, 'GET', cb);
    var joinedChat;
    socket.on('chatJoin', function(data){
         var check = chatList.indexOf(data.chatroom);
         if(check != -1){
           if(chatrooms[check].private == false){
              socket.join(data.chatroom);
              joinedChat = data.chatroom; 
           } else {
              var pCheck = chatrooms[check].users.indexOf(data.user);       
              if(pCheck != -1){
                  socket.join(data.chatroom);
                  joinedChat = data.chatroom; 
              } else {
                  socket.emit('chatError', { error: 'You are not in this private chat.' });
              }   
           }
       } else {
            socket.emit('chatError', { error: 'Chatroom does not exist.' });   
       }
    });
    socket.on('leaveChat', function(data){
        socket.leave(data.chatroom);
        joinedChat = undefined; 
    })
    socket.on('sendMessage', function(data){
        socket.broadcast.to(joinedChat).emit('message', { parts: data.parts, user: data.user });
    });
});