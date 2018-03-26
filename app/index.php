<?php
// ios 接收用
/*
先設置php.ini中的always_populate_raw_post_data值設為On,這樣表示可以接受data數據 。或者都用 php://input 收
*/
include ("../config/mysql.php");
include ("../config/web.ini");
include ("../function/database.php");
include  ("../config/lang_select.php");
/*
if (!empty($GLOBALS['HTTP_RAW_POST_DATA']))
{
  $command=isset($GLOBALS['HTTP_RAW_POST_DATA'])?$GLOBALS['HTTP_RAW_POST_DATA']:file_get_contents("php://input");
  $get_data = json_decode($command,TRUE);     //true, json  轉化成 array ，而非物件  
}
*/

$command=file_get_contents("php://input");
$get_data = json_decode($command,TRUE);      //true, json  轉化成 array ，而非物件  


//print_r ($_GET);
//echo "收到後，把收到的值，再轉成 json 回傳 <br>";     
echo json_encode($get_data);






// test  ，測試的時候，型號要改，資料比對的名稱也要改
/*
$get_data['email']="my mail";
$get_data['pm_passwd']='12345678';
$get_data['deviceid']="app_3";
$get_data['displayname']='tee';
*/

// 轉成我需要的資料
$final_return="ok";


print_r ($get_data);
$email=$get_data['mail'];
$pm_password=$get_data['password'];
$deviceid=$get_data['device_id'];

if ($email ==''){$final_return="no data";}



$displayname=$email;
$password=md5($pm_password);




// 程式開始

// 只是處理第一次帳號，密碼問題
$query="select * from tbl_user where email='$email'";
echo $query;
$result=mysql_query($query);
if ($result){
if (mysql_num_rows($result) ==0)        // 沒有這個使用者才新增
{ 
  $query_add="insert into tbl_user set email='$email',password='$password',pm_password='$pm_password',displayname='$displayname'";
 
  $result_add=mysql_query($query_add) ; 
  if ($result_add)
  {
    $creator=mysql_insert_id();
    $final_return=create_database($deviceid,$creator,$work_path);
  }else{
    echo "error"; 
    echo $query_add;
  }   
}else{  //  已經有 user, 但是換手機的時候，帳號 和 device 會對不起來
 while ($row=mysql_fetch_array($result))
 { 
    $creator=$row['id']; 
 }
 $query="select * from tbl_device where deviceid='$deviceid' and creator='$creator'";
 $result=mysql_query($query);
 if ($result)
 {
   if (mysql_num_rows($result) ==0)   // 換手機的時候。
   {
    $final_return=create_database($deviceid,$creator,$work_path);  
   }
 }   
}
}else {$final_return='資料庫讀取錯誤';}     // 資料庫檢查一次就好


$return['success']=$final_return;
echo json_encode($return);


//echo $final_return;





?>
