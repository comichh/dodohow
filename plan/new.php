<?php
$navigation=true;
$no_check=false;
include_once '../config/head.php';
$user_id=$_SESSION['user_id'];
$map_config=$_SESSION['map'];
//$map_config=1;
$now_time=date("YmdHis",time());
?>

<script>
   var max_ten_point='<?php echo $lang['max_ten_point']?>';
   var no_directions='<?php echo $lang['no_directions']?>';
   var clear_directions='<?php echo $lang['clear_directions']?>';
   var map_config='<?php echo $map_config?>';
</script>
<script src='js/new.js'></script>
<script src='js/share_function.js'></script>
<?php 
if ($map_config==1){  
  echo '<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=geometry"></script>';
  echo "<script src='js/new_google.js'></script>";
}else{ 
  echo '<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.5&ak=rHvlawvttpb6EzXsUskGh6f6"></script>';
  echo '<script type="text/javascript" src="http://developer.baidu.com/map/jsdemo/demo/changeMore.js"></script>';
  echo "<script src='js/new_baidu.js'></script>";
}
?>



<style>
/*  地圖 */

#map-canvas{height: 670px;width:100%;}
#main_table{width:100%}
#left_td{width:85%;vertical-align:top; padding:0px}
#right_td{width:15%;vertical-align:top;text-align:left;background:#c9caca;padding:20px 0px 0px 20px }
#search_value{width:300px}
input[type=text]{width:150px}
#new_1_div div{margin:0 0 20px 0}
#new_1_div span{display:inline-block;}  
#new_1_div span:first-child {width:100%; }
</style>




<p>

  <span style='color:blue'>{<?php echo $lang['create_map_info'] ?>}</span>
  <span> <?php echo $lang['map_search']?> </span>
  <span><input type='text' id='search_value'></span> 
  <span class='button_css3' id='search'><?php echo $lang['search'] ?> </span>
  <span style='width:200px' class='button_css3' id='kill_last_point'><?php echo $lang['kill_last_point'] ?> </span>
  <select id='direct_type'><option value='1'><?php echo $lang['type_directions']?></option><option value='2'><?php echo $lang['type_line']?></option> </select> 
<table id='main_table' >
<tr>
<td id='left_td'> 
   <div id="map-canvas"></div>
</td>
<td id='right_td'> 
  <div id='new_1_div'>
    <div>
       <span><?php echo $lang['train_name']?> </span> 
       <span><input type='text' id='e_title' value=''>  </span>
    </div>
    <div>
       <span><?php echo $lang['sport_info']?></span> 
       <span><input type='text' id='e_desciption' value=''></span>
    </div>
    <div>  
       <span><?php echo $lang['machine_title']?> </span>
       <span><input type='text' id='machine_title' value='<?php echo $now_time;?>'></span>
       <div>(<?php echo $lang['machine_title_info']?>）</div>
    </div>  
    <div>
      <span><?php echo $lang['total_distance']?>(m)：</span >
      <span><input  id='total_dis' type='text' value=0></span>
    </div>
   <div>
       <div>  <?php echo $lang['sport_type']?> </div> 
       <span><input  type='radio' name='sport_type[]'  value='1' checked='yes'> <?php echo $lang['run']?></span>         
       <span><input type='radio' name='sport_type[]'  value='2' > <?php echo $lang['bicycle']?></span>
    </div>
  </div> 
     
<div>
  <span class='button_css3' style='width:70px' id='edit_save'><?php echo $lang['save'] ?> </span>
  <span class='button_css3' style='width:70px' id='edit_cacel'><?php echo $lang['cacel'] ?> </span>
</div>
</td>
</tr>
</table>

<?php
 include ("../foot_all.php");
?>