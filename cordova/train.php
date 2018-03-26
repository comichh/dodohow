<?php
header("Access-Control-Allow-Origin:*");   
include ("../config/mysql.php");

$password=$_POST['auth'];
$parameter=$_POST['parameter'];


$query = "select *,c.id as c_id from tbl_user as a, tbl_device as b , tbl_train_data as c ";
$query.=" where a.id=b.creator and a.id=$parameter and b.deviceid=c.deviceid and a.password='$password'";
$result=mysql_query($query);
$i=0;
while ($row=mysql_fetch_array($result))
{ 
  if ( $row[train_name] !=''){
  $return['id'][$i]=$row['c_id'];
  $return['content'][$i]="$row[train_name]";
  $i++;
  }
  //echo   $row[train_name];
} 

//$return['content']="<img src='http://malsup.github.io/images/p1.jpg'><img src='http://malsup.github.io/images/p2.jpg'>";


echo json_encode($return);


?>
