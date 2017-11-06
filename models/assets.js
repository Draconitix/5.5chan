var mongo = require('mongoose'),  
Schema = mongo.Schema;    

/* Schemas *** var schemaName = new Schema({ propertyName: valueType(ie. String) }); *** */

var assetsSchema = new Schema({
    originalname: String,
    dirName: String,
    user: String,
    type: String,
    extension: String,
    thumb: Boolean,
    default: Boolean,
    scaled: Boolean
});

/* Models *** var modelName = mongo.model('collectionName', schemaVarName); *** */ 

var assets = mongo.model('assets', assetsSchema);

module.exports = assets;