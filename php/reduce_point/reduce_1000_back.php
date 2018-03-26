<?php
$total_point=count ($point);

$R=6371000;
$pi=3.1415965;
$chenge_unit=$pi/180;

$max_point=$reduce_point['max_point'];                // 縮到幾點
$max_point=1000;

$need=array(); 
foreach($point  as $key => $value) {
   $new_point[$key][0]=$value*$chenge_unit;
   $new_point[$key][1]=$point1[$key]*$chenge_unit;
   array_push($need,$key);
}
$i=0;
while (count($need) >$max_point){    // 重複做
$lim_angle=$reduce_point['limit_angle']+$i*$reduce_point['limit_angle_add'];                // 限制角度，15 度開始
$lim_d=$reduce_point['limit_distance']+$i*$reduce_point['limit_distance_add'];              // 限制距離，25 m 開始  
$need=reduce($point,$new_point);
  foreach($point  as $key => $value) {
    if (!in_array($key,$need)){ unset ($point[$key]);  unset ($point1[$key]); }   
  }
  $i=$i+1;
}

// 最後結果
//echo json_encode($need,JSON_FORCE_OBJECT);
print_r ($need);        // 存需要的 key
//echo "<p>";
//print_r ($point);
//echo "<p>全部點".count($need);

//  存進資料庫
echo "3";
if ($dbname !='')
{
  $last_no=0;
  foreach($need  as $key => $value) 
  {  
    $no=$value-1; 
    //累積路程,先加總
    $query="select sum(distance)  from $dbname where train_data_key='$train_id' and no>'$last_no' and no <='$no'";
   // echo $query;
    $result= mysql_query($query) or die($query);
    while ($row=mysql_fetch_array($result))
    {
      
       $total_distance=$row[0];
    }        
    if ($total_distance ==''){$total_distance=0;} 
    $query_save="insert into tbl_reduce_1000_point  (1000_for_point,1000_for_train,total_distance)values ('$no','$trainID',$total_distance)";
    $result_save= mysql_query($query_save) or die($query_save);
    //if ($result_save){echo "正確";}else {echo "錯誤";}    
    $last_no=$no;
  }
}












function reduce($point,$new_point){
global $total_point;
global $max_point;
$need=array();                // 這種機制下，也不需要初始點了
$key1=1;
//print_r ($point);
foreach($point  as $key => $value) {
if ($key !='1' ){
  if ($check_point !=0){$key1=$key-1; }  
   // echo "<p>第 $key1-$key  點：";
//  if (count($need) <$max_point-1   ){
       $check_point=dis($key1,$key,$new_point);   
   //echo "check_result:".$check_point."\r\n";
    if ($check_point !=0){array_push($need,$key);}         // 取出需要的座標 !=0
//  }//else {//echo "大於";echo count($need);}
}

}
$tot=$total_point-1;               // 最後一點強迫加入
if (!in_array($point[$tot],$need ) ){array_push($need,$tot);  }
return $need;
//return  $check_point;
}





function dis($p1,$p2,$new_point)              // p1 , p2 只是  key , new_point是一個二維陣列，第一維是那一點，第二維是 經緯度 
{
// $new_point[1][0]    // 第一點緯度
// $new_point[1][1]    // 第一點經度
  global $R,$pi,$lim_d,$lim_angle,$d;
  //echo $p1.":".$p2.":".$new_point[$p1][1].":".$new_point[$p1][2]."<p>"  ;
  $sin_1_Longitude=sin($new_point[$p1][1]);    // sin （第一點經度）
  $cos_1_Longitude=cos($new_point[$p1][1]);    // cos （第一點經度）
  $sin_2_Longitude=sin($new_point[$p2][1]);    // sin （第二點經度）
  $cos_2_Longitude=cos($new_point[$p2][1]);    // cos  (第二點經度） 

  $delta_Longitude=$new_point[$p2][1]-$new_point[$p1][1];  
  $delta_Latitude= $new_point[$p2][0]-$new_point[$p1][0];    
  // 距離
  $d=$R*acos($sin_1_Longitude*$sin_2_Longitude+$cos_1_Longitude*$cos_2_Longitude*cos($delta_Latitude));
  //print_r ($new_point);
  //echo "距離:".$d."<p>--";
  // 角度
  $temp_an=$delta_Longitude*$cos_2_Longitude;
  if ($temp_an <0.00001){$temp_an =0.00001;}
  $angle=atan (0.99663 *$delta_Latitude/$temp_an);
  $angle=abs($angle)*180 /$pi;
  if ($d > $lim_d*2 and $lim_angle> $lim_angle*0.5 ){return 1;}    // 距離夠長，角度不要太小，接受
  if ($angle < $lim_angle   ){return 0;}
  if ($d < $lim_d ){return 0;}  
  return 1; 
}




?>
