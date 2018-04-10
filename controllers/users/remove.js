var exp = module.exports = {};
var db = require('../../models/functions/dbMethods');
var imgRemove = require('../assets/remove');
var rimraf = require('rimraf');

exp.main = function(user, httpMethod, cb){
    if(httpMethod == "DELETE"){
        var mainCall = function(stat, response){
            //console.log(response);
            if(stat == 200){
                var imgCall = function(stat, iresponse){
                    //console.log(iresponse)
                    var ic = function(stat, mresponse){
                        //console.log(mresponse);
                        
                        cb(200, response);
                    }
                    if(typeof iresponse === "array" && iresponse.length > 0){
                        rimraf('public/uploads/' + iresponse[0].uri, function(err){
                                if(err) { console.log(err) };
                        })       
                    } 
                    db.delete('assets', { location: 'profile', user: user.username }, ic);
                    
                };
                db.get('assets', { location: 'profile', user: user.username }, false, imgCall)
            } else {
                cb(404, 'User not found.');
            }
        }
        db.delete('user', { username: user.username }, mainCall);
    } else {
        cb(400, 'Unknown Method.')
    }
};