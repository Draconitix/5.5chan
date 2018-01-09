var express = require('express');
var colors = require('colors');
var tokenAuth = require('./middleware/tokenAuth');
var router = express.Router();
var user = require('../controllers/users/_route');
var asset = require('../controllers/assets/_route');
var chatroom = require('../controllers/chatrooms/_route');

/* JWT Auth Middleware */

router.param('function', tokenAuth.main);

/* User Api Routes */

router.get('/user/:function/', user.main);

router.put('/user/:function/', user.main);

router.post('/user/:function/', user.main);

router.delete('/user/:function/', user.main);

/* Asset Api Routes */

router.get('/asset/:function/', asset.main);

router.put('/asset/:function/', asset.main);

router.post('/asset/:function/', asset.main);

router.delete('/asset/:function/', asset.main);

/* Chatroom Api Routes */

router.get('/chatroom/:function/', chatroom.main);

router.put('/chatroom/:function/', chatroom.main);

router.post('/chatroom/:function/', chatroom.main);

router.delete('/chatroom/:function/', chatroom.main);


module.exports = router;