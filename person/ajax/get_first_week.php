<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");


$now_date=$_GET['now_date'];
$need=$_GET['need'];


$array=explode("-",$now_date);
$year=trim($array[0]);
$month=trim($array[1]);
$array[2]=trim($array[2]);

//print_r ($array);
if ($need =='year'){
  $first_day = date('w', mktime(0, 0, 0, $month, 1, $year));  // 這個出來是每月 1 號是 星期幾 
  if ($first_day !=0){
    $first_day=7-$first_day+1;
  }else {$first_day=$first_day+1;}
  setcookie("new_day_1",$first_day,time()+7200);
  setcookie("new_day_2",$first_day+6,time()+7200);
  echo $first_day;
}else{
  $first_day = date('w', mktime(0, 0, 0,$month,1, $year));          
  if ($first_day !=0){
    $first_day=7-$first_day+1;           // 這個月的第一個星期天
  }else {$first_day=$first_day+1;}
  setcookie("new_day_1",$first_day,time()+7200);
  setcookie("new_day_2",$first_day+6,time()+7200);
  echo $first_day;
  //print_r ($_COOKIE);
}
 





?>
