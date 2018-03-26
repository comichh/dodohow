<?php
$navigation=true;
$no_check=false;
include ("../config/head.php");

$user_id=$_SESSION['user_id'];

$pic_path="$work_web/pic/person";
$pic_path_1="$work_web/pic/train_detail";
$p1="<img src='$pic_path/p1.png'>";
$p2="<img src='$pic_path/p2.png'>";
$p3="<img src='$pic_path/p3.png'>";
$p4="<img src='$pic_path/p4.png'>";
$p5="<img src='$pic_path/p5.png'>";
$p6="<img src='$pic_path/p6.png'>";     
//$right="<img src='$pic_path/right.png'>";
//$left="<img src='$pic_path/left.png'>"; 
$right="<img style='height:35px' src='../pic/train_detail/button_next_1.png'>";
$left="<img style='height:35px' src='../pic/train_detail/button_back_1.png'>"; 

$person_img="<img id='user_pic' src='../upload/user/$_SESSION[UserImage]'>";
$left_table="
      $_SESSION[displayname]<br><br>
      $person_img <br><br>
      <br>";

$query="select count(a.id),sum(lTotalTime),sum(lTotalDistance),sum(wCalory),sum(wAscent),sum(wDescent),c.displayname,c.image ";
$query.=" from tbl_train_data as a,tbl_device as b ,tbl_user as c ";
$query.=" where a.deviceid=b.deviceid and b.creator=$user_id and c.id=$user_id group by b.creator ";
$result=mysql_query($query) or die ('error');


if (mysql_num_rows($result)!=0)
{
  while ($row=mysql_fetch_array($result))
  {        
   $total_time= change_time($row['sum(lTotalTime)']);      
   $total_dis=$row['sum(lTotalDistance)']*0.001;
   $left_table.="    
      <p>
      <div>$p1</div><div>$lang[total_recode]:(".$row['count(a.id)'].")</div><p>".
     "<div>$p2</div><div>$lang[total_time]:".$total_time."</div><p>".
     "<div>$p3</div><div>$lang[total_calory]:".round($row['sum(wCalory)'])." Kcal</div><p>".
     "<div>$p4</div><div>$lang[total_distance]:".round($total_dis)." km</div><p>".     
     "<div>$p5</div><div>$lang[total_climb]:".round($row['sum(wCalory)'])." m</div><p>".
     "<div>$p6</div><div>$lang[total_down_climb]:".round($row['sum(wAscent)'])." m</div><p>";       
  }
}else{       //  沒有資料 
  $left_table.="    
      <p>
      <div>$p1</div><div>$lang[total_recode]:("."0".")</div><p>".
     "<div>$p2</div><div>$lang[total_time]:"."0:0:0"."</div><p>".
     "<div>$p3</div><div>$lang[total_calory]:"."0"." Kcal</div><p>".
     "<div>$p4</div><div>$lang[total_distance]:"."0"." km</div><p>".     
     "<div>$p5</div><div>$lang[total_climb]:"."0"." km</div><p>".
     "<div>$p6</div><div>$lang[total_down_climb]:"."0"." km</div><p>";     
}



$t=time();
$now_year=date("Y",$t);
$last_year=$now_year+1;

$now_month=date("m",$t);
$now_day=date("d",$t);

$month_array=array('01','02','03','04','05','06','07','08','09','10','11','12');
foreach ($month_array  as $key => $value )
{ 
  $sql[$value]['wCalory_2'] =0;
  $sql[$value]['lTotalDistance_2'] =0;
  $sql[$value]['wAscent_2'] =0;
  $sql[$value]['wCalory_1'] =0;
  $sql[$value]['lTotalDistance_1'] =0;
  $sql[$value]['wAscent_1'] =0;
}

// 預設是腳踏車 2   ，把兩個資料都直接撈過去  ，這邊要修正，讓他預設都是 1 ，
$query="select * ";
$query.=" from tbl_train_data as a,tbl_device as b ,tbl_user as c ";
$query.=" where a.deviceid=b.deviceid and b.creator=$user_id and c.id=$user_id  and a.Start_time>'$now_year' and  a.Start_time<'$last_year' ";
$result=mysql_query($query) or die ('error');
if ($result)
{
  while ($row=mysql_fetch_array($result))
  {         
        if (preg_match("/$now_year-([0-9]{2})-.*/",$row['Start_time'],$match))
        {          month_match($match[1],$row,0 );}                               
  }
}


$query="select * ";
$query.=" from tbl_train_data as a,tbl_device as b ,tbl_user as c ";
$query.=" where a.deviceid=b.deviceid and b.creator=$user_id and c.id=$user_id and a.cSport6='1'   and a.Start_time>'$now_year' and  a.Start_time<'$last_year' ";
$result=mysql_query($query) or die ('error');
if ($result)
{
  while ($row=mysql_fetch_array($result))
  {         
        if (preg_match("/$now_year-([0-9]{2})-.*/",$row['Start_time'],$match))
        {          month_match($match[1],$row,1 );}                               
  }
}

$query="select * ";
$query.=" from tbl_train_data as a,tbl_device as b ,tbl_user as c ";
$query.=" where a.deviceid=b.deviceid and b.creator=$user_id and c.id=$user_id and a.cSport6='2'   and a.Start_time>'$now_year' and  a.Start_time<'$last_year' ";
//echo $query;
$result=mysql_query($query) or die ('error');
if ($result)
{
  while ($row=mysql_fetch_array($result))
  {         
        if (preg_match("/$now_year-([0-9]{2})-.*/",$row['Start_time'],$match))
        {          month_match($match[1],$row,2 );}                               
  }
}
$new_sql=array();
foreach ($sql as $key => $value ) 
{
  if ($value['lTotalDistance_0'] ==''){$value['lTotalDistance_0'] =0;}          // 要讓 x  軸正常，有空數據的時候也正常
  if ($value['wCalory_0'] ==''){$value['wCalory_0'] =0;}
  if ($value['wAscent_0'] ==''){$value['wAscent_0'] =0;}
  array_push($new_sql,$value);
}
//print_r ($new_sql);

$sql_json= json_encode($new_sql);



$to_js="<script type='text/javascript'>";
$to_js.="var beaches=$sql_json;var now_year=$now_year;var now_month=$now_month; ";
$to_js.="</script>";
echo $to_js;             //傳遞參數給 js



function month_match($key,$row,$csport_6)
{
  global $sql;
  if ($csport_6 ==1){
    $sql[$key]['lTotalDistance_1']+=$row['lTotalDistance']/1000;
    $sql[$key]['wCalory_1']+=$row['wCalory'];
    $sql[$key]['wAscent_1']+= $row['wAscent']/1000;
  }else if ($csport_6 ==2){
    $sql[$key]['lTotalDistance_2']+=$row['lTotalDistance']/1000;
    $sql[$key]['wCalory_2']+=$row['wCalory'];
    $sql[$key]['wAscent_2']+= $row['wAscent']/1000;
  }else{
    $sql[$key]['lTotalDistance_0']+=$row['lTotalDistance']/1000;
    $sql[$key]['wCalory_0']+=$row['wCalory'];
    $sql[$key]['wAscent_0']+= $row['wAscent']/1000;
  }  
}




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
<style>
#table_left_td{width:290px;height:720px; vertical-align:top;text-align:left;padding:5px 5px;background-color:#c9caca;}
#table_left_td div{display:inline-block;vertical-align: middle;padding:2px;}
#change_right_left div{display:inline-block;vertical-align: middle;padding:5px;}
#user_pic{height:140px}
#table_right_td{width:990px;height:720px; padding:2px}
#container_person{width: 100%; height: 550px; margin:0px auto;}  /* 套件裡面，一定要設一個高度给他 */
.stand_button_0{margin:0 0 20px 0}
</style>
<script type="text/javascript" src="../lib/Highstock-2.0.1/js/highstock.js"></script>
<script type="text/javascript" src="../lib/Highstock-2.0.1/js/modules/exporting.js"></script>
<script type="text/javascript" src="../lib/Highcharts-4.0.1/js/highcharts-more.js"></script>
<script type="text/javascript" src="js/highchart_person.js"></script>
<script type="text/javascript">
  var month_1='<?php echo $lang['month_1']?>';
  var month_2='<?php echo $lang['month_2']?>';
  var month_3='<?php echo $lang['month_3']?>';
  var month_4='<?php echo $lang['month_4']?>';
  var month_5='<?php echo $lang['month_5']?>';
  var month_6='<?php echo $lang['month_6']?>';
  var month_7='<?php echo $lang['month_7']?>';
  var month_8='<?php echo $lang['month_8']?>';
  var month_9='<?php echo $lang['month_9']?>';
  var month_10='<?php echo $lang['month_10']?>';
  var month_11='<?php echo $lang['month_11']?>';
  var month_12='<?php echo $lang['month_12']?>';
  var week_1='<?php echo $lang['week_1']?>';
  var week_2='<?php echo $lang['week_2']?>';
  var week_3='<?php echo $lang['week_3']?>';
  var week_4='<?php echo $lang['week_4']?>';
  var week_5='<?php echo $lang['week_5']?>';
  var week_6='<?php echo $lang['week_6']?>';
  var week_7='<?php echo $lang['week_7']?>';
</script>




<div id='body_page'> <div id='body_table'> 

<table >
<tr>
<td id='table_left_td'>
  <?php echo  $left_table;?>
</td>
<td id='table_right_td'> 
<div class='stand_button_0'>
<div class='top_button'>
  <span id='button1_1'><?php echo $lang['week']?></span>
  <span id='button1_2'><?php echo $lang['month']?></span>
  <span id='button1_3' class='button_1'><?php echo $lang['year']?></span>
</div>
<div class='top_button'>
  <span id='button2_1' class='button_1'><?php echo $lang['total_distance']?> (km)</span>
  <span id='button2_2'><?php echo $lang['total_calory']?> (kcal)</span>
  <span id='button2_3'><?php echo $lang['total_climb']?> (m)</span>
</div>
<div class='top_button'>
  <span id='button3_0' class='button_1'><?php echo $lang['total_sport_type']?></span>
  <span id='button3_1'><?php echo $lang['bicycle']?></span>
  <span id='button3_2'><?php echo $lang['run']?></span>
</div>
</div>
 <div id="container_person" ></div>
<div id='change_right_left'>
   <div id='d_left'><?php echo $left ?> </div>
   <div id='now_date'><?php echo $now_year?></div>
   <div id='d_right'><?php echo $right ?></div> 
 </div>

</td>
</tr>
</table>




</div></div>
<?php include ("../foot.php");?>
