var exp = module.exports = {};
var gm = require('gm'),
fs = require('fs'),
path = require('path'),
sha256 = require('js-sha256'),
db = require('../../models/functions/dbMethods');
var randomString = require('randomstring');    
var colors = require('colors');
var Asset = {};
var checkExtension = function(extension){
    var ext = extension.toLowerCase();
    var flags = 0;
    var errs = [];
    switch(ext){
        case 'jpeg':
            
            break;
        case 'jpg':
            
            break;
        case 'png':
            
            break;
        case 'gif':
            
            break;
        default:
            flags++;
            errs.push('File must be a jpeg, jpg, png, or gif image.');
    };
    return { flags: flags, errors: errs };
};

var imageDupes = function(src, dest, ext, asset, cb){
    //Make sure dest is just the folder not the file
    
    gm(src).size(function(err, size){
        if(err) throw err;
        var iWidth = size.width;
        var h = size.height;
        var ratio = iWidth / h; 
        var thumbImg = { height: 256 / ratio, width: 256 };
        var defaultImg = { height: 512 / ratio, width: 512 };
        var scaledImg = { height: 1024 / ratio, width: 1024 };
        if(iWidth >= 512){
            asset.scaled = true;
             gm(src).resizeExact(scaledImg.width, scaledImg.height).write(dest + 'scaled' + '.' + ext, function(err){ if(err) throw err; });
             /*im.resize({ srcPath: src, dstPath: dest + 'scaled' + '.' + ext, width: scaledImg.width, height: scaledImg.height }, function(err, stdout, stderr){
                if(err) throw err;
               
             });*/
        } if(iWidth >= 256){
            asset.default = true;
             gm(src).resizeExact(defaultImg.width, defaultImg.height).write(dest + 'default' + '.' + ext, function(err){ if(err) throw err; });
             /*im.resize({ srcPath: src, dstPath: dest + 'default' + '.' + ext, width: defaultImg.width, height: defaultImg.height }, function(err, stdout, stderr){
                if(err) throw err;
               
             });*/      
        } if(iWidth >= 128){
            asset.thumb = true;
            gm(src).resizeExact(thumbImg.width, thumbImg.height).write(dest + 'thumb' + '.' + ext, function(err){ if(err) throw err; });
            /*im.resize({ srcPath: src, dstPath: dest + 'thumb' + '.' + ext, width: thumbImg.width, height: thumbImg.height }, function(err, stdout, stderr){
                if(err) throw err;
            });*/ 
        }
        cb();
    });
};  

/*var loop = function(user, location, httpMethod, cb){
    if(currentFile != fileArray.length){
        currentFile++;
    	main(fileArray[currentFile - 1].originalname, fileArray[currentFile - 1].buffer, user, location, httpMethod, cb);
  }  else {
      //console.log('done')
  }
};*/

exp.main = function(file, user, location, httpMethod, cb){
    main(file.originalname, file.buffer, user, location, httpMethod, cb);
}

var main = function(originalName, buffer, user, location, httpMethod, cb){
    if(httpMethod === "POST"){
        var split = originalName.split(".");
        var extension = split[split.length - 1];
        var check = checkExtension(extension);
        var rVal = sha256(randomString.generate());
        Asset.filename = originalName;
        Asset.uri = rVal + '/';
        Asset.user = user;
        Asset.type = extension;
        Asset.location = location;
        //console.log(colors.green(JSON.stringify(Asset)));
        var putCall = function(stat, response){
            if(stat == 200){
                db.post('assets', Asset, cb);    
            } else {
                cb(stat, response);
            }
        }
        if(check.flags == 0){
            var fileExistCall = function(stat, response){
                if(stat == 200 && response.length == 0){
                    fs.mkdirSync('public/uploads/' + Asset.uri);
                    var src = 'public/uploads/' + Asset.uri + 'original.'  + extension;
                    fs.writeFile(src, buffer, function(err){
                        if(err) {
                            cb(400, err);
                        } else {
                            var onComplete = function(){
                                if(location == 'profile'){
                                    db.put('assets', { user: user, location: 'profile'}, { location: 'gallery' }, putCall);    
                                } else {
                                    //console.log(colors.green(JSON.stringify(Asset)) + '\n');
                                    var mainCall = function(stat, response){
                                        if(stat == 200){
                                            cb(200, response)
                                        } else {
                                            cb(stat, response)
                                        }
                                    };
                                    db.post('assets', Asset, mainCall);
                                }
                            };
                            imageDupes(src, 'public/uploads/' + Asset.uri, extension, Asset, onComplete);
                        }
                    });    
                } else {
                    cb(403, "File already exists");
                }
            }
            db.get('assets', { filename: Asset.filename, user: Asset.user, location: Asset.location }, false, fileExistCall);
        } else {
            cb(400, check.errors);
        };
    } else {
        cb(400, 'Unknown Method.');
    }
};