<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");

$id=$_POST['id'];

//session_start() ;
//$user_id= $_SESSION['user_id'];
$array_id=explode ("_",$id);

$kill_id=$array_id[1];

$query="DELETE FROM tbl_blacklist  WHERE  id_blacklist='$kill_id'";
//echo $query;
$result=mysql_query($query);
if ($result){
  echo "ok";
}else {echo $lang['database_error'];}













?>