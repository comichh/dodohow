<?php
header("Access-Control-Allow-Origin:*");   
include ("../config/mysql.php");

$user_id=$_POST['user_id'];
$password=$_POST['auth'];
$parameter=$_POST['parameter'];
$share=$_POST['share'];
// change
$query = "select *,c.id as c_id from tbl_user as a, tbl_device as b , tbl_train_data as c ";
$query.=" where a.id=b.creator and c.id=$parameter and b.deviceid=c.deviceid and a.password='$password' ";
if ($share !=1)
{ 
  $query.=" and a.id='$user_id'";
}
$result=mysql_query($query);
while ($row=mysql_fetch_array($result))
{
  $db_name=$row['db_name'];
}


// 1000 
$query="select * from $db_name as a ,tbl_reduce_1000_point as b where a.train_data_key=$parameter and a.no=b.1000_for_point and b.1000_for_train=$parameter";
// 200 
//$query="select * from $db_name as a ,tbl_reduce_100_point as b where a.train_data_key=$parameter and a.no=b.1000_for_point and b.1000_for_train=$parameter";
$result=mysql_query($query);
$i=0;
while ($row=mysql_fetch_array($result))
{
  //$db_name=$row['db_name'];
  if ( $row['start_time'] !=''){
    $return['start_time'][$i]=$row['start_time'];
    $return['speed'][$i]=$row['speed'];
    $return['altitude'][$i]=$row['altitude'];
    $return['heart_rate'][$i]=$row['heart_rate'];  
    $return['distance'][$i]=$row['distance'];  
    $i++;
  }
}

echo json_encode($return);


?>
