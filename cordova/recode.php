<?php
header("Access-Control-Allow-Origin:*");   
include ("../config/mysql.php");

$password=$_POST['auth'];
$parameter=$_POST['parameter'];


$query = "select *  from tbl_user as a, tbl_device as b , tbl_train_data as c ";
$query.=" where a.id=b.creator and a.id=$parameter and b.deviceid=c.deviceid and a.password='$password'";
$result=mysql_query($query);
$i=0;
while ($row=mysql_fetch_array($result))
{ 
  if ( $row['lTotalTime'] !=''){
//  $return['id'][$i]=$row['c_id'];
  $return['lTotalDistance']+=$row['lTotalDistance'];
  $lTotalTime+=$row['lTotalTime'];
  $return['wCalory']+=$row['wCalory'];
  $return['wAscent']+=$row['wAscent'];
  $return['wDescen']+=$row['wDescent'];

  $i++;
  }
  //echo   $row[train_name];
} 
$return['lTotalTime']=change_time($lTotalTime);
$return['total_number']=$i;

if ($i==0){
  $return['total_number']=$i;
  $return['lTotalDistance']=0;
  $return['wCalory']=0;
  $return['wAscent']=0;
  $return['wDescen']=0;
  $return['lTotalTime']="0:0:0";

}

//$return['content']="<img src='http://malsup.github.io/images/p1.jpg'><img src='http://malsup.github.io/images/p2.jpg'>";


echo json_encode($return);



function change_time($time)
{
  // $time 是 0.1 s
  $hour=floor($time/36000);   
  $min= floor(($time- $hour*36000)/600);   
  $sec=floor(($time-$hour*36000-$min*600)/10);
  $total_time="$hour:$min:$sec"; 
  return $total_time;
}

?>
