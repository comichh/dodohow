<?php
$lang_select=$_SESSION['Lang'];



if ($lang_select ==0){$lang_select='2';}

if ( $lang_select==1)
{
  include (dirname(__FILE__)."/../lang/tw.php");
}else{
  //echo "英文語系未完成";
  include (dirname(__FILE__)."/../lang/en.php");
}
?>
