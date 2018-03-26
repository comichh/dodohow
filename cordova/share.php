<?php
header("Access-Control-Allow-Origin:*");   
include ("../config/mysql.php");

$password=$_POST['auth'];
$user_id=$_POST['user_id'];

$lat=$_POST['lat'];
$lng=$_POST['lng'];
$address=$_POST['address'];
$distance=50;
//  參考 GetActivityByDistanceAndCenter.php
//  目前這兩個是分開的，分享的，還有自己的，目前是分開的，自己的沒有搜尋功能，所以是簡化過的。


// 先把紀錄存下來
$query ="update tbl_user set lastlat='$lat', lastlng='$lng',lastlocation='$address' where id='$user_id'";
$result=mysql_query($query);

//  做一下基礎驗證
$i=0;
if ($result)
{
//if ($show_status ==0){     // 訓練紀錄
// $query_1="select * from  tbl_device as b where b.creator='$id'";
//}else{   // 分享的
  $query_1="select * from tbl_train_data as a,tbl_device as b";
  $query_1.=" where  a.deviceid=b.deviceid  and  a.public_access=1 ";
  $query_1.=" group by b.deviceid  ";

//}
$result_1=mysql_query($query_1);

$accecpt=false;
while ($row_total=mysql_fetch_array($result_1))
{
  $sqlstr="select *,a.id as train_id,c.image as user_image,c.displayname as user_name ";
  $sqlstr.=" FROM tbl_train_data a ,tbl_device b , tbl_user c,tbl_device_model d,$row_total[db_name] e ";
  $sqlstr.=" WHERE a.deviceid = b.deviceid and   b.creator = c.id  and b.model = d.id   and e.train_data_key=a.id and e.no='0'";
  //if ($show_status ==0){
  //          $sqlstr.=" and c.id='$id'";
  //}else{
      $sqlstr.=" and  a.public_access=1 ";
  //}
  $result = mysql_query($sqlstr);

  while ($row=mysql_fetch_array($result))
  { 
   if ( $lat !=999){
     $dis=getDistance($row['latitude'],$row['longitude'],$lat,$lng);
   }else { $dis=0;}  
   if ( $row['train_name'] !='' and $dis<=$distance )
   {
     $post_datetime=$row['post_datetime'];
     $return['id'][$post_datetime]=$row['train_id'];
     $return['user_image'][$post_datetime]=$row['user_image'];
     $return['user_name'][$post_datetime]=$row['user_name'];
     $return['content'][$post_datetime]="$row[train_name]";
     $return['post_datetime'][$post_datetime]="$row[post_datetime]";
     $i++;     
   }
  } 
}
}

//echo $i;
if ($i==0)
{
  $return['result']=0;
}else{
  krsort($return['id']); 
  krsort($return['user_image']); 
  krsort($return['user_name']); 
  krsort($return['content']); 
  krsort($return['post_datetime']); 
  $return['result']='ok';
}

echo json_encode($return);






function getdistance($lat1,$lng1,$lat2,$lng2)//根據經緯度計算計離
{
                //將角度轉換為弧度
                $radLat1=deg2rad($lat1);
                $radLat2=deg2rad($lat2);
                $radLng1=deg2rad($lng1);
                $radLng2=deg2rad($lng2);
                $a=$radLat1-$radLat2;//兩緯度之差,緯度<90
                $b=$radLng1-$radLng2;//兩經度之差，精度<180
                //以下是根據google map的距離計算方式所換算出來的公式，
                //相關網站已經遺失..有找到在補上
                $distance=2*asin(sqrt(pow(sin($a/2),2)+cos($radLat1)*cos($radLat2)*pow(sin($b/2),2)))*6378.137;
                return $distance;
}


?>
