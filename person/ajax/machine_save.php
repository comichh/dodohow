<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");

$ff_value=$_POST['ff_value'];
$ff_name=$_POST['ff_name'];


$i=0;
$j=0;
foreach($ff_value as $key => $value)
{
   $i++;
   $temp_array=explode ("_",$ff_name[$key]);
   $id= $temp_array[2];
   $query="update  tbl_device  set displayname='$value' where  id='$id'";
   $result=mysql_query($query);  
   if ($result){$j++;}
}
if ($i == $j){echo "save";}else {echo "error";}


?>
