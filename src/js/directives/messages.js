app.directive('chatMessages', function($location, $anchorScroll, $timeout, $cookies, jwtHelper){
    var token = $cookies.get('accessToken');
    var user = jwtHelper.decodeToken(token);
    var getDate = function (date) {
      var year = date.getFullYear();
      var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
      var month = (1 + date.getMonth()).toString();
      month = month.length > 1 ? month : '0' + month;
      var day = date.getDate().toString();
      day = day.length > 1 ? day : '0' + day;
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return monthNames[month - 1] + ' ' + Math.round(day) + ', ' + year + ' ' + strTime;
    }
    return {
        restrict: 'E',
        scope: {
            messages: '=messages',
            authorize: '&',
            editmessage: '&',
            delmessage: '&'
        },
        templateUrl: 'partials/directives/chat-message.html',
        link: function(scope, ele, attrs){
            scope.user = user.username;
            scope.toggleEdit = function(index){
                if(scope.messages[index].editing == false){
                    scope.messages[index].editing = true;
                    scope.messages[index].edit = scope.messages[index].text;
                } else {
                    scope.messages[index].editing = false;    
                }
            }; 
            var scroll = function(){
                $timeout(function(){
                    //window.location.hash = "";
                    //$location.hash('bottomMessage')
                    //$anchorScroll();
                    var elem = document.getElementById('msgAreaParent');
                    $(".msgAreaParent").animate({
                         scrollTop: elem.scrollHeight
                     }, 0);
                })    
            }
            scroll();     
        }
    }
});