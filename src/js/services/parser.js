app.service("messageParser", function(){
var partsArray = [];
var main = function(text){
    partsArray = [];
    var partition = text.split(" ");
    console.log(partition)
    for(var i=0; i < partition.length; i++){
        parse(partition[i]);
        if(i == partition.length - 1){
            txt.add();
            return partsArray;
			partsArray = [];
        }
    }
};

// Plain text grouping

var txt = {
    group: [],
    add: function(){
        if(txt.group.length > 0){
            var fullText = txt.group[0];
            if(txt.group.length > 1){
                for(var i=1; i < txt.group.length; i++){
                    fullText = fullText.concat(" ", txt.group[i]);
                }
                partsArray.push({ type: 'text', text: fullText });
                txt.group = [];
            } else {
                partsArray.push({ type: 'text', text: fullText });
                txt.group = [];
            }
        }
    }
}

// Parse message

var parse = function(part){
    var match = /\r|\n/.exec(part);
    if(match != null){
        txt.add();
        var spl = part.split('\n');
        spl.map(function(e, i){
            if(e.length > 0){
                part = e;
            }
        });
    }
        
    if(/^(http:\/\/|https:\/\/)/g.test(part) == true){
        var imgSplit = part.split(".");
        var ext = imgSplit[imgSplit.length - 1].toLowerCase();
        if(/(www\.youtube\.com\/)/g.test(part)){
            txt.add();
   
			   if(part.indexOf("watch?v=") > -1){
				   var idSplit = part.split("watch?v=")
                   if(idSplit[1].indexOf('&') > -1){
                     var querySpl = idSplit[1].split('&');  
                     partsArray.push({ type: 'video', url: "https://www.youtube.com/embed/" + querySpl[0] });   
                   } else {
                     partsArray.push({ type: 'video', url: "https://www.youtube.com/embed/" + idSplit[1] });  
                   }
			   } else {
				   partsArray.push({ type: 'video', url: part });
				}
		} else if(/(jpg|jpeg|png|gif)/g.test(part) == true){
            txt.add();
            if(/(jpg?|jpeg?|png?|gif?)/g.test(part) == true){
                var querySplit = part.split(ext + '?');
                partsArray.push({ type: 'image', url: querySplit[0] });
            } else {
                partsArray.push({ type: 'image', url: part });
            }
            
        } else {
            txt.add();
            partsArray.push({ type: 'hyperlink', url: part });
        }
    } else if(/data:image\/([a-zA-Z]*);base64,([^\"]*)/g.test(part) == true){
			txt.add();
            partsArray.push({ type: 'image', url: part });
	} else {
            txt.group.push(part);
    }
};
return main;
}) 