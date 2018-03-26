<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");

  $pic_id =$_POST['pic_id'];
  $pic_lat=$_POST['pic_lat'];
  $pic_title=$_POST['pic_title'];

  $lat_array=explode (",",$pic_lat);

 $query="UPDATE `tbl_pic` SET `pic_title`='$pic_title',pic_lat='$lat_array[0]',pic_lng='$lat_array[1]' WHERE `pic_id`='$pic_id'";
 $result=mysql_query($query);  

//echo $query;

 if (result){echo $lang['save_ok'];}else {echo $lang['database_error'];}


  

?>
