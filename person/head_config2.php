<?php
$blue_1='';
$blue_2='';
$blue_3='';

if ($click_if=='blacklist'){
  $blue_2="class='button_1'";
}else if ($click_if=='machine'){
  $blue_3="class='button_1'";
}else{
  $blue_1="class='button_1'"; 
}

echo "
<div class='stand_button_0' style='text-align:left; '>
 <div class='top_button'>
   <span id='config_2_1' $blue_1><a href='config2.php'>".$lang['MyProfile/2_head_1']."</a></span>
   <span id='config_2_2' $blue_2><a href='blacklist.php'>".$lang['MyProfile/2_head_2']."</a></span>
   <span id='config_2_3' $blue_3><a href='machine.php'>".$lang['machine_config_3']."</a></span>    
 </div>
</div> 
<hr>


";

?>

