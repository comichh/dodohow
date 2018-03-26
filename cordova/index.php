<?php
header("Access-Control-Allow-Origin:*");   
include ("../config/mysql.php");

$email=$_POST['email'];
if ($_POST['password'] !=''){
 $password=md5($_POST['password']);
}

$query="select * from tbl_user  where email='$email' and password='$password' ";
$result=mysql_query($query);
//echo $query;
$num=mysql_num_rows($result);
if ( $num ==1)
{
   $return['result']='ok'; 
   while ($row=mysql_fetch_array($result))
   {
     $return['auth']=$row['password'];
     $return['user_id']=$row['id'];      
   }
 
}else{
  $return['result']='password is error';  
  $return['auth']=false;
}




echo json_encode($return);


?>
