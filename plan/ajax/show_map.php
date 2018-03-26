<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");
 $id=$_GET['id'];
 $train_id=$_GET['train_id'];
//session_start() ;
//$user_id=$_SESSION['user_id'];

if ( $train_id !=0)
{
  $dbname="tbl_planning_200_point";
  $tb_name="200_for_point_id";
  $query="select * from $dbname where $tb_name='$train_id'";         // 這邊存 訓練id
}else {
  $dbname="tbl_planning_private_create_detail";
  $tb_name="for_planning_id";
  $query="select * from $dbname where $tb_name='$id'";         // 這邊存的是對應的 key
}
//echo $query;
$result=mysql_query($query);
$i=0;
while ($row=mysql_fetch_array($result))
{
  $sql_array[$i]['latitude']=$row['200_latitude'];    // 經度
  $sql_array[$i]['longitude']=$row['200_longitude'];    // 經度
  $i++;   
}
$sql_json= json_encode($sql_array);
echo $sql_json;

?>