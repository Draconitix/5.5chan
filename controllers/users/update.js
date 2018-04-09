var exp = module.exports = {};
var db = require('../../models/functions/dbMethods'),
jwt = require('jsonwebtoken'),
img = require('../assets/create'),
sfs = require('../../models/functions/$sfs'),    
validator = require('./$validator');
require('dotenv');


// Query is data from jsonwebtoken
exp.main = function(data, query, httpMethod, file, cb){
    if(httpMethod == "PUT"){
        var vResult = validator(data);
        var q = { username: query.username, email: query.email, desc: query.desc };
        //var d = { firstname: data.firstname, lastname: data.lastname, username: data.username, email: data.email, desc: data.desc };
        var imgCall = function(stat, response){
            console.log(response)
        };
        var mainCall = function(stat, response){
            //console.log(query.username);
            //console.log(data.username);
            console.log(response);
            if(stat == 200){
                if(file != undefined){
                    img.main(file, data.username, 'profile', 'POST', imgCall);   
                }
                jwt.sign(data, process.env.JWT_SECRET, function(err, token){
                    cb(200, { token: token });
                });
            } else {
                cb(stat, response);
            }
        }
        if(vResult.flags > 0) { 
            cb(400, vResult.errors);
        } else if(JSON.stringify(q) === JSON.stringify(data) && typeof file === "undefined"){
            cb(400, 'No change made to user.')      
        } else {
            db.put('user', { username: query.username }, data, mainCall);
            db.put('assets', { user: query.username }, { user: data.username }, imgCall);
        } 
    } else {
        cb(400, 'Unknown Method.')
    }
}