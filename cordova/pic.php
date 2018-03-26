<?php
header("Access-Control-Allow-Origin:*");   
include ("../config/mysql.php");

//$user_id=$_POST['user_id'];
//$password=$_POST['auth'];
$parameter=$_POST['parameter'];


$query = "select *,a.id as a_id  from tbl_user as a, tbl_device as b , tbl_train_data as c , tbl_pic as d";
$query.=" where a.id=b.creator  and b.deviceid=c.deviceid  and d.pic_train_key='$parameter' AND d.pic_train_key = c.id ";
//echo $query;
$result=mysql_query($query);
$i=0;
while ($row=mysql_fetch_array($result))
{ 
  if ( $row['pic_name'] !=''){
  $return['pic_name'][$i]=$row['pic_name'];
  $return['creator']=$row['a_id'];
  $i++;
  }
  //echo   $row[train_name];
} 




echo json_encode($return);




?>
