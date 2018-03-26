<?php
$total_point=count ($point);
$R=6371000;
$pi=3.1415965;
$chenge_unit=$pi/180;
$lim_angle=5;           // 限制角度，5 度開始
$lim_d=25;              // 限制距離，25 m 開始
$lim_angle_add=1;       // 每次增加角度 1
$lim_d_add=20;          // 每次增加距離 20 m 
            

function reduce_200($point,$point1,$max_point,$dbname,$train_id,$no_array,$between_time) 
{
global $total_point;
global $R,$pi, $lim_angle,$lim_d;
global $chenge_unit;
global $lim_angle_add;
global $lim_d_add;
global $deviceid;

$need=array(); 
foreach($point  as $key => $value) {
   $new_point[$key][0]=$value*$chenge_unit;
   $new_point[$key][1]=$point1[$key]*$chenge_unit;
   array_push($need,$key);
}
// 要先判定  device id
if (preg_match('/^GH208gRun/',$deviceid))
//if (preg_match('/^gsgh-625xt/',$deviceid))
{
  // 我要檢查
  foreach($point  as $key => $value) 
  {
    if ($key!=1){      // 我也是去掉第一點        
      $account_dis=round(count_dis($key-1,$key,$new_point)*100);
      // 寫入資料庫 ，key=2, no=1
      $need_no=$key-1;
      $query="update $dbname set distance='$account_dis' where train_data_key='$train_id' and no='$need_no'";  
      $result= mysql_query($query) or die($query);
      //echo $query."<br>";
      // 哪一點速度，計算時間。
      $speed_no=$key-1;      // 不去管第一點。
      //$speed=$account_dis*3.6/$between_time;
      //echo $between_time[$key]."<br>";
      $speed=$account_dis*3.6/$between_time[$key];
      $query="update $dbname set speed='$speed' where train_data_key='$train_id' and no='$speed_no'";  
      $result= mysql_query($query) or die($query);  
      //echo $query."<br>";
   }  
 }
}
$i=0;
while (count($need) > $max_point){                // 點數太多時，把條件調嚴格
  $lim_angle=$lim_angle+$i*$lim_angle_add;                
  $lim_d=$lim_d+$i*$lim_d_add; 
  $need=reduce($point,$new_point, $max_point);
  foreach($point  as $key => $value) {
    if (!in_array($key,$need)){ unset ($point[$key]);  unset ($point1[$key]); }   
  }
  $i=$i+1;
}


// 最後結果
//print_r ($need);        // 存需要的 key
//print_r ($point);
//echo "<p>全部點".count($need);
//echo "最後的角度".$lim_angle."<br>";


//  存進資料庫
if ($max_point ==1000)       // 1000 點
{
  $last_no=0;
  foreach($need  as $key => $value) 
  {  
    //$no=$value-1; 
    $no=$no_array[$value];
    //echo $no."-".$total_distance."<br>";
    //累積路程,先加總 ，我這邊還是相信他計算的，  這邊改成，自己計算距離。
    $query="select sum(distance)  from $dbname where train_data_key='$train_id' and no>'$last_no' and no <='$no'";
    $result= mysql_query($query) or die($query);
    while ($row=mysql_fetch_array($result))
    {      
       $total_distance=$row[0];
    }        
    if ($total_distance ==''){$total_distance=0;} 
    $query_save="insert into tbl_reduce_1000_point  (1000_for_point,1000_for_train,total_distance)values ('$no','$train_id',$total_distance)";
    $result_save= mysql_query($query_save) or die($query_save);
    $last_no=$no;
  }
}else {                //  200 點 plan 
  foreach($need  as $key => $value) 
  {         
     $query_save="insert into tbl_planning_200_point (200_for_point_id,200_latitude,200_longitude)";
     $query_save.=" values ('$train_id','$point[$value]',$point1[$value])";
     $result_save= mysql_query($query_save) or die($query_save);
  }
}


}









function reduce($point,$new_point, $max_point){
global $total_point;
global $R,$pi,$lim_d,$lim_angle,$d;

$need=array();                
$need[0]=1;           // 第一點強迫取
$key1=1;
$i=0;
$now_total_point=count ($point);

foreach($point  as $key => $value) {
if ($key !='1' ){
  if ($check_point !=0){$key1=$key-1; }  
   $i=$i+1;
   $now_point=$now_total_point-$i+count($need);
 // echo "<p>第 $key1-$key  點：".$now_point ;;
   if ( $now_point > $max_point-1   )            // 點數夠少後，就不要在縮點了，後面全取 ，-1 最後那點
   {
     $check_point=dis($key1,$key,$new_point);      
     if ($check_point !=0){array_push($need,$key);}         // 取出需要的座標 
   }else{
      array_push($need,$key);
   }
 // echo "目前點數".count($need)."<br>";  
}

}

$tot=$total_point-1;               // 最後一點強迫加入
if (!in_array($point[$tot],$need ) ){array_push($need,$tot);  }
  return $need;
}


function count_dis($p1,$p2,$new_point)
{
  global $R,$pi,$lim_d,$lim_angle,$d,$angle;
  //global $delta_Longitude,$cos_2_Longitude,$delta_Latitude;
  $sin_1_Longitude=sin($new_point[$p1][1]);    // sin （第一點經度）
  $cos_1_Longitude=cos($new_point[$p1][1]);    // cos （第一點經度）
  $sin_2_Longitude=sin($new_point[$p2][1]);    // sin （第二點經度）
  $cos_2_Longitude=cos($new_point[$p2][1]);    // cos  (第二點經度） 

  $delta_Longitude=$new_point[$p2][1]-$new_point[$p1][1];  
  $delta_Latitude= $new_point[$p2][0]-$new_point[$p1][0];    
  // 距離
  $d=$R*acos($sin_1_Longitude*$sin_2_Longitude+$cos_1_Longitude*$cos_2_Longitude*cos($delta_Latitude));
  // 角度
  $temp_an=$delta_Longitude*$cos_2_Longitude;
  if ($temp_an <0.00001){$temp_an =0.00001;}
  $angle=atan (0.99663 *$delta_Latitude/$temp_an);
  $angle=abs($angle)*180 /$pi;
  //echo "原來距離".$d."---角度：".$angle."<br>";   
  return $d;
}


function dis($p1,$p2,$new_point)              // p1 , p2 只是代表第幾點的 key , new_point是一個二維陣列，第一維是那一點，第二維是 經緯度 
{
  global $R,$pi,$lim_d,$lim_angle,$d,$angle;
  //global $delta_Longitude,$cos_2_Longitude,$delta_Latitude;
  $d=count_dis($p1,$p2,$new_point);
 
  if ($d > $lim_d and $angle> $lim_angle*0.5 ){return 1;}    // 距離夠長，角度不要太小，接受
  if ($angle < $lim_angle   ){return 0;}
  if ($d < $lim_d ){return 0;}
  return 1; 
}




?>
