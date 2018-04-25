var exp = module.exports = {};
db = require('../../models/functions/dbMethods');

exp.main = function(data, user, httpMethod, cb){
    if(httpMethod === "POST"){
        var mainCall = function(stat, response){
            if(stat == 200){
                 cb(200, response);
            } else {
                 cb(stat, response);
            }
        };
        // user parameter is user.username passes as string
        data.user = user;
		if(data.name.length < 4){
			cb(400, 'No name sent');
		} else {
			db.post('chat', data, mainCall);
		}
    } else {
         cb(400, 'Unknown Method.');
    }
};