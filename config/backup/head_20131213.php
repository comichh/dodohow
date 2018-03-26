<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 4.01 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<?php
include (dirname(__FILE__)."/web.ini");
include (dirname(__FILE__)."/lang_select.php");

$main=$lang['SEO']['main'];
$main_descript=$lang['SEO']['main_descript'];

$web_head="<meta name='keywords' content='".$main."'>";
$web_head.="<meta name='description' content='".$main_descript."'>";
$web_head.="<html xmlns='http://www.w3.org/1999/xhtml' lang='".$lang_select."'>";
$web_head.="<head>";
$web_head.="<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>";
$web_head.="<meta name='robots' content='index,follow'>";
$web_head.="<meta name='generator' content='dodohow'>";

$web_title=$lang['index']['title'];


if ($sub_title!=''){$sub_title=$lang[$match[2]]."-";}
$web_sht="<title>".$sub_title.$web_title."</title>";

echo $web_head;


echo "<link rel=stylesheet type='text/css' href='".$work_web."/style.css'>";
//echo "<link rel=stylesheet type='text/css' href='".$work_web."/jquery/1.8.3.js'>";
//echo "<srtipt type='text/javascript' src='".$work_web."/jquery/ui/bootstrap-2.3.2/docs/assets/js/jquery.js'>";
//echo "<script src='https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false'></script>";




echo "</head></body>";


	






?>
