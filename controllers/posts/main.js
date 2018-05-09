var io = require('../../config/socket_io').io;
var chatListMain = require('../chatrooms/list').main;
var methods = require('./_methods').exec;

io.on('connection', function(socket){
    //console.log(socket.request.user.username);
    var chatroom;
    var joinedChat;
    var getUsers = function(){
        var cl = io.sockets.adapter.rooms[joinedChat].sockets;
        var chatUserList = [];  
        for (var clientId in cl ) {
          //console.log('client: %s', clientId); //Seeing is believing 
          var client_socket = io.sockets.connected[clientId];//Do whatever you want with this
          var waitUntilAuth = function(){
            if(client_socket.request == undefined){
                waitUntilAuth();  
            } else {
                chatUserList.push(client_socket.request.user.username)
            }
          }
          waitUntilAuth();
        }
        return chatUserList;
    };
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
                              var chatUserList = getUsers();
                              socket.emit('chatPromise', { name: data.chatroom, users: chatUserList });
                              socket.broadcast.to(joinedChat).emit('roomUpdate', { addUser: true, user: socket.request.user.username })   
                           } else {
                              var pCheck = chatroom.users.indexOf(data.user);       
                              if(pCheck != -1){
                                  socket.join(data.chatroom);
                                  joinedChat = data.chatroom; 
                                  var chatUserList = getUsers();
                                  socket.emit('chatPromise', { name: data.chatroom, users: chatUserList });
                                  socket.broadcast.to(data.chatroom).emit('roomUpdate', { addUser: true, user: socket.request.user.username })
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
        socket.broadcast.to(joinedChat).emit('roomUpdate', { addUser: false, user: socket.request.user.username })
        socket.leave(data.chatroom); 
        joinedChat = undefined;
    })
    socket.on('sendMessage', function(data){
        socket.broadcast.to(joinedChat).emit('message', { parts: data.parts, user: socket.request.user.username, text: data.text, sentAt: data.sentAt, chatroom: joinedChat });    
    });
    socket.on('messageUpdate', function(data){
        console.log('msgUpdate  ' + JSON.stringify(data));
        if(data.method == "DELETE"){
            socket.broadcast.to(joinedChat).emit('messageDelete', { _id: data.msgId });
        } else if(data.method == "PUT"){
            console.log(data.text)
            socket.broadcast.to(joinedChat).emit('messageEdit', { _id: data.msgId, text: data.text, parts: data.parts });
        }
    });
    socket.on('postRoom', function(data){
        socket.broadcast.emit('postRoom', data);
    })
});