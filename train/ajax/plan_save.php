<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");

$login_user_id=$_SESSION['user_id'];
$train_id=$_GET['train_id'];



$query_check="select *  from tbl_planning where tain_planning='$train_id' and user_planning='$login_user_id'";
$result_check=mysql_query($query_check);
$check=mysql_num_rows($result_check);
if ($check==0)  // 不可重複儲存
{
$return[0]=$lang['save_ok'];
$query="select * from tbl_train_data as a,tbl_device as b  where a.id='$train_id' and a.deviceid=b.deviceid";
$result=mysql_query($query);
while ($row=mysql_fetch_array($result))
{
    $origin_user=$row['creator'];
    $train_name=$row['train_name'];
    $train_description=$row['train_description'];
    $lTotalDistance=$row['lTotalDistance'];
    $lTotalTime=$row['lTotalTime'];
    $cSport6=$row['cSport6'];
    $wAscent=$row['wAscent'];
    $slope=$row['slope'];
}
$t=time();
$pctool_planning_name=date("YmdHis",$t);

$query="insert into  tbl_planning "; 
$query.="(user_planning,tain_planning,origin_user,pctool_planning_name,web_planning_name,sport_type,train_description,lTotalTime,lTotalDistance,wAscent,slope) ";
$query.=" values ('$login_user_id','$train_id','$origin_user','$pctool_planning_name','$train_name','$cSport6','$train_description','$lTotalTime','$lTotalDistance','$wAscent','$slope' )";
$result=mysql_query($query);
}else {$return[0]=$lang['no_again_planning'];}

// 回傳最後的數據回去就好，不管有沒有點過，這邊一定對
$query_1="select *  from tbl_planning where tain_planning='$train_id'";
$result_1=mysql_query($query_1);
$total=mysql_num_rows($result_1);
$return[1]=$total;;
echo json_encode($return);



?>
