<?php
//session_start() ;
$id=$_POST['submit_id'];

include ("../../config/mysql.php");
$id_array=explode ("_",$id);

//$user_id=$_SESSION['user_id'];
$comment_id=$id_array[1]; 


$query="delete from tbl_comment where id_comment='$comment_id'";
$result=mysql_query($query); 

if ($result){echo "刪除成功";}else { echo "刪除失敗";}





?>