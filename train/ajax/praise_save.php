<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");


$login_user_id=$_SESSION['user_id'];
$train_id=$_GET['train_id'];



$query_check="select *  from tbl_praise where praise_train_key='$train_id' and praise_user_key='$login_user_id'";
$result_check=mysql_query($query_check);
$check=mysql_num_rows($result_check);
if ($check==0) 
{
$return[0]=$lang['save_ok'];

$query="insert into  tbl_praise  (praise_user_key,praise_train_key) values ('$login_user_id','$train_id')";
$result=mysql_query($query);
}else {$return[0]=$lang['no_again_praise'];}

  $query_1="select *  from tbl_praise where praise_train_key='$train_id'";
  $result_1=mysql_query($query_1);
  $total=mysql_num_rows($result_1);
$return[1]=$total;;
echo json_encode($return);


 

?>
