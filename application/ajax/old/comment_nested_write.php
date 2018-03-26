<?php
session_start() ;
$id=$_POST['submit_id'];
$content=$_POST['content'];


include ("../../config/mysql.php");
$id_array=explode ("_",$id);

$user_id=$_SESSION['user_id'];
$for_comment_user=$id_array[3]; 

$train_id=$id_array[4];
$for_comment_id=$id_array[5];

// 取出原來的層數
$query_indent="select * from tbl_comment where id_comment='$for_comment_id'";
$result=mysql_query($query_indent);
while ($row=mysql_fetch_array($result))
{
  $indent=$row['indent']+1;
}
$query="insert into tbl_comment (for_user_id,for_train_id,for_comment_id,indent,content,for_comment_user)"; 
$query.="values ('$user_id','$train_id','$for_comment_id','$indent','$content','$for_comment_user')";
$result=mysql_query($query); 

if ($result){echo "發表成功";}else { echo "發表失敗";}





?>