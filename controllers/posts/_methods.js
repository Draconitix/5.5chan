var exp = module.exports = {};
var create = require('./create');
var list = require('./list');
var remove = require('./remove');  
var update = require('./update');

exp.exec = function(method, data, query, user, cb){
            switch(method){
                case 'list':
                    list.main(query, cb);
                    break;
                case 'create':
                    create.main(data, user, cb);
                    break;    
                case 'remove':
                    remove.main(data, user, cb);
                    break;
                case 'update':
                    update.main(data, query, user, cb);
                    break;    
                default: 
                    cb(400, 'Unknown Method.');
            }     
};