<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");
include('../../function/slope_difficulty.php');
include ("../../function/check_input.php");

//$value=$_POST['edit_save_array'];
$value= check_input_array($_POST['edit_save_array']);

$f_point=$_POST['f_point'];
$f_point_1=$_POST['f_point_1']; 
$gps_lat=$_POST['gps_lat'];
$gps_lng=$_POST['gps_lng'];    
$map_source=$_POST['map_source'];
//$pic=urldecode($_POST['pic']);
//echo $pic;

session_start() ;
$user_id=$_SESSION['user_id'];

$lTotalDistance=$value[3];
$wAscent=$value[4];
$slope=slope_difficulty_1 ($lTotalDistance/1000,$wAscent/1000);

$query="insert into   tbl_planning_private_create ";
$query.=" (user_planning,origin_user, pctool_planning_name,web_planning_name,sport_type,train_description,lTotalDistance,wAscent,slope,map_source)";                
$query.=" VALUES('$user_id','$user_id','$value[2]','$value[0]','$value[10]','$value[1]','$value[3]','$value[4]','$slope','$map_source')";  
$result=mysql_query($query) or die ('error');
if ($result)
{
  $train_id=mysql_insert_id(); 
}else {echo "error";}


// 還沒存新座標
foreach ($f_point as $key => $value ) 
{
  $query="insert into   tbl_planning_private_create_detail ";
  $query.=" (200_latitude,200_longitude,for_planning_id,gps_lat,gps_lng )";
  $query.=" VALUES('$f_point[$key]','$f_point_1[$key]',$train_id,'$gps_lat[$key]','$gps_lng[$key]')";
  $result=mysql_query($query) ;  
}



// 還要產生縮圖
// 這邊還要產生縮圖，js 部分產生
/*
 if ( $pic !=''){
   $map_pic_path="$work_path/upload/plan_thumbnail/$train_id.jpg";
   file_put_contents($map_pic_path, file_get_contents($pic));
 }
*/
?>
