$(document).ready(function(){


$("[id^=reply]").click(function(){

//alert ("rr");
  content=$(".input-block-level").val();
  id=$(this).attr("id");    
  $.post('ajax/comment_write.php', {content:content,id:id}, function(data){
     alert (data);
  });
});

// 巢狀回覆
$("[id^=content_new_reply]").hide();
$("[id^=new_reply]").click(function(){
  //content=$(".input-block-level").val();
  id=$(this).attr("id");  
  $("#content_"+id).show();
  $("#"+id).hide();   
   $("[id^=submit_new_reply]").click(function(){
        submit_id=$(this).attr("id");
        content=$("#content_"+id+" .input-block-level" ).val();  
        $.post('ajax/comment_nested_write.php', {content:content,submit_id:submit_id}, function(data){
           alert (data);
        });
   });


});




});