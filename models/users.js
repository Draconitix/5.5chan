var mongo = require('mongoose'),  
Schema = mongo.Schema;    

/* Schemas *** var schemaName = new Schema({ propertyName: valueType(ie. String) }); *** */

var userSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    email: String,
    desc: String,
});

/* Models *** var modelName = mongo.model('collectionName', schemaVarName); *** */ 

var User = mongo.model('users', userSchema);

module.exports = User;