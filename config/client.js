// var io = require('../config/socketIO').io;
var redis = require('redis');
var client = redis.createClient();
var colors = require('colors');

module.exports = { client: client };

// console.log(io);

// setInterval(function(){ console.log(io) }, 1000);

/*io.on('connection', function(socket){
    socket.on('login', function(data){
        socket.handshake.session.user = data.user;
        socket.handshake.session.save();
        console.log('User data saved'.green);
    });
    socket.on('logout', function(user){
        socket.handshake.session.user = undefined;
        socket.handshake.session.save();
    });
});*/