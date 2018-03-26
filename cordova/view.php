<?php
header("Access-Control-Allow-Origin:*");   
include ("../config/mysql.php");

$user_id=$_POST['user_id'];
$password=$_POST['auth'];
$now_year=$_POST['now_year'];
$now_year_next=$now_year+1;
$regex="$now_year-([0-9]{2})-.*";

// change
$query = "select *,c.id as c_id from tbl_user as a, tbl_device as b , tbl_train_data as c ";
$query.=" where a.id=b.creator  and b.deviceid=c.deviceid and a.password='$password' ";
$query.=" and a.id='$user_id' and `Start_time`>'$now_year' and `Start_time` <'$now_year_next'";

$result=mysql_query($query);
init();
while ($row=mysql_fetch_array($result))
{
  //$db_name=$row['db_name']; 
            
    if(preg_match("/$regex/",$row['Start_time'],$match_2))
    {     
      month_match($match_2[1],$row);         // 目的，若是搜 2013 - 2014，我需要分辨那些是  1 月，2 月 .. 的資料
    }                                
  
}

//print_r ($return['lTotalDistance_1'] );
$new_sql['lTotalDistance_1']=array();
$new_sql['wCalory_1']=array();
foreach ($return['lTotalDistance_1'] as $key => $value ) 
{  
  array_push($new_sql['lTotalDistance_1'],$value);             // json 無法對 key 排序，所以就不要给他 key
  array_push($new_sql['wCalory_1'],$return['wCalory_1'][$key]);   
}
echo json_encode($new_sql);

// 初始化
function init()
{
global $return;
for ($i=1;$i<13;$i++)
{
   if ($i<10){$j="0".$i;}else {$j=$i;}
  $return['lTotalDistance_1'][$j]=0;
  $return['wCalory_1'][$j]=0;  
}
}



// 共用函數
function month_match($key,$row)
{
  global $return;
   $return['lTotalDistance_1'][$key] +=$row['lTotalDistance']/1000;      // 用公尺
   $return['wCalory_1'][$key] +=$row['wCalory'];  
}





?>
