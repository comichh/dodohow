var pic_path="http://"+http_path+"/pic/comment";

$(document).ready(function(){
// $(".form-signin_1, .form-signin_2").hide();     
//$("#all_content").hide();


var body_height=$('body').height();
$('html, body').scrollTop(body_height);

$all_new_reply=$("[id^=content_new_reply]");        // 留言框  
$all_new_reply.hide();           

/*
$("[id^=show_2_]").toggle(
 function(){   
alert ('1');     
     id=$(this).attr("id");
     need=id.split("_");  
     $(".hide_"+need[2]+".form-signin_1").show(100);  
     $(".hide_"+need[2]+".form-signin_2").show(100);
     $(".hide_"+need[2]+".form-signin"+" img").attr({"src":pic_path+"/show_b-.png"});
    },
  function(){
alert ('4');   
     id=$(this).attr("id");
     need=id.split("_");  
     //$(".hide_"+need[2]+".form-signin_1").hide(100);  
     //$(".hide_"+need[2]+".form-signin_2").hide(100);
     //$(".hide_"+need[2]+".form-signin"+" img").attr({"src":pic_path+"/show_b+.png"});

  }); 
*/
　// 2,3 層留言控制，出現既有的留言
$("[id^=show_2_]").click(function(){
     id=$(this).attr("id");
     need=id.split("_");
     if ($(".hide_"+need[2]+".form-signin_1").is(":visible") ==false)
     {      
       $(".hide_"+need[2]+".form-signin_1").show(100);  
       $(".hide_"+need[2]+".form-signin_2").show(100);
       $(".hide_"+need[2]+".form-signin"+" img").attr({"src":pic_path+"/show_b-.png"});         
     }else{   
       $(".hide_"+need[2]+".form-signin_1").hide(100);  
       $(".hide_"+need[2]+".form-signin_2").hide(100);
       $(".hide_"+need[2]+".form-signin"+" img").attr({"src":pic_path+"/show_b+.png"});
     }     
}); 

/*
   // 全部留言控制
  $('#show_total_comment').toggle(
    function(){
        $('#show_total_comment img').attr({"src":pic_path+"/show_+.png"});
        $("#all_content").hide(100);
    },
    function(){
        $('#show_total_comment img').attr({"src":pic_path+"/show_-.png"});
        $("#all_content").show(100);
  }); 
*/


$('#show_total_comment').click( function(){
   if ( $("#all_content").is(":visible") ==false){
      $('#show_total_comment img').attr({"src":pic_path+"/show_b-.png"});
      $("#all_content").show(100);
   }else{
     $('#show_total_comment img').attr({"src":pic_path+"/show_b+.png"});
     $("#all_content").hide(100);
   }
}); 


    // 對留言回覆
    $("[id^=reply]").click(function(){
       content=$(".input-block-level_1").val();;
       id=$(this).attr("id");
       $.post('ajax/comment_write.php', {content:content,id:id}, function(data){
        location.reload(); 
       });
    });
        // 巢狀回覆 ，按下回覆鍵    
        $("[id^=new_reply]").click(function(){
          $all_new_reply.hide();           
          id=$(this).attr("id");      
          $("#content_"+id).show();
          $("[id^=new_reply]").show();      // 恢復其他的 回應按鍵
          $("#"+id).hide();                 // 自己的隱藏掉
          $("#submit_"+id).click(function(){            // 這邊要加東西
            submit_id=$(this).attr("id");       
            content=$("#content_"+id+" .input-block-level" ).val();
            $.post('ajax/comment_nested_write.php', {content:content,submit_id:submit_id}, function(data){
                location.reload(); 
            });
          });
        });
　　　　　　 // 刪除
       $("[id^=kill]").click(function(){
        submit_id=$(this).attr("id");
        $.post('ajax/comment_kill.php', {submit_id:submit_id}, function(data){
           location.reload(); 
        });
    });

 });
