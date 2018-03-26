<?php
header("Access-Control-Allow-Origin:*");   
include ("../config/mysql.php");

$parameter=$_POST['parameter'];
$train_name=$_POST['train_name'];
$share=$_POST['share'];
$description=$_POST['description'];



$query="update tbl_train_data set train_name='$train_name',train_description='$description',public_access='$share' where id=$parameter";
$result=mysql_query($query);
if ($result)
{
  $return['result']='ok';
}else{
  $return['result']='error';
}



echo json_encode($return);


?>
