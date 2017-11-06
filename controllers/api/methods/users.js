var exports = module.exports = {};
db = require('../../../models/functions/dbMethods'),
sha256 = require('js-sha256'),
fs = require('fs'),
rString = require('randomstring'),
colors = require('colors');
require('../../userSocket');

// What httpMethods can we use?

exports.httpMethods = { get: { bool: true, specialOnly: false }, post: { bool: true, specialOnly: true }, put: { bool: true, specialOnly: false }, del: { bool: true, specialOnly: true }};

var req = null,
res = null,
query = null,
data = null,
defCall = function(err, docs){
        if(err) throw err;
        res.send(docs);
};

exports.clientReqVars = function(reqP, resP, dataP){
    req = reqP;
    res = resP;
    query = dataP;
};

exports.userList = function(){
    db.get('user', query, defCall);
}


exports.login = function(){
    console.log(req.session);
    if(req.session.user != null){
        res.status(401);
        res.end('You are already logged in.');
    } else {
        var callback = function(err, docs){
            if(err) throw err;
                if (docs == null || typeof docs === "undefined"){
                    res.status(404);
                    res.end("{ loggedIn: false }");     
                } else {
                    req.session.user = docs[0];
                    req.session.save();
                    res.end(JSON.stringify({ username: docs[0].username, email: docs[0].email, desc: docs[0].desc, loggedIn: true }));
                }
        };
        db.get('user', query, callback);
    }
};

exports.logout = function(){
    if(req.session.user != undefined){
        req.session.destroy();
        res.status(200);
        res.send("User has been succesfully logged out.");
    } else if(req.session.user == undefined) {
        res.status(404);
        res.send('You are not logged in.');
    }
};

exports.getSession = function(){
    if(req.session.user != undefined){
        var x = req.session.user;
        res.status(200); 
        res.end(JSON.stringify({ username: x.username, email: x.email, desc: x.desc, loggedIn: true }));
    } else {
        res.status(404);
        res.end(JSON.stringify({ loggedIn: false }));
    }
};

exports.register = function(){
    var callback = function(err, user){
                    if(err) throw err;    
                    res.send(JSON.stringify({ username: user.username, email: user.email, desc: user.desc, loggedIn: true }));
    };
    if(req.session.user != undefined){
        res.status(401);
        res.send('You are already logged in.');
    } else {
        req.checkBody('username', 'Username field can not be empty').notEmpty();
        req.checkBody('username', 'Username must be 4-15 characters long.').len(4,15);
        req.checkBody('password', 'Password must be 8-100 characters long.').len(8,100);
        /* req.checkBody('password', 'Password must have one uppercase character, one lowercase character, a digit, and a special character.').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/g); */
        req.checkBody('email', 'The email you entered is invalid').isEmail();
        req.checkBody('email', 'Email address must be 4-100 characters long').len(4, 100);
        req.checkBody('desc', 'Description must be 5-30 characters long.').len(5,30);

        var vErrors = req.validationErrors();

        if(vErrors !== false){
           res.status(400);
           res.send(JSON.stringify(vErrors));
        } else {
           var random = sha256(rString.generate()); 
           var path = './dist/uploads/' + random;
           fs.mkdir(path);
           query.uploadsPath = path;    
           db.post('user', query, callback); 
        }    
    }  
};

exports.deleteUser = function(){
    if(req.session.user == undefined){
        res.status(401);
        return res.send('You are not logged in.');
    } else {
        req.session.destroy();
        var callback = function(err, docs){
            if(err) throw err;
            res.send('User has been successfully deleted.');    
        }
        if(typeof query === "object" && query != {} && query != null){
            db.delete('user', query, callback);    
        } else {
            res.status(400);
            return res.send('Nothing specific to delete.');
        }
    }
};

exports.upload = function(){
    if(req.session.user == undefined){
        res.status(401);
        res.send('You are not logged in.');
    } else if(/(\.jpg|\.JPG|\.JPEG|\.jpeg|\.png|\.PNG|\.gif|\.GIF)$/g.test(req.file.filename) == false){
        res.status(400);
        res.send('File must be a img file.');
    } else {
        console.log(req.body.uploadType);
        var tmpPath = req.file.path;
        var userTargetPath = req.session.user.uploadsPath +  '/' + req.file.filename;
        var targetPath = 'dist/media/' + req.file.filename;
        var rs = fs.createReadStream(tmpPath);
        rs.on('error', function(err){
            done(err);
        });
        var ws = fs.createWriteStream(targetPath);
        ws.on('error', function(err){
            done(err);
        });
        rs.pipe(ws);
        if(req.body.uploadType == 'profileImg'){
            var split = req.file.filename.split('.');
            var extension =  '.' + split[split.length - 1];
            userTargetPath = req.session.user.uploadsPath +  '/' + '_profile' + extension;
            var uws = fs.createWriteStream(userTargetPath);
            uws.on('error', function(err){
                done(err);
            });
            rs.pipe(uws);
        } else {
            var uws = fs.createWriteStream(userTargetPath);
            uws.on('error', function(err){
                done(err);
            });
            rs.pipe(uws);
        }
        fs.unlink(tmpPath, function(err){
            if(err) throw err;
            res.send('media/' + req.file.filename);
        })
    }
};