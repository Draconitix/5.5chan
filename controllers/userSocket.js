var io = require('../config/socketIO').io;
var colors = require('colors');
io.on('connection', function(socket){
    socket.on('login', function(data){
        socket.handshake.session.user = data.user;
        socket.handshake.session.save();
        console.log('user data saved');
    });
    socket.on('logout', function(user){
        socket.handshake.session.user = undefined;
        socket.handshake.session.save();
    });
});

