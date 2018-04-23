var exp = module.exports = {};
var create = require('./create');
var list = require('./list');
var remove = require('./remove');    
var crop = require('./crop');
var update = require('./editProfile');

exp.exec = function(method, data, httpMethod, query, file, user, cb){
            switch(method){
                case 'lst':
                    list.main(query, httpMethod, cb);
                    break;
                case 'create':
                    create.main(file, user.username, 'gallery', httpMethod, cb);
                    break;    
                case 'remove':
                    remove.main(data, user.username, httpMethod, cb);
                    break;
                case 'crop':
                    crop.main(data, httpMethod, cb);
                    break;
                case 'update':
                    update.main(data, user, httpMethod, cb);
                    break;
                default: 
                    cb(400, 'Unknown Method.');
            }     
};