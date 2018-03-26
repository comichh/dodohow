<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");

  $pic_id =$_POST['pic_id'];
  $pic_kill_path =$_POST['pic_kill_path'];
  $fileParts=pathinfo ($pic_kill_path);
  $pic_name= $fileParts['basename']; 

  $no_name=str_replace($pic_name ,'',$pic_kill_path) ;
  $no_name=$no_name."/thumbnail/".$pic_name;

  $query="delete from `tbl_pic`  WHERE `pic_id`='$pic_id'";
  $result=mysql_query($query);  

 if (result){  
  system ("rm ../$pic_kill_path",$status);  
  system ("rm ../$no_name",$status1);
  if ($status==0 and   $status1==0){
     echo "ok";
  }else {
     echo $lang['file kill error'];
  } 
 }else {echo $lang['database error'];}

//echo "錯誤，這邊抓不到最後的 pic_id";
//echo $query;
  

?>
