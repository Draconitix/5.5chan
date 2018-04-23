var exp = module.exports = {};
var db = require('../../models/functions/dbMethods'),
fs = require('fs'),
rimraf = require('rimraf');

exp.main = function(data, user, httpMethod, cb){
    if(httpMethod == "DELETE" && data.length != undefined){
        var currentFile = 0;
        var isArray = Array.isArray(data);
        var max = isArray ? data.length : 1;
        //console.log(max);
        var loop = function(){
            if(currentFile != max){
                if(Array.isArray(data) == true){
                    currentFile++;
                    exec(data[currentFile - 1]);
                } else {
                    currentFile++;
                    exec(data);
                }
            } else {
                currentFile = 0;
            }    
        };
        var exec = function(fileData){
            console.log(fileData);
            var mainCall = function(stat, response){
                //console.log(stat + ' ' + max);
                if(stat == 200){
                    if(response.n > 0){
                        rimraf('public/uploads/' + fileData.uri, function(err){
                            if(err) { console.log(err) };
                        })    
                    };
                    if(currentFile == max){ 
                        //console.log('done');
                        cb(200, response);
                    }
                    loop();
                } else {
                    cb(stat, response);
                } 
                //console.log(response.result);
            };
            fileData.user = user;
            db.delete('assets', fileData, mainCall);
         };
    loop();    
    } else if(data.length == undefined && typeof data === "object"){
        cb(403, "No query sent. Query = " + JSON.stringify(data))      
    } else {
        cb(400, 'Unknown method.');
        console.log(data.length + " " + JSON.stringify(data));
        console.log('fail')
    }
};