<?php
$navigation=true;
$no_check=false;
include_once ("../config/head.php");


$user_id=$_SESSION['user_id'];

$query="select * from tbl_user where id='$user_id'";
$result=mysql_query($query);
while ($row=mysql_fetch_array($result))
{
  $weight=$row['weight'];
  $age=$row['age'];
  $language=$row['language'];
  $map_config=$row['map'];
  $UserImage=$row['image'];
}

$lang_select="<select id='language_show'>";
if ($language ==1){ 
  $lang_select.="<option value='1'  selected='selected'>$lang[language_show_1]</option>";
  $lang_select.="<option value='2'>$lang[language_show_2]</option>"; 
}else{
  $lang_select.="<option value='1'>$lang[language_show_1]</option>";
  $lang_select.="<option value='2' selected='selected'>$lang[language_show_2]</option>"; 
}
$lang_select.="</select>";

$map_select="<select id='map_show'>";
if ($map_config ==1){ 
  $map_select.="<option value='1'  selected='selected'>$lang[map_setting_1]</option>";
  //$map_select.="<option value='2'>$lang[map_setting_2]</option>"; 
}else{
  $map_select.="<option value='1'>$lang[map_setting_1]</option>";
  //$map_select.="<option value='2' selected='selected'>$lang[map_setting_2]</option>"; 
}
$map_select.="</select>";

?>




<style>
#body_content{text-align:center}
#config_1_div span{display:inline-block;}  
#config_1_div span:first-child {width:70px;}
#lang_span{display:inline-block;width:70px;}
input[type=text]{width:600px;}  
select{width:600px;}  
#uploadify object { 
  display:block;
  width:100%;    
}     
</style>
<script type="text/javascript" src="../jquery/plugin/uploadify/jquery.uploadify.min.js?new Date() "></script>
<script>
 var session_id='<?php echo session_id();?>';
</script>     

<div id='body_page'> <div id='body_table'> 
  <div id='body_content'>
    <h2> <?php echo $lang[system_h2_1_1] ?> </h2>    
    <table style='width:100%' >
      <tr><td id='uploadify'>
        <input type="file" name="file_upload" id="file_upload_1"/><br><br>      
      </td><td>
        <img id='show_pic' height='100px' src='../upload/user/<?php echo $UserImage;?>'>   
      </td> 
      <td style='vertical-align:top;'>
        <?php echo $lang['system_h2_1_1_1']?>:  jpg , jpeg , gif , png<br><br> 
        <?php echo $lang['system_h2_1_1_2']; ?>      
     </td></tr>
    </table>
 
    <hr> 
    <h2><?php echo $lang['system_h2_1'] ?></h2>
    <div id='config_1_div'>
       <div>
        <span> <?php echo $lang['system_h2_1_2']?></span>
        <span> <input  type='text'  id='p_weight' value='<?php echo $weight;?>'></span>
       </div>
        <br> 
       <div>
        <span><?php echo $lang['system_h2_1_3']?></span>
        <span><input  type='text' id='p_age' value='<?php echo $age;?>'></span>
       </div>
     </div>
    <hr>
    


  <?php 
     echo "<h2> $lang[system_h2_2] </h2>";
     echo "<span id='lang_span' >$lang[language_show_0]</span>$lang_select";
     echo "<p>";
     echo "<span id='lang_span' >$lang[map_setting]</span>$map_select";
  ?>
 
 
  
  <br> <br> 



 <div id='save_config_1' class='button_css3' style='width:400px' ><?php echo $lang['save'] ?> </div>


</div></div> </div>  
<script type="text/javascript" src="js/config1.js"></script>
<?php include ("../foot.php");?>
