var exports = module.exports = {};
var db = require('../../../models/functions/dbMethods'),
sha256 = require('js-sha256'),
fs = require('fs'),
rString = require('randomstring'),
im = require('imagemagick'),
rimraf = require('rimraf'),    
colors = require('colors');
require('../../userSocket');

// What httpMethods can we use?

exports.httpMethods = { get: { bool: true, specialOnly: false }, post: { bool: true, specialOnly: true }, put: { bool: false, specialOnly: false }, del: { bool: true, specialOnly: true } };

var req = null,
res = null,
query = null,
data = null,
bools = {},
defCall = function(err, docs){
        if(err) throw err;
        res.end(JSON.stringify(docs));
},
returnData = function(err, docs){
    if(err) throw err;
    return docs;
    console.log(docs + ' DOCS')
},
imageDupes = function(src, dest, ext){
    //Make sure dest is just the folder not the file
    im.identify(['-format', '%wx%h', src], function(err, output){
        if(err) throw err;
        bools.scaled = false;
        bools.thumb = false;
        bools.default = false;
        var iWidth = output.split('x')[0];
        var h = output.split('x')[1];
        var ratio = iWidth / h; 
        var thumbImg = { height: 256 / ratio, width: 256 };
        var defaultImg = { height: 512 / ratio, width: 512 };
        var scaledImg = { height: 1024 / ratio, width: 1024 };
        if(iWidth >= 512){
             bools.scaled = true;
            im.resize({ srcPath: src, dstPath: dest + 'scaled' + '.' + ext, width: scaledImg.width, height: scaledImg.height }, function(err, stdout, stderr){
                if(err) throw err;
               
            });
        } if(iWidth >= 256){
             bools.default = true;
            im.resize({ srcPath: src, dstPath: dest + 'default' + '.' + ext, width: defaultImg.width, height: defaultImg.height }, function(err, stdout, stderr){
                if(err) throw err;
               
            });      
        } if(iWidth >= 128){
            bools.thumb = true;
           im.resize({ srcPath: src, dstPath: dest + 'thumb' + '.' + ext, width: thumbImg.width, height: thumbImg.height }, function(err, stdout, stderr){
                if(err) throw err;
            }); 
        }
    });
};    

exports.clientReqVars = function(reqP, resP, dataP){
    req = reqP;
    res = resP;
    query = dataP;
};

exports.upload = function(){
    if(req.session.user == undefined){
        res.status(401);
        res.send('You are not logged in.');
    } else if(/(\.jpg|\.JPG|\.JPEG|\.jpeg|\.png|\.PNG|\.gif|\.GIF)$/g.test(req.file.filename) == false){
        res.status(400);
        res.send('File must be a img file.');
    } else {
        // Init Paths
        var randomVal = rString.generate();
        var File = {
            tmpPath: req.file.path,
            origName: req.file.originalname,
            newDir: function(){ return req.session.user.uploadsPath + '/' + randomVal; },
            name: req.file.filename,
            dirName: function(){ return this.newDir() + '/'; },
            user: req.session.user.username,
            type: req.body.uploadType,
            extension: req.file.mimetype.split("/")[1]
        };
        var uploadCall = function(err, docs){
            if(docs.length == 0){
            fs.mkdirSync(File.newDir());
            // Read Streams
            var rs = fs.createReadStream(File.tmpPath);
            rs.on('error', function(err){
                console.error(err);
            });
            var ws = fs.createWriteStream(File.dirName() + File.name);
            ws.on('error', function(err){
                console.error(err);
            });
            rs.pipe(ws);
            ws.on('finish', function(){
                imageDupes(File.tmpPath, File.dirName(), File.extension);
                var obj = { originalname: File.origName, dirName: File.dirName(), user: File.user, type: File.type, extension: File.extension, thumb: bools.thumb, default: bools.default, scaled: bools.scaled };
                var callB = function(err, docs){
                        if(err) throw err;
                        var spl = File.dirName().split('./dist');
                        res.end(spl[1] + 'default' + '.' + File.extension);
                        /*fs.unlink(File.tmpPath, function(err){
                            if(err) throw err;
                        });*/
                };
                db.post('assets', obj, callB);
            });
            } else {
                var spl = docs[0].dirName.split('./dist');
                res.send(spl[1] + 'default' + '.' + docs[0].extension);
                console.log('File already exists!'.green);
            }
        }
        db.get('assets', { originalname: req.file.originalname }, uploadCall);
        // File Operations
    }
};

exports.remove = function(){
    if(req.session.user == undefined){
        res.status(401);
        res.send('You are not logged in.');
    } else {
        var data = db.get('assets', { dirName: req.body.dirName }, returnData);
        if(data.user == req.session.user.username){
            rimraf(data.dirName, function(err){
                if(err) throw err;
                res.send('File successfully deleted.');
            });
        } else {
            res.status(401);
            res.send('You do not have permissions to delete this file.')
        }
    }
};