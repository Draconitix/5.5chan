var exp = module.exports = {};
var login = require('./login');
var register = require('./register'),
update = require('./update'),
list = require('./list'),
remove = require('./remove');    

exp.exec = function(method, data, httpMethod, query, file, user, cb){
            switch(method){
                case 'list':
                    list.main(query, httpMethod, cb);
                    break;
                case 'update':
                    update.main(data, user, httpMethod, file, cb);
                    break;
                case 'login':
                    login.main(data, httpMethod, cb);
                    break;
                case 'register':
                    register.main(data, httpMethod, file, cb);
                    break;    
                case 'remove':
                    remove.main(user, httpMethod, cb);
                    break;
                default: 
                    cb(400, 'Unknown Method.');
            }     
};