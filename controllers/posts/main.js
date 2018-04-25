var io = require('../../config/socket_io').io;
var chatListMain = require('../chatrooms/list').main;

io.on('connection', function(socket){
    //console.log(socket)
    var cb = function(stat, response){
        if(stat == 200){
            chatList = JSON.stringify(response);
            console.log(response);
        } else {
            return [];
        }    
    };
    chatListMain({}, 'GET', cb);
    var chatList;
    var joinedChat;
    socket.on('chatJoin', function(data){
        if(data.chatroom != undefined && data.user != undefined){
            var chatrooms = JSON.parse(chatList);
            var chatExistsFunc = function(){
                var exists = false;
                var index = 0;
                for(var i = 0; i < chatrooms.length; i++){
                    if(chatrooms[i].name === data.chatroom){
                        exists = true;
                        index = i;
                    }
                }
                return { exists: exists, index: index };
            };
            var check = chatExistsFunc();
            var i = check.index;
            if(check.exists == true){
               if(chatrooms[i].private == false){
                  socket.join(data.chatroom);
                  joinedChat = data.chatroom;
                  socket.emit('chatPromise', { name: data.chatroom });   
                  console.log('Joined Chat')
               } else {
                  var pCheck = chatrooms[i].users.indexOf(data.user);       
                  if(pCheck != -1){
                      socket.join(data.chatroom);
                      console.log('Joined Chat')
                      joinedChat = data.chatroom; 
                      socket.emit('chatPromise', { name: data.chatroom });
                  } else {
                      socket.emit('chatPromise', { error: 'You are not in this private chat.' });
                  }   
               }
           } else {
                socket.emit('chatPromise', { error: 'Chatroom does not exist.' });   
           }   
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
});