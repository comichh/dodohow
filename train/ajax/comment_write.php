<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");
include ("../../function/check_input.php");
$_POST= check_input_array($_POST);
$id=$_POST['id'];
$content=$_POST['content'];

$id_array=explode ("_",$id);

$user_id=$_SESSION['user_id'];
$train_id=$id_array[1];
$indent=0;

// 第一層的回應，要撈一次回覆誰
$query_1="select * from tbl_train_data,tbl_device   where tbl_train_data.id='$train_id' and tbl_train_data.deviceid=tbl_device.deviceid"; 
$result_1=mysql_query($query_1); 
while ($row=mysql_fetch_array($result_1))
{
  $creator=$row['creator'];
}


$query="insert into tbl_comment (for_user_id,for_train_id,indent,content,for_comment_user)"; 
$query.="values ('$user_id','$train_id','$indent','$content','$creator')";
$result=mysql_query($query); 

//echo $query;

if ($result){echo $lang['submit_ok'];}else { echo $lang['database_error'];}




?>
