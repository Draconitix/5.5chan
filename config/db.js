var mongoose = require('mongoose');
var colors = require('colors');
require('dotenv').config();

    mongoose.connect(process.env.DB_URI);
    var db = mongoose.connection;
    db.on('error', function(err){
        console.log(colors.red(err));
    });
    db.once('open', function(){
        console.log('Connected to mongodb server.'.rainbow);
    });
module.exports = db;