<?php
header("Access-Control-Allow-Origin:*");   
include ("../config/mysql.php");

$user_id=$_POST['user_id'];
$password=$_POST['auth'];
$train_id=$_POST['parameter'];
$share=$_POST['share'];

$query = "select *,c.id as c_id from tbl_user as a, tbl_device as b , tbl_train_data as c ";
$query.=" where a.id=b.creator and c.id=$train_id and b.deviceid=c.deviceid and a.password='$password' ";
if ($share !=1)
{ 
  $query.=" and a.id='$user_id'";
}
$result=mysql_query($query);
while ($row=mysql_fetch_array($result))
{
  $dbname=$row['db_name'];
  $deviceid=$row['deviceid'];
}


// 這邊多做一件事情，要是沒有縮點資料，這邊可以做
$query="select * from tbl_planning_200_point where 200_for_point_id='$train_id'";  
$result_if = mysql_query($query);
if (mysql_num_rows($result_if)==0)      // 判定有沒有縮過點
{  
      $query="select UNIX_TIMESTAMP(a.start_time) as a_start_time,a.* from $dbname as a where train_data_key='$train_id' and latitude!=0 and longitude!=0";      // 經緯度為0 ，是為了208 特殊處理    
      $result_reduce = mysql_query($query);
      $i=0;     
      if (mysql_num_rows($result_reduce) >0)            // 因為濾掉  distance ==0 的點，所以有些測試用的數據，可能會完全沒數據
      {
        while ($row_reduce=mysql_fetch_array($result_reduce))
        {            
           $i++;      // key 比 no 多 1           
           $point[$i]=$row_reduce['latitude'];
           $point1[$i]=$row_reduce['longitude'];
           $no_array[$i]=$row_reduce['no'];           
           if($row_reduce['no']=='0'){$start_time=$row_reduce['a_start_time'];}
           if($row_reduce['no']=='1'){$end_time=$row_reduce['a_start_time'];}
           $end_time=$row_reduce['a_start_time'];         
           if($row_reduce['no']!='0'){ 
             $between_time[$i]=$end_time-$start_time;
             if ($between_time[$i] ==0){$between_time[$i] =100000000000000;}
             //if ($point[$i] == $last_lat and   $point[$i] == $last_lng )   // 這邊處理一下，要是前後兩點座標都相同，直接濾掉,這邊濾掉，不要從資料庫濾,目前去掉這個機制
             //{                
             //}           
           }
           $start_time=$end_time;
        }     
        unset ($row_reduce);
        include_once ("../php/reduce_point/reduce_1000_new1.php");          // 縮點
        reduce_200($point,$point1,1000,$dbname,$train_id,$no_array,$between_time);
        reduce_200($point,$point1,200,$dbname,$train_id,$no_array,$between_time);  
      }else{$no_data=true;}   
}





// change
//$query = "select *,c.id as c_id from tbl_user as a, tbl_device as b , tbl_train_data as c where a.id=b.creator and c.id=$train_id and b.deviceid=c.deviceid ";
$query="select * from $dbname as a ,tbl_reduce_1000_point as b where a.train_data_key='$train_id' and a.no=b.1000_for_point and b.1000_for_train='$train_id'";
$result=mysql_query($query);
$i=0;
while ($row=mysql_fetch_array($result))
{
  //$db_name=$row['db_name'];
  if ( $row['latitude'] !=''){
  $return['latitude'][$i]=$row['latitude'];
  $return['longitude'][$i]=$row['longitude'];
  $i++;
  }
}

echo json_encode($return);


?>
