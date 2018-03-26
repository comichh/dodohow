window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
      appId      : fb_appId,                        // App ID from the app dashboard
      channelUrl : fb_channelUrl, // Channel file for x-domain comms
      status     : true,                                 // Check Facebook Login status
      xfbml      : true                                  // Look for social plugins on the page
    });
    // Additional initialization code such as adding Event Listeners goes here
  };

  // Load the SDK asynchronously
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/all.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
  
		  

function FBLogin(){
$(document).ready(function(){
var device;
 FB.login(function(response) {   
   if (response.authResponse) { 
     var userid=response.authResponse.userID          
      // 搜尋資料開始   
      //FB.api('/100000068706502?fields=id,name,friends.fields(name)', function(response1) {
        FB.api('/'+userid+'?fields=id,name,email,picture', function(response1) {
        // console.log (response1);
        // $("#show").html(response1.id); 
        // $("#show").append("<p>"+response1.name);                 
        // $("#show").append("<p>"+"<img src='"+response1.picture.data.url+"'>"); 
        // alert (response1.friends.data[1].name);                 
       if (response1){    // 因為非同步，所以等到他回應後再說
          $.post('ajax/facebook.php', {userid:response1.id,email:response1.email,name:response1.name,pic:response1.picture.data.url,device:device }, function(data){       
            if (data !='error'){  window.location = 'person/index.php';} else {alert (data);}             
          }); 
       }                   
          });    
   } else {
     alert('登入失敗');
     //console.log('User cancelled login or did not fully authorize.');
   }
 }, 
 //{scope: 'email,user_likes,read_friendlists,friends_online_presence,publish_stream'}
   {scope: 'email'}
 );
});
}







