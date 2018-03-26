// DOM vars

var chatDiv = document.getElementById("chatDiv");
var inp = document.getElementById('inputElement');
var partsArray = [];

var main = function(){
    partsArray = [];
    var partition = inp.value.split(" ");
    for(var i=0; i < partition.length; i++){
        parse(partition[i]);
        if(i == partition.length - 1){
            txt.add();
            append(partsArray);
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

// Append message to chatDiv in DOM

var append = function(parts){
    var inHTMLString = '';
    for(var i = 0; i < parts.length; i++){
        switch(parts[i].type){
            case 'text':
                inHTMLString += '<p>' + parts[i].text + '</p>';
                break;
            case 'image':
                inHTMLString += '<img src="' + parts[i].url + '" width="200px"/>';
                break;
            case 'video':
                inHTMLString += '<iframe width="560" height="315" src="' + parts[i].url + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
                break;
            case 'hyperlink':
                inHTMLString += '<a target="_blank" href="' + parts[i].url + '">' + parts[i].url + '</a>';
                break;
        }
        if(i == parts.length - 1){
            chatDiv.innerHTML += inHTMLString;
            inHTMLString = '';
        }
    }
};

// Parse message

var parse = function(part){
    if(/^(http:\/\/|https:\/\/)/g.test(part) == true){
        var imgSplit = part.split(".");
        var ext = imgSplit[imgSplit.length - 1].toLowerCase();
        if(/(www\.youtube\.com\/)/g.test(part)){
            txt.add();
   
			   if(part.indexOf("watch?v=") > -1){
				   var idSplit = part.split("watch?v=")
				   partsArray.push({ type: 'video', url: "https://www.youtube.com/embed/" + idSplit[1] });	   
			   } else {
				    partsArray.push({ type: 'video', url: part });
				}
		} else if(/(jpg|jpeg|png|gif)/g.test(part) == true){
            txt.add();
            partsArray.push({ type: 'image', url: part });
        } else {
            txt.add();
            partsArray.push({ type: 'hyperlink', url: part });
        }
    } else {
        txt.group.push(part);
    }
};