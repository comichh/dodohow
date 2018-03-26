<?php
include ("../config/mysql.php");

$key=$_GET['key'];
$check_value=$_GET['check_value'];



switch ($key)
{
  case 1:       // 檢查 e-mail   
    $query="select * from  tbl_user where email='$check_value'";
    $result=mysql_query($query);
    $num=mysql_num_rows($result);   
    $check_express="/^[A-Za-z0-9\.\-]+@[A-Za-z0-9]+\.[A-Za-z0-9\.]+$/";
    $check=preg_match($check_express,$check_value);
    if ($check ==1 and $num==0)
    {
      echo 1;
    }else {echo "no";}
   
  break;
  case 2:      // 檢查 id
    $query="select * from  tbl_user where displayname='$check_value'";
    $result=mysql_query($query);
    $num=mysql_num_rows($result);
    //echo $num;   
    $check_express="/\w{3,}/";
    $check=preg_match($check_express,$check_value);
    if ($check ==1 and $num==0)
    {
      echo 1;
    }else {echo "no";}
  break;
  case 3:
    $check_express="/^(?=.*[A-Za-z]).{8,}$/";
    echo preg_match($check_express,$check_value);
  break;

}




?>
