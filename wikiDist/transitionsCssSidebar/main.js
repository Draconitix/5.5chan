// Script
var element = document.getElementById('sidebar');

var toggle = function(){
    if(element.getAttribute("class") == "sidebar open"){
        element.setAttribute("class", "sidebar closed")
    } else {
        element.setAttribute("class", "sidebar open");
    }
};