<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");
include ("../../function/sphere_distance.php");

$now_point=$_POST['now_point'];
$last_point=$_POST['last_point'];
$next_point=$_POST['next_point'];


$d1=get_dis($now_point,$last_point);
$d2=get_dis($now_point,$next_point);

$d=$d1+$d2;


echo $d;

?>
