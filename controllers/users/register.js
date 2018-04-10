var exp = module.exports = {};
var jwt = require('jsonwebtoken'),
img = require('../assets/create'),  
validator = require('./$validator'),    
db = require('../../models/functions/dbMethods');
require('dotenv');

exp.main = function(data, httpMethod, file, cb){
    if(httpMethod == "POST"){
        var vResult = validator(data);
        var imgCall = function(stat, response){
            return { status: stat, response: response };
        };
        var mainCall = function(stat, response){
            if(stat == 200){
                if(file != undefined){
                    img.main(file, response.username, 'profile', httpMethod, imgCall);   
                }
                jwt.sign(response.toJSON(), process.env.JWT_SECRET, function(err, token){
                    cb(200, { token: token });
                });
            } else {
                cb(stat, response);
            }
        }
        var usernameTaken = function(stat, response){
            if(stat == 200){
                if(response != undefined && response.length > 0){ 
                    if(data.username == response[0].username){
                        cb(400, ['Username is already taken.']);
                    } else if(data.email == response[0].email){
                        cb(400, ['Email is already taken.']);
                    }
                } else {
                    db.post('user', data, mainCall);    
                }
            } else {
                cb(stat, response)
            }
        };
        if(vResult.flags > 0) { 
            cb(400, vResult.errors);
        } else {
            db.get('user', { username: data.username }, false, usernameTaken);
        } 
    } else {
        cb(400, 'Unknown Method.')
    }
};