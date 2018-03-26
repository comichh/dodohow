<?php
include ("../../config/mysql.php");

$train_id=$_POST['id'];

//print_r ($_POST);
$id=explode (",",$train_id);

foreach ($id as $key => $value )
{ 
  $query="delete from tbl_train_data where id='$value'";
  $result=mysql_query($query) or die('error');
}


?>
