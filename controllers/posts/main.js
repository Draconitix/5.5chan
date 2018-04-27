var io = require('../../config/socket_io').io;
var chatListMain = require('../chatrooms/list').main;

io.on('connection', function(socket){
    var chatroom;
    var joinedChat;
    socket.on('chatJoin', function(data){
        if(data.chatroom != undefined && data.user != undefined){
            var cJ = function(stat, response){
                if(stat == 200){
                        chatroom = response[0];
                        var chatExistsFunc = function(){
                            if(typeof chatroom == 'object'){
                                return true;
                            } else {
                                return false;
                            }
                        };
                        var check = chatExistsFunc();
                        if(check == true){
                           if(chatroom.private == false){
                              socket.join(data.chatroom);
                              joinedChat = data.chatroom;
                              socket.emit('chatPromise', { name: data.chatroom });   
                           } else {
                              var pCheck = chatroom.users.indexOf(data.user);       
                              if(pCheck != -1){
                                  socket.join(data.chatroom);
                                  joinedChat = data.chatroom; 
                                  socket.emit('chatPromise', { name: data.chatroom });
                              } else {
                                  socket.emit('chatPromise', { error: 'You are not in this private chat.' });
                              }   
                           }
                       } else {
                            socket.emit('chatPromise', { error: 'Chatroom does not exist.' });   
                       }   
                }    
            }
            chatListMain({ name: data.chatroom }, 'GET', cJ);
        } else {
            socket.emit('chatPromise', { error: 'No user or chatroom given.' }); 
        }
    });
    socket.on('chatLeave', function(data){
        socket.leave(data.chatroom);
        joinedChat = undefined; 
    })
    socket.on('sendMessage', function(data){
        socket.broadcast.to(joinedChat).emit('message', { parts: data.parts, user: data.user });
    });
    socket.on('postRoom', function(data){
        socket.broadcast.emit('postRoom', data);
    })
});