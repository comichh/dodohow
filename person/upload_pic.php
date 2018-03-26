<?php
$navigation=true;
$no_check=false;
include ("../config/head.php");

$person_id=$_SESSION['user_id'];
$train_id=$_GET['train_id'];

$pic_path="../upload/trip_photo/$person_id/$train_id"; 


$p1="<div><img style='width:40px' src='../pic/person/up.png'></div>";
$p2="<img style='width:40px' src='../pic/person/down.png'>";


// 容量檢查要作也可以這邊做掉，也讓經緯度縮短
$query="select * from tbl_pic where pic_train_key='$train_id'";
$result=mysql_query($query);
$right_pic="";
$pic_number=mysql_num_rows($result);
if ($pic_number >0){  
  while ($row=mysql_fetch_array($result)){
    $pic_lat=substr($row['pic_lat'] ,0,8);
    $pic_lng=substr($row['pic_lng'] ,0,8);       
    $right_pic.="<div><img  src='$pic_path/$row[pic_name]' alt='$pic_lat,$pic_lng' title='$row[pic_title]' pic_id='$row[pic_id]'></div>";
  }
}else{
 // 產生目錄存放圖片的目錄
 system ("mkdir $work_path/upload/trip_photo/$person_id",$return);
 system ("mkdir $work_path/upload/trip_photo/$person_id/$train_id",$return);
 system ("mkdir $work_path/upload/trip_photo/$person_id/$train_id/thumbnail",$return); 
}



// 撈每一點座標
$query="select * from tbl_train_data,tbl_device  where tbl_train_data.id='$train_id' and tbl_train_data.deviceid=tbl_device.deviceid";
$result=mysql_query($query);
while ($row_total=mysql_fetch_array($result))
{
  $db_name=$row_total['db_name'];
}

//echo $query;

$query="select * from $db_name  where train_data_key='$train_id'";
$result=mysql_query($query);
$total_number=mysql_num_rows($result);
$i=0;
if ($total_number>0){
while ($row=mysql_fetch_array($result))
{
  $sql_array[$i]['latitude']=$row['latitude'];    // 經度
  $sql_array[$i]['longitude']=$row['longitude'];  // 緯度
  $i++;
}
}
$sql_json= json_encode($sql_array);

$to_js="<script type='text/javascript'>";
$to_js.="var beaches=$sql_json;";  
$to_js.="</script>";
echo $to_js;             //傳遞參數給 js

?>
<style>
#t_left{width:920px;text-align:left;vertical-align:top;}
#t_right{width:270px;background-color:#c9caca  }
.left_menu{ height: 130px;display:inline-block;vertical-align:top;margin:10px 5px 60px 5px}
#map-canvas{height: 500px;margin-left:10px}
#show_pic{height:490px;overflow:hidden;vertical-align:top;}  /* 箭頭顏色 */
#show_pic div{margin:8px 0}
/* #new_upload_window{display:none;position:absolute;left:40px;top:45px;z-index:100;background:#C9CACA;width:400px;height:600px;}*/
/* #file_upload{display:none;position:absolute;left:40px;top:45px;z-index:100;background:#C9CACA;width:400px;height:600px;}*/
#uploadify{padding-left:60px;}
#uploadify object { 
  display:block;
  width:100%;    
}     

</style>
<link  type='text/css' href='../jquery/plugin/uploadify/uploadify/uploadify.css'>

<script>
  var db_name="<?php echo $db_name; ?>";               
  var train_id="<?php echo $train_id; ?>";    
  var pic_path="<?php echo $pic_path; ?>";  
  var session_id='<?php echo session_id();?>';
</script>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3&sensor=false"></script>



<div id='body_page'><div id='body_table'>
<table style='position:relative;'><tr> 
 <td id='t_left'>   
    <div class='left_menu' style='width:500px'>
      <?php echo $lang['upload_pic_2']?><p>
      <?php echo $lang['upload_pic_3']?>： 
        <span id='show_lat'></span> 
        <span class='button_css3' id='edit_map'><?php echo $lang['edit']?> </span><p>
      <?php echo $lang['pic_information']?>： 
        <input id='pic_title' type='text' style='width:390px' > <p>
        <span id='pic_save' class='button_css3'><?php echo $lang['save']?> </span> 
        <span id='pic_kill' class='button_css3'><?php echo $lang['kill']?> </span>
     </div>
     <div class='left_menu' id='new_pic'></div>
     <div id="map-canvas"></div>
  </td>
  <td id='t_right' style='vertical-align:top;'>
   <?php echo $lang['upload_pic_1'];?><br><br>
   <div id='uploadify'><input type="file" name="file_upload" id="file_upload" /></div><p><br>   
     
      <?php echo $lang['upload_pic_5']?><p>
      <a id='page_up' href='#'><?php echo $p1;?></a><p>
        <div id='show_pic'><?php echo $right_pic;?></div><br>
      <a id='page_down' href='#'><?php echo $p2;?></a>
   </td>
 </tr></table>
</div></div>

<style>
/* 只能放最後 */
#show_pic img{width:200px;}
#show_pic span{vertical-align:top}


</style>
<script type="text/javascript" src="../jquery/plugin/uploadify/jquery.uploadify.min.js"></script>
<script type="text/javascript" src="js/upload_pic.js"></script>


<?php
include ("../foot.php");
?>