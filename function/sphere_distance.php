<?php
/* 測試數據  ，ok 可以用
$point1[0]="41.85499";
$point1[1]="-87.65756";
$point2[0]="41.85611";
$point2[1]="-87.65758";
*/

/*
point1[0]   // 第一點緯度
point1[1]   // 第一點經度
point2[0]   // 第二點緯度
point2[1]   // 第二點經度
*/

// 距離小時，這個會比較準，所以改用這個
//在兩點之間的大圓距離相對球體的半徑很短時，其圓心角很小，餘弦函數接近於1，按照反餘弦函數公式會有較大的舍入誤差。
// 此時可使用半正矢函數的定義和兩角和的餘弦函數展開式求出使用半正矢函數計算大圓距離的公式。
function get_dis($point,$point1)
{
     $lat1=$point[0];
     $lng1=$point[1];
     $lat2=$point1[0];
     $lng2=$point1[1];
               
		//將角度轉換為弧度
		$radLat1=deg2rad($lat1);
		$radLat2=deg2rad($lat2);
		$radLng1=deg2rad($lng1);
		$radLng2=deg2rad($lng2);
		$a=$radLat1-$radLat2;//兩緯度之差,緯度<90
		$b=$radLng1-$radLng2;//兩經度之差，精度<180
		$distance=2*asin(sqrt(pow(sin($a/2),2)+cos($radLat1)*cos($radLat2)*pow(sin($b/2),2)))*6371000;
		return $distance;
}



// 這個距離小時，誤差真的有點大，放棄這個
function sphere_distance($point1,$point2)   
{
$R=6371000;
$pi=3.1415965;
$change_unit=$pi/180;

foreach($point1  as $key => $value) {
  $point1[0]=$point1[$key]*$change_unit;
  $point2[0]=$point2[$key]*$change_unit; 
}


$sin_1_Longitude=sin($point1[1]);    // sin （第一點經度）
$cos_1_Longitude=cos($point1[1]);    // cos （第一點經度）
$sin_2_Longitude=sin($point2[1]);    // sin （第二點經度）
$cos_2_Longitude=cos($point2[1]);    // cos  (第二點經度） 

$delta_Longitude=$point2[1]-$point1[1];  
$delta_Latitude= $point2[0]-$point1[0];   

$d=$R*acos($sin_1_Longitude*$sin_2_Longitude+$cos_1_Longitude*$cos_2_Longitude*cos($delta_Latitude));
return $d;
}


?>
