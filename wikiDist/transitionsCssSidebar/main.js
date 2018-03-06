// Script
var sidebar = document.getElementById('sidebar');
var chat = document.getElementById('chat');

var toggle = function(){
    if(sidebar.getAttribute("class") == "sidebar open"){
        sidebar.setAttribute("class", "sidebar closed")
        chat.setAttribute("class", "chatArea full");
    } else {
        sidebar.setAttribute("class", "sidebar open");
        chat.setAttribute("class", "chatArea default");
    }
};