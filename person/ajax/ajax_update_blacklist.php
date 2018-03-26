<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");

$id=$_POST['id_update'];
$update_value=$_POST['update_value'];

$array_id=explode ("_",$id);

$update_id=$array_id[1];

$query="UPDATE tbl_blacklist set black_descript='$update_value'   where  id_blacklist='$update_id'";
$result=mysql_query($query);
if ($result){
  echo "save";
}else {echo "error";}













?>