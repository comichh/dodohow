<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");


$id=$_POST['id'];
$train_id=$_POST['train_id'];


foreach ($train_id as $key => $value )
{
  if ( $value !=0)        // 原來的資料庫
  {
    $dbname="tbl_planning";
    $tb_name="id_planning";
    $query="update  $dbname set save='1'where $tb_name='$id[$key]'";
  }else {              // 新的資料庫
    $dbname="tbl_planning_private_create";
    $tb_name="id_planning";
    $query="update  $dbname set save='1'  where $tb_name='$id[$key]'";
  }
  $result=mysql_query($query);
}

if ($result){echo $lang['message_pctool'];}else {echo "error";}





?>