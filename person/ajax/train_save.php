<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");
include ("../../function/check_input.php");


  $_POST= check_input_array($_POST);
  $train_id=$_POST['train_id'];  
  $train_name=$_POST['train_name'];
  $displayname=$_POST['displayname'];  
  $cSport6=$_POST['sport_type'];
  $public_access=$_POST['share'];
  $weather=$_POST['weather'];
  $train_description=$_POST['description'];      //做輸入保護
  $slope=$_POST['slope'];
  $pic=urldecode($_POST['pic']);

// 再多存一個，第一點的座標 ，後面到底有沒有用到，也不太確定了！
$query="select * from tbl_train_data as a ,tbl_device as b";
$query.=" where a.deviceid=b.deviceid and a.id='$train_id' "; 
$result=mysql_query($query) or die('error');
$row=mysql_fetch_array($result);
$dbname=$row['db_name']; 

$query1="select * from $dbname where train_data_key='$train_id' and no='0'";
$result1=mysql_query($query1) or die('error');
while($row1=mysql_fetch_array($result1))
{
  $latitude=$row1['latitude'];
  $longitude=$row1['longitude'];
}


 $time=date("Y-m-d H:i:s");
 $query="UPDATE `tbl_train_data` SET `train_name`='$train_name',train_description='$train_description',post_datetime='$time',";
 $query.="cSport6='$cSport6',public_access='$public_access',weather='$weather',slope='$slope',start_lat='$latitude',start_lng='$longitude'";  
 $query.=" WHERE `id`='$train_id'";
 //echo $query;
 $result=mysql_query($query);  

 if (result){echo $lang['save_ok']; }else {echo $lang['database_error'];}
  
 if ( $pic !=''){
   $map_pic_path="$work_path/upload/point_thumbnail/$train_id.jpg";
   file_put_contents($map_pic_path, file_get_contents($pic));
 }
  

?>
