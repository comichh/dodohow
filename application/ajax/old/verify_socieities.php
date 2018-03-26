<?php
session_start() ;
$id=$_POST['id'];


include ("../../config/mysql.php");
$id_array=explode ("_",$id);

$user_id=$_SESSION['user_id'];

$accept_if=$id_array[1];
$sociieities_recode_id=$id_array[2];

if ($accept_if =='1'){
  $query="update  tbl_societies_record   set verify='$accept_if' where id_societies_record='$sociieities_recode_id'";
  $result=mysql_query($query);
  // 申請通過也要發通知才對   
}else {
// 可能還要發通知給申請者 
  $result=true;
} 

if ($result){echo "修改成功";}else { echo "修改失敗";}




?>