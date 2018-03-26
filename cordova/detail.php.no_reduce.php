<?php
header("Access-Control-Allow-Origin:*");   
include ("../config/mysql.php");

$parameter=$_POST['parameter'];

// change
//$query = "select *,c.id as c_id from tbl_user as a, tbl_device as b , tbl_train_data as c where a.id=b.creator and c.id=$parameter and b.deviceid=c.deviceid ";
$query = "select *,c.id as c_id from tbl_user as a, tbl_device as b , tbl_train_data as c,  tbl_planning_200_point as d where a.id=b.creator and c.id=$parameter and b.deviceid=c.deviceid and d.200_for_point_id=$parameter";
echo $query;
$result=mysql_query($query);
while ($row=mysql_fetch_array($result))
{
  $db_name=$row['db_name'];
}


$query="select * from $db_name where train_data_key=$parameter";
$result=mysql_query($query);
$i=0;
while ($row=mysql_fetch_array($result))
{ 
  if ( $row['200_latitude'] !=''){
  $return['latitude'][$i]=$row['200_latitude'];
  $return['longitude'][$i]=$row['200_longitude'];
  $i++;
  }
} 



echo json_encode($return);


?>
