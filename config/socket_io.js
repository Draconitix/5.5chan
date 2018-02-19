var io = require('socket.io')();
var ioJWT = require('socketio-jwt');
require('dotenv');

io.use(ioJWT.authorize({
  secret: process.env.JWT_SECRET,
  handshake: true
}));

module.exports = { io: io };