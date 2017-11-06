var exports = module.exports = {};
exports.get = require('./http/get').main;
exports.post = require('./http/post').main;
exports.put = require('./http/put').main;
exports.delete = require('./http/delete').main;