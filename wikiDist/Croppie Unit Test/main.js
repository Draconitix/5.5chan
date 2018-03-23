var ele = document.getElementById('resizer');
var resize = new Croppie(ele, {
    viewport: { width: 400, height: 400 },
    boundary: { width: 500, height: 500 },
    showZoomer: true,
    enableResize: false,
    enforceOrientation: true
});

resize.bind({ url: 'http://localhost:3000/14fee91a451b66fe1838977392f8e8bf9f188e62453522edd737afeebf4c60f8/scaled.jpg',
points: [0, 0, 10, 10]
});

var exec = function(){
    resize.result({ width: 300}).then(function(res){
        var arr = res.split(','), mime = arr[0].match(/:(.*?);/)[1];
        var spl = res.split(';base64,'), data = spl[1];
        var extSplit = mime.split('/'), ext = extSplit[1];
        var blb = getBlob(data, mime);
        var file = new File([blb], "crop." + ext, { type: mime })
        console.log(file);
    })
};





// b64 to blob 

var getBlob = function (b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = window.atob(b64Data);
  //console.log(byteCharacters);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);
    //console.log(byteArray)
    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}