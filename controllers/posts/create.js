var exp = module.exports = {};
db = require('../../models/functions/dbMethods');

exp.main = function(data, user, httpMethod, cb){
  if(httpMethod == "POST"){
    if(typeof data == "object"){
    var mainCall = function(stat, response){
        if(stat == 200){
             cb(200, response);
        } else {
             cb(stat, response);
        }
    };
    // user parameter is user.username passes as string
    data.user = user;
    data.sentAt = Date.now();
    db.post('posts', data, mainCall);
    } else {
         cb(400, 'No data given');
    }
  } else {
      cb(400, 'Unknown method.')
  }
};