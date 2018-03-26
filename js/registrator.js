var submit_1=false;
var submit_2=false;
var submit_3=false;
var submit_4=false;

$(document).ready(function(){  
var show_ok="<img src='pic/login/V.png'>";
var show_error="<img src='pic/login/X.png'>";

// 有空要改，這樣太難看
$("#mail").bind('change',function() {
    var number=1;
    var check_value=$(this).val();
    $.get('ajax/check_registrator.php', {key: number,check_value:check_value}, function(data){  
    if (data ==1){
      $(".show_alert").eq(number).html(show_ok);  
      submit_1=true; 
    }else{
      $(".show_alert").eq(number).html(show_error);  
      submit_1=false; 
    }              
    });
});

$("#displayname").bind('change',function() {
    var number=2;
    var check_value=$(this).val();
    $.get('ajax/check_registrator.php', {key: number,check_value:check_value}, function(data){     
    if (data ==1){
      $(".show_alert").eq(number).html(show_ok);
       submit_2=true;     
    }else{
      $(".show_alert").eq(number).html(show_error);   
       submit_2=false; 
    }              
    });
});

$("#password").bind('change',function() {
    var number=3;
    var check_value=$(this).val();
    $.get('ajax/check_registrator.php', {key: number,check_value:check_value}, function(data){  
    if (data ==1){
      $(".show_alert").eq(number).html(show_ok);   
       submit_3=true;  
    }else{
      $(".show_alert").eq(number).html(show_error);  
       submit_3=false;  
    }              
    });
});
$("#password1").bind('change',function() {
    var number=4;
    var check_value=$(this).val();
    var oringin_passwd=$(".input-block-level").eq(3).val();
    if (check_value == oringin_passwd){
      $(".show_alert").eq(number).html(show_ok);  
       submit_4=true;  
    }else{
      $(".show_alert").eq(number).html(show_error);  
       submit_4=false;  
    }              
});


$("#submit").bind('click',function() {
  if ( submit_1== true &&  submit_2== true &&  submit_3== true &&  submit_4== true)
  {  
    return true;
  }else{ 
     alert (registrator_error);
     return false;
  }
});




});