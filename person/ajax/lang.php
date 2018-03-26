<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");


$lang=$_POST['lang'];
session_start() ;
$user_id=$_SESSION['user_id'];

$query="update  tbl_user set language='$lang' where  id='$user_id'";
$result=mysql_query($query);
if ($result)
{
  $_SESSION['Lang']=$lang;
  echo "ok";
}

?>
