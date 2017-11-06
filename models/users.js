var mongo = require('mongoose'),  
Schema = mongo.Schema;    

/* Schemas *** var schemaName = new Schema({ propertyName: valueType(ie. String) }); *** */

var userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    uploadsPath: String,
    desc: String,
    admin: Boolean
});

/* Models *** var modelName = mongo.model('collectionName', schemaVarName); *** */ 

var User = mongo.model('users', userSchema);

module.exports = User;