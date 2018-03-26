<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");


$blacklist_id=$_POST['blacklist_id'];
$blacklist_descript=$_POST['blacklist_descript'];

//session_start() ;
$user_id=$_SESSION['user_id'];

$query="select * from tbl_user where displayname='$blacklist_id'";
$result=mysql_query($query);
$list_number=mysql_num_rows($result);
if ($result and $list_number==1)
{
  while ($row=mysql_fetch_array($result))
  {
    $blacklist_need_id=$row['id'];
  }
  $query_2="select * from tbl_blacklist where for_me_user_key='$user_id' and for_black_user_key='$blacklist_need_id'";
  $result2=mysql_query($query_2);
  $list_number2=mysql_num_rows($result2);
  if ( $list_number2==0){
    $query_key="(for_me_user_key,for_black_user_key,black_descript)";
    $query_value="('$user_id','$blacklist_need_id','$blacklist_descript')";
    $query1="insert into  tbl_blacklist $query_key values $query_value";

    $result1=mysql_query($query1);
    if ($result1)
    {   
      echo "ok";
    }else {echo $lang['database_error'];}
  }else{echo $lang['blacklist_ajax_3'];}
}else {
  echo $lang['blacklist_ajax_4'];
} 
















?>