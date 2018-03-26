<?php
 session_start() ;
include ("../config/mysql.php");
include ("../config/web.ini");
 include ("../function/database.php");
$userid=$_POST['userid'];
$email=$_POST['email'];
$name=$_POST['name'];
$pic=$_POST['pic'];
$device=$_POST['device'];


$query="select * from tbl_user where fb='$userid'";
$result=mysql_query($query) or die('error');
if (mysql_num_rows($result) ==0){        // 新註冊
  //$query="insert into tbl_user (fb,email,displayname,image) values ('$userid','$email','$name','$pic')";  
  $query="insert into tbl_user (fb,email,displayname) values ('$userid','$email','$name')"; 
  $result=mysql_query($query);
  $user_id=mysql_insert_id(); 
  if ($result)  
  {    
    $_SESSION['user_id']=$user_id;
    $_SESSION['UserImage']="origin.png"; 
    if ($device !='')      // 只有註冊 device這一段
     {  
       $return_value=create_database($device,$user_id,$work_path);
     } 
     if ($return_value == 'ok'){
        echo "ok";  
     }else {echo "error";}
    
  }else {echo "error";}
}else {         // 登入
 while ($row=mysql_fetch_array($result))
 { 
    $_SESSION['user_id']=$row['id'];
    $_SESSION['Lang']=$row['language'];
    $_SESSION['map']=$row['map'];
    $_SESSION['UserImage']=$row['image'];
    echo "ok";
 }
}  
  // 不管是新註冊，還是登入，都要走這段，會到這裡就已經是登入成功了，差在一些資料庫是否正常而已
  $_SESSION['auth']=true;   
  $_SESSION['displayname']=$name;
  $_SESSION['login_type']='fb';	

?>