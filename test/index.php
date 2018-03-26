<?php
header("Access-Control-Allow-Origin:*");   
include ("../config/mysql.php");
include ("../config/web.ini");
include ("../function/database.php");
include  ("../config/lang_select.php");

//$command=file_get_contents("php://input");
$command=$_POST['a'];
//print_r ($_POST);
//echo $command;

//$get_data = json_decode($command,TRUE);      //true, json  轉化成 array ，而非物件  
//echo $get_data;


//echo json_encode($get_data);

$test['a']="<img src='http://malsup.github.io/images/p1.jpg'><img src='http://malsup.github.io/images/p2.jpg'>";

echo json_encode($test);


?>
