<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");


$tb_value=$_POST['tb_value'];
session_start() ;
$user_id=$_SESSION['user_id'];

$tb_name=array('heart_a_max','heart_b_max','heart_c_max','heart_d_max','heart_e_max');

$check=true;

foreach ($tb_value as $key => $value ) 
{  
  if ($value > $last_value){
    $sql_upadte.="$tb_name[$key]='$value',";
    $last_value= $value;
  }else {$check = false;} 
}

if ($check !=false)
{
$sql_upadte=substr ($sql_upadte,0,-1);

$query="update  tbl_user set $sql_upadte  where  id='$user_id'";
$result=mysql_query($query);
//echo $query;

if ($result)
{
  echo $lang['MyProfile_2_ajax_1'];
}
}else {echo $lang['MyProfile_2_ajax_2'];}


?>
