var io = require('socket.io')();
var ioJWT = require('socketio-jwt-auth');
require('dotenv').config();

io.use(ioJWT.authenticate({
  secret: process.env.JWT_SECRET
}, function(payload, done){
    done(null, payload);
}));

module.exports = { io: io };