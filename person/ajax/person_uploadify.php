<?php
include ("../../config/web.ini");
session_id($_POST["session_id"]);         // 這個需要在 session start 前
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");
//include ("../../function/random.php");
//$random=generatorPassword();

//session_start() ;
$user_id=$_SESSION['user_id'];


if (!empty($_FILES)) 
{
 $file_name=$_FILES['Filedata']['name'];           // 我這邊沒有去變檔名
 $tempFile = $_FILES['Filedata']['tmp_name']; 
 $fileTypes = array('jpg','jpeg','gif','png'); // File extensions
 $fileParts = pathinfo($file_name); 
  // 還缺一個驗證檔案大小 ，暫時都不驗證  
  $file_name=preg_replace('/[^\w.][^\w.]*/','_', $file_name);        // 這邊多作一個保護，把雜七雜八的錯誤名稱，都變成_

  // 正式搬移到正式位置
  if (in_array($fileParts['extension'],$fileTypes)) {
    $query="select * from tbl_user where id='$user_id'";
    $result1=mysql_query($query);  
    $row=mysql_fetch_array($result1);
    $UserImage=$row['image'];
      
        if ( $UserImage != 'origin.png'){
          $targetFile= $work_path."/upload/user/".$UserImage;                            
          $result=shell_exec ("rm  $targetFile");             // 刪除檔案 
        }      
        //}else{
          $new_file_name=$user_id."_".$file_name;          // 這邊
          $targetFile= $work_path."/upload/user/".$new_file_name;       
          $query="update  tbl_user set image='$new_file_name'  where id='$user_id'";
          $result1=mysql_query($query);           
          $_SESSION['UserImage']=$new_file_name;            
        //}     
      move_uploaded_file($tempFile,$targetFile);     
  }else { 
    echo $lang['pic_ajax_error_2'];
  }

}






?>
