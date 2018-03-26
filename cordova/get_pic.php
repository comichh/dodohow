<?php
header("Access-Control-Allow-Origin:*");   
include ("../config/mysql.php");

$parameter=$_POST['parameter'];

if ($parameter ==1)
{
$return['content']="<img src='http://malsup.github.io/images/p1.jpg'>";
}else{
$return['content']="<img src='http://malsup.github.io/images/p1.jpg'><img src='http://malsup.github.io/images/p2.jpg'>";
}

echo json_encode($return);


?>
