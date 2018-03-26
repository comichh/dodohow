<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");

$tb_value_weight=$_POST['tb_value_weight'];
$tb_value_age=$_POST['tb_value_age'];
$lang=$_POST['lang'];
$map=$_POST['map'];

session_start() ;
$user_id=$_SESSION['user_id'];
$_SESSION['Lang']=$lang;
$_SESSION['map']=$map;


$query="update  tbl_user set weight='$tb_value_weight',age='$tb_value_age',language='$lang',map='$map'  where  id='$user_id'";
$result=mysql_query($query);

if ($result)
{
  echo "ok";
}

?>
