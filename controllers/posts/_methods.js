var exp = module.exports = {};
var create = require('./create');
var list = require('./list');
var remove = require('./remove');  
var update = require('./update');

exp.exec = function(method, data, query, user, httpMethod, cb){
            switch(method){
                case 'list':
                    list.main(query, httpMethod, cb);
                    break;
                case 'create':
                    create.main(data, user.username, httpMethod, cb);
                    break;    
                case 'remove':
                    remove.main(query, user.username, httpMethod, cb);
                    break;
                case 'update':
                    update.main(data, query, user.username, httpMethod, cb);
                    break;    
                default: 
                    cb(400, 'Unknown Method.');
            }     
};