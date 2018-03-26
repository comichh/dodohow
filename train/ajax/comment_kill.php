<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");

$id=$_POST['submit_id'];

include ("../../config/mysql.php");
$id_array=explode ("_",$id);
$comment_id=$id_array[1]; 


$query="delete from tbl_comment where id_comment='$comment_id'";
$result=mysql_query($query); 

if ($result){echo $lang['kill_ok'];}else { echo $lang['database_error'];}





?>