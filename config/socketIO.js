require('dotenv').config();
var session = require('./session').session;
var socketSession = require('express-socket.io-session');
var colors = require('colors');

var io = require('socket.io')();

io.use(socketSession(session));

var ioEmitter = require('socket.io-emitter')({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });
// Logging

ioEmitter.redis.on('connect', function(err){
    if (err) throw err;
    console.log('Connected to Redis Server @%s:%s. \n'.green, process.env.REDIS_HOST, process.env.REDIS_PORT);
});

ioEmitter.redis.on('error', function(err){
    console.log(colors.red(err) + '\n');
});
    
module.exports = { ioEmitter: ioEmitter, io: io };