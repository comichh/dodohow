<?php
$navigation=false;
$no_check=true;
include ("../config/head.php");
include ("../function/slope_difficulty.php"); 
$map_config=$_SESSION['map'];

?>
<link rel="stylesheet" type="text/css" href="../lib/easyui/css/easyui.css">
<link rel="stylesheet" type="text/css" href="../lib/easyui/css/icon.css">
<link rel="stylesheet" type="text/css" href="../lib/easyui/css/demo.css">
<link rel="stylesheet" type="text/css" href="../_css/train_detail.css"> 


<?php 
if ($map_config==1){  
  echo '<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=geometry"></script>';
}else{ 
  echo '<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.5&ak=rHvlawvttpb6EzXsUskGh6f6"></script>';
  echo '<script type="text/javascript" src="http://developer.baidu.com/map/jsdemo/demo/changeMore.js"></script>';
  //echo "<script src='js/new_baidu.js'></script>";
}
?>
<script type="text/javascript" src="../lib/Highstock-2.0.1/js/highstock.js"></script>
<script type="text/javascript" src="../lib/Highstock-2.0.1/js/modules/exporting.js"></script>
<script type="text/javascript" src="../lib/Highstock-2.0.1/js/highcharts-3d.js"></script>
<script type="text/javascript" src="../lib/Highcharts-4.0.1/js/highcharts-more.js"></script>
<script type="text/javascript" src="../lib/easyui/easyui.js"></script>

<?php
$no_data=false;
if ($_SESSION['user_id']!=''){
  $login_user_id=$_SESSION['user_id'];
}else{
  $login_user_id='null';
}     
$train_id=$_GET['train_id'];                       
$URL = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];

// 驗證進入權限
$page_auth=false;
$query1="select * from tbl_train_data where public_access='1' and  id='$train_id'" ;
$result1=mysql_query($query1);   
if (mysql_num_rows($result1) == 1){
  $page_auth=ture;           // 願意分享的紀錄  
  $share_auth=ture;          // 用來判斷要不要秀分享按鍵
}else{
  $query="select * from tbl_user as a,tbl_train_data as b,tbl_device as c ";
  $query.="where a.id='$login_user_id' and b.deviceid=c.deviceid and c.creator=a.id and b.id='$train_id'";
  $result=mysql_query($query);
  if (mysql_num_rows($result) ==1)
  {
    $page_auth=ture;           // 這筆紀錄的擁有者 
  }
}
 

if ($page_auth==ture){
$praise_count=search_data(tbl_praise,$train_id,praise_train_key );   //讚
$comment_count=search_data(tbl_comment,$train_id,for_train_id);
$planning_count=search_data(tbl_planning,$train_id,tain_planning);     //  收藏數
// 總訓練紀錄
$query="select *,c.id as c_id from tbl_train_data as a,tbl_device as b,tbl_user as c";
$query.=" where a.id='$train_id' and a.deviceid=b.deviceid and b.creator=c.id";
$result=mysql_query($query);
$i=0;
while ($row_total=mysql_fetch_array($result))
{
  $lTotalDistance=$row_total['lTotalDistance']/1000;       // 這個應該是 m
  $wAscent=$row_total['wAscent']/1000;                     // 爬升高度，這個是為了計算難度用
  $lTotalTime=$row_total['lTotalTime'];                    // 這個應該是 0.1s
  $cSport6=$row_total['cSport6'];                          // 運動類別 0,1:跑步，2 騎腳踏車
  if ($row_total['train_name'] !=''){$train_name=$row_total['train_name'];}else {  $train_name =$lang['no_title'];} 
  $train_description=$row_total['train_description'];
  $weather=$row_total['weather'];
  // 第一張表格的數據
  $slq_table_1[$i]['lMaxSpeed']=$row_total['lMaxSpeed']/100;     //  最後 Km/Hr ，原來單位？
  $slq_table_1[$i]['wBestCadns']=$row_total['wBestCadns'];
  $slq_table_1[$i]['wAvgCadns']=$row_total['wAvgCadns'];
  $slq_table_1[$i]['cMaxHeart']=$row_total['cMaxHeart'];
  $slq_table_1[$i]['cAvgHeart']=$row_total['cAvgHeart'];
  $slq_table_1[$i]['wMaxPower']=$row_total['wMaxPower'];
  $slq_table_1[$i]['wAvgPower']=$row_total['wAvgPower'];
  $slq_table_1[$i]['wCalory']=$row_total['wCalory'];
  $slq_table_1[$i]['wAscent']=$row_total['wAscent'];
  $slq_table_1[$i]['wDescent']=$row_total['wDescent'];
  $slq_table_1[$i]['ave_speed']=round ($lTotalDistance*3600*10/$lTotalTime,2);
  $deviceid=$row_total['deviceid'];
  $i++;
  if ($weather !=0){
    $weather_pic="<img style='width:50px' src='../pic/person/weather_$weather.png'>";
  }else {
    $weather_pic="<img style='width:50px' src='../pic/person/weather_1.png'>";
  }
  $train_own_id=$row_total['c_id'];                           // 紀錄擁有者
  $fullname=$row_total['displayname'];                        // 顯示名稱   
  $images="../upload/user/".$row_total['image'];              // 大頭照   
  $dbname=$row_total['db_name']; 
}
unset ($row_total);



// 把心跳隨年齡的數據也帶出來
$heart_array[0]['heart_a_min']=0;
$heart_array[0]['heart_a_max']=120; 
$heart_array[0]['heart_b_max']=140; 
$heart_array[0]['heart_c_max']=160; 
$heart_array[0]['heart_d_max']=180; 
$heart_array[0]['heart_e_max']=180; 
$query="select * from tbl_user where  id='$login_user_id'";
$result=mysql_query($query);
if (mysql_num_rows($result) !=0){
  while ($row_total=mysql_fetch_array($result))
  {
    if ($row_total['heart_a_max'] !=0){          // 心跳數據，沒有設定，沒有登入，都是走預設值
      $heart_array[0]['heart_a_max']=$row_total['heart_a_max'];
      $heart_array[0]['heart_b_max']=$row_total['heart_b_max'];
      $heart_array[0]['heart_c_max']=$row_total['heart_c_max'];
      $heart_array[0]['heart_d_max']=$row_total['heart_d_max'];
      $heart_array[0]['heart_e_max']=$row_total['heart_e_max'];
    }
  } 
}

// 重新調整單位，和數據
$total_dis=$lTotalDistance."km";
$total_time=date('H:i:s',$lTotalTime/10- 28800 );
if ($cSport6==2)  // 預設是跑步好了，1 跑步。2腳踏車
{
  $sport_pic='../pic/train_detail/type_biking_1.png';
  }else {$sport_pic='../pic/train_detail/type_running_1.png';
}
$slope_pic=slope_difficulty ($lTotalDistance,$wAscent,$http_path);


// 進來第一次，資料庫存縮點資料 ，同時存  200 點和 1000 點

$query="select * from tbl_planning_200_point where 200_for_point_id='$train_id'";  
$result_if = mysql_query($query);
if (mysql_num_rows($result_if)==0)      // 判定有沒有縮過點
{   
      //$query="select UNIX_TIMESTAMP(a.start_time) as a_start_time,a.* from $dbname as a where train_data_key='$train_id' and distance!='0' and latitude!=0 and longitude!=0";      // 直接過濾掉座標沒有動的點,這樣會把第一點濾掉。
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
           //  這邊去掉我不要的點 
           //$last_lat=$point[$i];
           //$last_lng=$point1[$i];
        }     
        unset ($row_reduce);
        include_once ("$work_path/php/reduce_point/reduce_1000_new1.php");          // 縮點
        reduce_200($point,$point1,1000,$dbname,$train_id,$no_array,$between_time);
        reduce_200($point,$point1,200,$dbname,$train_id,$no_array,$between_time);  
      }else{$no_data=true;}    
}
unset ($point);



// 要不要使用縮點資料 ，有修過，目前預設進來就縮點 
//if ($_GET['reduce'] ==1){
//$URL=str_replace("&reduce=1","",$URL);
//$query="select * from gsgh_625xt12W32A0000021 as a,tbl_reduce_1000_point as b where a.train_data_key='110' and b.1000_for_train='110'  and a.no=b.1000_for_point";
// b.total_distance !='0' and
$query="select * from $dbname as a,tbl_reduce_1000_point as b where  ";
$query.="a.train_data_key='$train_id' and b.1000_for_train='$train_id' and a.no=b.1000_for_point";
$result=mysql_query($query);
$i=0;
$power_if=false;
while ($row=mysql_fetch_array($result))
{
  $sql_array[$i]['latitude']=(Double)$row['latitude'];    // 經度
  $sql_array[$i]['longitude']=(Double)$row['longitude'];  // 緯度
  $sql_array[$i]['altitude']=(Double)$row['altitude'];    // 高度     
  $sql_array[$i]['speed']=(Double)$row['speed']/100 ;          // 速率  , 應該是 100* km /hr 
  $sql_array[$i]['heart_rate']=(Double)$row['heart_rate'];    // 心跳
  $sql_array[$i]['cadence']=(Double)$row['cadence'];      // 踏頻
  $sql_array[$i]['power']=(Double)$row['power'];          // 功率
  if ( $sql_array[$i]['power'] !=0){$power_if=true;}   // 用來判斷功率是否都為 0
  $sql_array[$i]['start_time']=$row['start_time'];    //  那一點的時間
  $distance=$distance+ $row['total_distance'];        //  因為是讀縮點資料，所以用的是 total_distance , 
  $sql_array[$i]['distance']=(Double)$distance/100000;        // 累計距離 ，機器過來的是 cm ，給圖表秀使用， 
  // 這兩個現在沒數據,都先用0
  $sql_array[$i]['temperature']='0';       // 溫度
  $sql_array[$i]['slope']='0';             // 坡度
  $i++; 
}
/* 
}else {
// 細部資料  , 不縮點
$URL=str_replace("&reduce=0","",$URL);
$query="select * from $dbname  where train_data_key='$train_id'";
$result=mysql_query($query);
$i=0;
while ($row=mysql_fetch_array($result))
{
  $sql_array[$i]['latitude']=$row['latitude'];    // 經度
  $sql_array[$i]['longitude']=$row['longitude'];  // 緯度
  $sql_array[$i]['altitude']=$row['altitude']/1000;    // 高度
  $sql_array[$i]['speed']=$row['speed']/100 ;          // 速率  , 應該是 cm /hr ?
  $sql_array[$i]['heart_rate']=$row['heart_rate'];    // 心跳
  $sql_array[$i]['cadence']=$row['cadence'];      // 踏頻
  $sql_array[$i]['power']=$row['power'];          // 功率
  $sql_array[$i]['start_time']=$row['start_time'];    //  那一點的時間
  $distance=$distance+ $row['distance'];
  $sql_array[$i]['distance']=$distance/100000;        // 累計距離 ，機器過來的 好像是 cm 
  $sql_array[$i]['start_time']=$row['start_time'];    //  那一點時間 
  // 這兩個現在沒數據,都先用0
  $sql_array[$i]['temperature']='0';       // 溫度
  $sql_array[$i]['slope']='0';             // 坡度
  $i++;  
}
}
// 縮點資料判斷 end 
*/


// 圈數資料 ，第二張表格使用，沒有設定 lap 好像不會有值? 目前看到是空的
$query2="select * from tbl_lap_data  where train_data_key='$train_id'";
$result2 = mysql_query($query2);
$total_num=mysql_num_rows($result2);
$query="select * from tbl_lap_data  where train_data_key='$train_id' limit 0,$total_num";   // 去除第一筆，第一筆有時候會錯
//$query="select * from tbl_lap_data  where train_data_key='$train_id'";   // 去除第一筆，怪怪的為何第一筆會是那樣
$result=mysql_query($query);
$i=0;
while ($row=mysql_fetch_array($result))
{
  $lap_array[$i]['start_time']=(Double)$row['start_time'];    
  $lap_array[$i]['lap_no']=(Double)$row['lap_no'];  
  $lap_array[$i]['total_time']=date('H:i:s',$row['total_time']/10- 28800 ) ;  
  $lap_array[$i]['total_distance']=(Double)$row['total_distance']/1000;
  $lap_array[$i]['ave_speed']=round ($lap_array[$i]['total_distance']*3600*10/$row['total_time'],2);  
  $lap_array[$i]['calory']=(Double)$row['calory'];              // 單位是 千卡
  $lap_array[$i]['avg_heart']=(Double)$row['avg_heart'];  
  $lap_array[$i]['max_alt']=(Double)$row['max_alt']/1000;  
  $lap_array[$i]['avg_cadns']=(Double)$row['avg_cadns']; 
  // 這邊作一下過濾，要是點的地方，功率都為 0 ，這邊就不允許值。
  if ( $power_if==true){
    $lap_array[$i]['avg_power']=$row['avg_power'];
  }else{ 
    $lap_array[$i]['avg_power']=0;
  } 
  $i++;   
}

// 圖片資料
$j=0;
$query_pic="select * from tbl_pic  where pic_train_key='$train_id' and pic_lat !='999'";
$result_pic=mysql_query($query_pic);
if (mysql_num_rows($result_pic) > 0)
{
  while ($row=mysql_fetch_array($result_pic))
  {
    $sql_pic_array[$j]['pic_lat']=$row['pic_lat'];      //  pic 經度
    $sql_pic_array[$j]['pic_lng']=$row['pic_lng'];      //  pic 緯度
    $sql_pic_array[$j]['pic_name']=$row['pic_name'];    //  pic 檔名       
    $j++  ;                                           
  }
}



$heart_json=json_encode($heart_array);   
$sql_json= json_encode($sql_array);
$sql_pic_json= json_encode($sql_pic_array);
$lap_json= json_encode($lap_array);
$slq_table_1_json= json_encode($slq_table_1);
$to_js="<script type='text/javascript'>";
$to_js.="var beaches=$sql_json; var beaches_lap=$lap_json ; var train_id=$train_id;var heart_array='$heart_json';";
$to_js.="var slq_table_1=$slq_table_1_json;";
$to_js.="var train_own_id='$train_own_id';";       // 紀錄擁有者
$to_js.="var beaches_pic=$sql_pic_json;";
$to_js.="var user_id='$login_user_id';";           //  js 部分有檢查是否是 user
$to_js.="</script>";
echo $to_js;             //傳遞參數給 js


}else {
  header("Location:$work_web/no_access.php");  
}

function search_data($tbl_name,$train_id,$col_name ){
  $totalCount=0;
  $query="select count(*) as totalCount  from $tbl_name where $col_name='$train_id'";
  $result=mysql_query($query);
	$row= mysql_fetch_array($result);
	$totalCount=$row['totalCount'];
  return $totalCount;
}

//  下面 js 不能搬，因為我要先傳遞參數過去
?>
<link rel='stylesheet' type='text/css' media='all' href='../jquery/ui/jquery_ui/jquery-ui_1.10.4.css' /> 
<script type="text/javascript">
  var train_time='<?php echo $lang['train_time']?>';
  var train_distance='<?php echo $lang['train_distance']?>';   
  var lang_altitude='<?php echo $lang['altitude']?>';
  var lang_speed='<?php echo $lang['speed']?>';   
  var lang_heart_rate='<?php echo $lang['heart_rate']?>'; 
  var lang_cadence='<?php echo $lang['cadence']?>';   
  var lang_power='<?php echo $lang['power']?>'; 
  var lang_pic_info='<?php echo $lang['pic_information']?>'; 
  var lang_heart_rate_unit='<?php echo $lang['heart_rate_unit']?>'; 
  var lang_not_user='<?php echo $lang['not_user']?>'; 
  var map_config='<?php echo $map_config ?>'; 

</script>
<script type="text/javascript" src='js/train_detail.js'></script>
<?php
if ($map_config==1){  
  echo "<script type='text/javascript' src='js/google_map.js'></script>";
}else{
  echo "<script type='text/javascript' src='js/baidu_map.js'></script>";
}
?>
<script type="text/javascript" src='js/train_detail_highchart.js'></script>
<script type="text/javascript" src='js/gauge_chart.js'></script>
<script type="text/javascript" src="../jquery/ui/jquery_ui/jquery-ui_1.10.4.js"></script>

<?php if ($no_data !=true){ ?>
<html><body>
<div id='top_background_line1'></div>
  <!-- 選單列 -->
<div id='top_head'>
  <div><a  href='../index.php'><img src='../pic/train_detail/logo_140x40.png'/></a></div>
  <div><img class='top_head_left_img' src='<?php echo $sport_pic?>'/></div>
  <div><img class='top_head_left_img' src='<?php echo $images; ?>'/></div>  
  <div class='top_head_left' ><?php echo $fullname; ?></div>
  <div class='top_head_left' ><?php echo $train_name;  ?></div> 
  <div class='top_head_left' ><?php echo $weather_pic;  ?></div> 
  <!-- 這邊治右 -->
  <div id='top_head_right'>    
    <!--
    <div><a class='test_1' href='<?php echo $URL;?>&reduce=1'>縮點 |</a></div>
    <div><a class='test_1' href='<?php echo $URL;?>&reduce=0'>不縮點 |</a></div>
    -->
  <?php 
    echo "<div>$lang[total_time]:$total_time | </div>";
    echo "<div>$lang[total_distance]:$total_dis | </div>";
    echo "<div>$lang[SectionsDifficulty]:$slope_pic | </div>";  
    echo "<a id='plan_save' title='$lang[planning]' href='#'><img  src='../pic/train_detail/plan_save.png'/></a><div id='plan_save_update'>$planning_count | </div>";
    echo "<a id='praise_save' title='$lang[praise]' href='#'><img style='width:20px;height:15px' src='../pic/train_detail/like_1.png'/></a> <div id='praise_save_update'> $praise_count  | </div>";
    echo "<a  title='$lang[comment]' href='comment.php?train_id=$train_id' target='_blank'><img  src='../pic/train_detail/comment.png'/></a><div>$comment_count | </div>";
    echo "<a  title='$lang[FilterPhotos]' href='show.php?train_id=$train_id&user_id=$train_own_id' target='_blank'><img style='width:20px;height:15px;' src='../pic/train_detail/camera_small.png'/></a>";      
    if ($share_auth == true){
      echo " | <div><a  title='$lang[share]' id='share_this' href='#'> <img  style='width:20px;height:15px' src='../pic/train_detail/share.png'/></a></div>"; 
    } 
  ?>
 </div>
</div>
  <div id='top_background_line2'></div>
  <div id='description'>      
         <?php echo $lang['sport_info']?> ：
         <?php echo $train_description?>        
  </div>
 <!-- 地圖-->
<div id='main'>
   <a id='map_right1' href='#'><img src='../pic/train_detail/button_map_+.png' /></a>
   <a id='map_right2' href='#'><img src='../pic/train_detail/button_map_-.png' /></a>     
</div>
<div id="map-canvas"></div>
<hr>



<table style='width:100%' ><tr>
<td style='width:20%;'>
<div id='chart_select_show'>
 <span><?php echo $lang['highchart_1']?> </span>    
 <span  style='float:right'> 
    <span> <a href='#'><img src='../pic/train_detail/triangle.png'> </a> </span>   
    <span> <a target="_blank" href='../person/config2.php'><img style='height:30px;' title='<?php echo $lang['config']?>'  src='../pic/train_detail/button_setting_40x35_1.png'></img>  </a> </span>
 </span>
</div>
<div id='left_container_chart'>
 <div id='chart_select'>
    <a id='pie_1'  href='#'> <?php echo $lang['highchart_2']?> </a><hr>
    <a id='pie_2'  href='#'> <?php echo $lang['highchart_3']?>  </a><hr>
    <!--
    <a id='pie_3'  href='#'> <?php echo $lang['highchart_4']?> </a><hr> 
    -->
    <a id='pie_gauge'  href='#'> <?php echo $lang['highchart_5']?> </a>
 </div>    
    <div id="container_pie_speed"></div>
    <div id="container_pie_heart"></div>
       <!--
    <div id="container_pie_slope">沒有數據，放上圖片</div>
  -->
    <div id="container_gauge_speed" ></div>
    <div id="container_gauge_heart"></div>
    <div id="container_gauge_power" ></div>
    <div id="container_gauge_cadence"></div>
</div>
</td>

<td style='width:80%;text-align:center;'>
 <div class='stand_button_0' >
  <div class='top_button'>  
     <span class='no_padding' id='start_play'><img  src='../pic/train_detail/button_play_40x35_u_2.png'/></span>
     <span class='no_padding button_1' id='stop_play'><img style='width:12px' src='../pic/train_detail/button_stop_40x35_u_2.png'/></span>   
  </div>
  <div class='top_button'>     
    <span id='change_to_time' ><?php echo $lang['train_time']?></span>
    <span id='change_to_distance' class='button_1'><?php echo $lang['train_distance']?>(km) </span>
  </div>   
 </div>

<br>
  <div id="container_1"  ></div>
</td>
</tr>
</table>
<br>
<hr>

<!-- 表格 -->
 <div class='stand_button_0' >
  <div class='top_button'> 
    <span id='show_jqgrid_total' class='button_1'><?php echo $lang['show_jqgrid_total']?></span>
    <span id='show_jqgrid_location'><?php echo $lang['show_jqgrid_location']?></span>
    <span id='show_jqgrid_lap'><?php echo $lang['show_jqgrid_lap']?></span>
   </div>
</div>
<br>
<div  id='show_train_info'>
  <div id='show_train_info_1'>
<!-- 第一張表格  -->
 <table id="dg_0"   style="height:60px"
       title=""  pagination="false"   toolbar="#toolbar" 
       rownumbers="true" fitColumns="true" singleSelect="true" remoteSort="false" >
     <thead>
     <tr>
     <th field="lMaxSpeed" width="10%"  resizable='false' sortable="true"  sorter="mysort"><?php echo $lang['train_table_1_1']?>(Km/Hr)</th>
     <th field="ave_speed"   width="10%" resizable='false' sortable="true" sorter="mysort"><?php echo $lang['train_table_1_2']?>(Km/Hr)</th>
     <th field="wBestCadns"  width="10%" resizable='false' sortable="true" sorter="mysort"><?php echo $lang['train_table_1_3']?> </th>
     <th field="wAvgCadns"   width="10%" resizable='false' sortable="true"  sorter="mysort"><?php echo $lang['train_table_1_4']?></th>
     <th field="cMaxHeart"   width="10%" resizable='false' sortable="true"  sorter="mysort"><?php echo $lang['train_table_1_5']?></th>
     <th field="cAvgHeart"   width="10%" resizable='false' sortable="true"  sorter="mysort"><?php echo $lang['train_table_1_6']?></th>
     <th field="wMaxPower"   width="10%" resizable='false' sortable="true"  sorter="mysort"><?php echo $lang['train_table_1_7']?> </th>
     <th field="wAvgPower"   width="10%" resizable='false' sortable="true"  sorter="mysort"><?php echo $lang['train_table_1_8']?></th>
     <th field="wCalory"   width="10%" resizable='false' sortable="true" sorter="mysort"><?php echo $lang['train_table_1_9']?>(Kcal)</th>
     <th field="wAscent"   width="10%" resizable='false' sortable="true" sorter="mysort"><?php echo $lang['train_table_1_10']?>(m)</th>
     <th field="wDescent"   width="10%" resizable='false' sortable="true" sorter="mysort"><?php echo $lang['train_table_1_11']?>(m)</th>
     </tr>
    </thead>
    </table>

   </div>
  <!-- 第二個表格 ，參數說明，pagination 換頁那行 --> 
  <div id='show_train_info_2'>
     <table id="dg"  style="height:186px;"
       title=""  pagination="true"   toolbar="#toolbar" 
       rownumbers="true" fitColumns="true" singleSelect="true" remoteSort="false">
     <thead>
     <tr>
     <th field="start_time" width="12%" resizable='false' sortable="true" sorter="mysort"><?php echo $lang['start_time']?></th>
     <th field="latitude"   width="12%" resizable='false' sortable="true" sorter="mysort"><?php echo $lang['latitude']?></th>
     <th field="longitude"  width="11%" resizable='false' sortable="true" sorter="mysort"><?php echo $lang['longitude']?> </th>
     <th field="altitude"   width="11%" resizable='false' sortable="true"  sorter="mysort"><?php echo $lang['altitude']?>(m)</th>
     <th field="speed"      width="11%" resizable='false' sortable="true"  sorter="mysort"><?php echo $lang['speed']?>(Km/Hr)</th>
     <th field="heart_rate" width="11%" resizable='false' sortable="true"  sorter="mysort"><?php echo $lang['heart_rate']?></th>
     <th field="cadence"    width="11%" resizable='false' sortable="true"  sorter="mysort"><?php echo $lang['cadence']?> </th>
     <th field="power"      width="11%" resizable='false' sortable="true"  sorter="mysort"><?php echo $lang['power']?></th>
     <th field="distance"   width="11%" resizable='false' sortable="true" sorter="mysort"><?php echo $lang['total_distance']?>(km)</th>
     </tr>
    </thead>
    </table>
  </div>
 <!-- 第三張表格 -->
 <div id='show_train_info_3'>
     <table id="dg_3"  style="height:186px;"
       title=""
       pagination="true"   toolbar="#toolbar" 
       rownumbers="true" fitColumns="true" singleSelect="true" remoteSort="false">
     <thead>
     <tr>    
     <th field="lap_no" width="10%" resizable='false'  sortable="true" sorter="mysort"><?php echo $lang['lap_no']?></th>
     <th field="total_time" width="10%" resizable='false' sortable="true" sorter="mysort"><?php echo  $lang['total_time'] ?></th>
     <th field="total_distance"   width="10%" resizable='false' sortable="true" sorter="mysort"><?php echo $lang['total_distance']?>(Km)</th>
     <th field="ave_speed"   width="10%" resizable='false' sortable="true" sorter="mysort"><?php echo $lang['train_table_1_2']?>(Km/Hr)</th> 
     <th field="max_alt"   width="10%" resizable='false' sortable="true" sorter="mysort"><?php echo $lang['max_alt']?>(Km)</th>
     <th field="avg_heart" width="10%" resizable='false' sortable="true" sorter="mysort"><?php echo $lang['avg_heart']?></th>
     <th field="calory" width="10%" resizable='false' sortable="true" sorter="mysort"><?php echo $lang['calory']?>(Kcal)</th>
     <th field="avg_cadns" width="10%" resizable='false' sortable="true" sorter="mysort"><?php echo $lang['avg_cadns']?></th>
     <th field="avg_power" width="10%" resizable='false' sortable="true" sorter="mysort"><?php echo $lang['avg_power']?></th>

     </tr>
    </thead>
    </table>
  </div>


</div>
<br><br>

<!--  獨立的覆蓋層 -->
<div id='share_web_link'>
   <br><?php echo $lang['share_info']?><p>   
    <input type='text' style='width:95%;margin:1px'  value='<?php echo $URL;  ?>'>
</div> 



</body>




<script src='js/easyui_0.js'></script>
<script src='js/easyui.js'></script>
<script src='js/easyui_3.js'></script>
<br>

<?php
}else{
  echo "<br><br><br><br><br>$lang[error_no_data]<br><br><br><br><br>";
}
  include ("../foot_all.php");
?>

</html>








