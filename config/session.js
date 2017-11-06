require('dotenv').config();
var client = require('./client').client;
var expressSession = require('express-session');
var redisStore = require('connect-redis')(expressSession);
var session = expressSession({secret: process.env.SESSION_KEY, resave: false, saveUninitialized: false, store: new redisStore({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, client: client, name: 'id' }) });

module.exports = { session: session }