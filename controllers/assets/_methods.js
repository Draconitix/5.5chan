var exp = module.exports = {};
var create = require('./create');
var list = require('./list');
var remove = require('./remove');    
var crop = require('./crop');

exp.exec = function(method, data, httpMethod, query, files, user, cb){
            switch(method){
                case 'lst':
                    list.main(query, httpMethod, cb);
                    break;
                case 'create':
                    create.main(files, user.username, 'gallery', httpMethod, cb);
                    break;    
                case 'remove':
                    remove.main(data, user.username, httpMethod, cb);
                    break;
                case 'crop':
                    crop.main(data, httpMethod, cb);
                    break;
                default: 
                    cb(400, 'Unknown Method.');
            }     
};