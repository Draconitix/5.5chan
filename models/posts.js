var mongo = require('mongoose'),
Schema = mongo.Schema;

var postSchema = new Schema({
    user: String,
    parts: Array,
    chatroom: String,
    text: String,
    sentAt: Number
});

var post = mongo.model('posts', postSchema);

module.exports = post;