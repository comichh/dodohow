<?php 
  $navigation=true;
  $no_check=false;
  include ("../config/head.php");
?>

<script>
$(document).ready(function(){
	$("#blacklist_submit").click(function(){
    blacklist_id=$("#blacklist").val();
    blacklist_descript=$("#blacklist_descript").val();
    $.post('ajax/ajax_blacklst.php', {blacklist_id:blacklist_id,blacklist_descript:blacklist_descript}, function(data){    
      if ( data == 'ok'){
         location.reload(); 
      }else{
        alert (data);
      }      
    });  
  });
});
</script>


 <div id='body_page'> <div id='body_table'> 
<?php     
   $click_if='blacklist';
   include ('head_config2.php');
   $add_societies="<div id='body_content'>
   <h1>".$lang['blacklist_1']."($lang[blacklist_info])"."</h1>
   $lang[blacklist_2] :<input style='width:200px' id='blacklist' type='text' name='blacklist' >
   $lang[blacklist_3] :<input style='width:300px' id='blacklist_descript' type='text' name='blacklist_descript'>   
   <div class='button_css3' id='blacklist_submit'>$lang[submit] </div>";

   echo $add_societies;
   echo "<br><hr>";   
    

// 黑名單管理
include ("manageblacklist.php");

?>   
</div></div></div>
<?php include ("../foot.php");?>




