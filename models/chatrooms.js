var mongo = require('mongoose'),
Schema = mongo.Schema;

var chatroomSchema = new Schema({
    name: String,
    private: Boolean,
    users: Array,
    user: String
});

var chatroom = mongo.model('chatrooms', chatroomSchema);

module.exports = chatroom;