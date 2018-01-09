var mongoose = require('mongoose');
var colors = require('colors');
require('dotenv').config();

    mongoose.connect(process.env.DB_URI);
    var db = mongoose.connection;
    db.on('error', function(err){
        console.log(colors.red("###") + " " + err + " " + colors.red("###"));
    });
    db.once('open', function(){
        console.log(colors.green('Connected to mongodb server ') + "@ " + colors.blue(process.env.DB_URI));
    });
module.exports = db;