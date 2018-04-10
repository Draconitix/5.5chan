var exp = module.exports = {};
var gm = require('gm'),
fs = require('fs'),
path = require('path'),
sha256 = require('js-sha256'),
b64 = require('base64-img'),
imgProps = require('./$base64'),    
db = require('../../models/functions/dbMethods');
var randomString = require('randomstring');    
var colors = require('colors');

exp.main = function(data, httpMethod, cb){
    if(httpMethod == "POST"){
        var saveImg = function(stat, response){
            var img = imgProps.main(data.data);
            b64.imgSync(data.data, 'public/uploads/' + response[0].uri, 'cropped');
        }
        var mainCall = function(stat, response){
            if(stat == 200){
                db.get('assets', { user: data.user, location: 'profile' }, false, saveImg);
                cb(200, response);
            } else {
                cb(stat, response);
            }
        };
        if(data.data != undefined){
           db.put('assets', { user: data.user, location: 'profile' }, { cropped: true }, mainCall); 
        } else {
           cb(400, 'Query must not contain sensitive information.')
        }
    } else {
        cb(400, 'Unknown Method.');
    }
}