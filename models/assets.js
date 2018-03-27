var mongo = require('mongoose'),  
Schema = mongo.Schema;    

/* Schemas *** var schemaName = new Schema({ propertyName: valueType(ie. String) }); *** */

var assetsSchema = new Schema({
    filename: String,
    uri: String,
    user: String,
    type: String,
    location: String,
    thumb: Boolean,
    default: Boolean,
    scaled: Boolean,
    cropped: Boolean
});

/* Models *** var modelName = mongo.model('collectionName', schemaVarName); *** */ 

var assets = mongo.model('assets', assetsSchema);

module.exports = assets;