// Append message to chatDiv in DOM

var chatDiv = document.getElementById("chatDiv");

var append = function(parts){
    var inHTMLString = '';
    for(var i = 0; i < parts.length; i++){
        switch(parts[i].type){
            case 'text':
                inHTMLString += '<p>' + parts[i].text + '</p>';
                break;
            case 'img':
                inHTMLString += '<img src="' + parts[i].url + '" width="200px"/>';
                break;
            case 'video':
                inHTMLString += '<iframe width="560" height="315" src="' + parts[i].url + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
                break;
        }
        if(i == parts.length - 1){
            chatDiv.innerHTML = inHTMLString;        
        }
    }
};