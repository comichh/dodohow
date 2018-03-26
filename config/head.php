<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd" >
<head>
<meta http-equiv="X-UA-Compatible" content="IE=EDGE">
<meta http-equiv='Content-Type' content='text/html'; charset='utf-8'>
<meta name='keywords' content='sport4u.pro'>
<meta name='description' content='sport4u.pro'>
<meta http-equiv='expires' content='-1'>
<meta name='robots' content='index,follow'>
<meta name='generator' content='sport4u.pro'>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
<title>sport4u</title>

<?php
include_once (dirname(__FILE__)."/web.ini");
include_once (dirname(__FILE__)."/../auth.php");
include_once (dirname(__FILE__)."/lang_select.php");
include_once (dirname(__FILE__)."/parameter.ini");
include_once (dirname(__FILE__)."/mysql.php");
include_once (dirname(__FILE__)."/../function/check_input.php");


echo "<link href='$work_web/_css/style.css' rel='stylesheet' type='text/css'/>";
echo "<script type='text/javascript'  src='$work_web/jquery/1.11.1.min.js'></script>";
echo "</head>";


if ($navigation ==true){
  include (dirname(__FILE__)."/navigation.php");
}


?>
