app.directive('chatMessages', function($location, $anchorScroll, $timeout, $cookies, jwtHelper, $rootScope){
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
            delmessage: '&',
            geturi: '&'
        },
        templateUrl: 'partials/directives/chat-message.html',
        link: function(scope, ele, attrs){
            var messageScroll;
            var elem = document.getElementsByClassName('msgAreaParent')[0];
            $('.messageChatArea, .msgAreaParent').ready(function(){
                // Set msg chat area height to height of all messages combined
                new PerfectScrollbar('.msgAreaParent', { wheelSpeed: 3 });
                var h = $('.messageChatArea').height();
                //console.log('msgChatArea height: ' + h)
                $(".msgAreaParent").scrollTop(h)
                 var container = document.getElementById('msgAreaParent');
                    container.addEventListener('ps-scroll-y', function(){
                      var y = $('.msgAreaParent').scrollTop();
                      var hInit = $('.messageChatArea').innerHeight() - $('.msgAreaParent').outerHeight();
                      var h = Math.round(hInit);
                      var range = h - 400;
                      //scope.atBottom = range <= y && y <= h;
                      
                      if(range <= y && y <= h){
                          $rootScope.newMsgCount = 0;
                          $('.chatScrollToBottom').addClass('chatScrollToBottomHidden')
                      } else {
                          $('.chatScrollToBottom').removeClass('chatScrollToBottomHidden');
                      }
                    }); 
            }) 
            scope.user = user.username;
            scope.toggleEdit = function(index){
                if(scope.messages[index].editing == false){
                    scope.messages[index].editing = true;
                    scope.messages[index].edit = scope.messages[index].text;
                } else {
                    scope.messages[index].editing = false;    
                }
            };  
            $('.expandSidebar').hover(function(){
                    $('.message').addClass('expandSidebarHover');
            });
            $('.expandSidebar').mouseleave(function(){
                    $('.message').removeClass('expandSidebarHover');
            });
        }
    }
});