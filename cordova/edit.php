<?php
header("Access-Control-Allow-Origin:*");   
include ("../config/mysql.php");


$user_id=$_POST['user_id'];
$password=$_POST['auth'];
$parameter=$_POST['parameter'];

$query="select * from tbl_user as a,tbl_train_data as b where b.id=$parameter and a.password='$password' and a.id='$user_id'"; 
$result=mysql_query($query);
$i=0;
while ($row=mysql_fetch_array($result))
{
  //$db_name=$row['db_name'];
  if ( $row['train_name'] !=''){
    $return['train_name'][$i]=$row['train_name'];
    $return['train_description'][$i]=$row['train_description'];
    $return['public_access'][$i]=$row['public_access'];
    $i++;
  }
}



echo json_encode($return);


?>
