var exports = module.exports = {};
exports.main = function(res){
    var arr = res.split(','), mime = arr[0].match(/:(.*?);/)[1];
    var spl = res.split(';base64,'), data = spl[1];
    var extSplit = mime.split('/'), ext = extSplit[1];
    return { data: data, mime: mime, ext: ext }
};