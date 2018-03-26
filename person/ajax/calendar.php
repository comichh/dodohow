<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");

$user_id=$_SESSION['user_id'];

$now_date=$_GET['now_date'];
$need=$_GET['need'];


$array=explode("-",$now_date);
$year=trim($array[0]);
$month=trim($array[1]);
if ($month==''){$month=1;}     

$origin_day_1=$_COOKIE['new_day_1'];  
$origin_day_2=$_COOKIE['new_day_2'];

$last_month_last= date("Y-m-d",mktime(0,0,0,$month-1,1,$year));     
$month_last = date("Y-m-d",mktime(0,0,0,$month,1,$year)); 
$month_last_day=month_last($month_last); 
$next_month_last=date("Y-m-d",mktime(0,0,0,$month+1,1,$year));    //用 mktime 會自動進位，所以不用替他考慮
$month_next_last_day=month_last($next_month_last); 

$query="select * from tbl_train_data as a,tbl_device as b ,tbl_user as c ";
$query.=" where a.deviceid=b.deviceid and b.creator=$user_id and c.id=$user_id  ";




if ($need=='next_week'){                                // 計算下一週的日期  
  next_week($year,$month,$origin_day_1,$origin_day_2);
}else if ($need=='last_week')   {  
  last_week($year,$month,$origin_day_1,$origin_day_2);
}else if ($need=='get_next_week_data')   {                   // next 週 新圖表的資料 , 這個可能還有錯，月可能會變                 
  if ($origin_day_2 < $origin_day_1)                         // 換月  
  {
    init_sql_next_week( $origin_day_1,$origin_day_1+6, $month_last_day);           // 初始化陣列也不同 
     $time_start=date("Y-m-d",mktime(0,0,0,$month,$origin_day_1,$year));    
     $time_end=date("Y-m-d",mktime(0,0,0,$month+1,$origin_day_2+1,$year));  
     $next_month=date("m",mktime(0,0,0,$month+1,$origin_day_2,$year));    
    $regex="$year-0?[$month,$next_month]-([0-9]{2})\s.*";  
  }else{
    init_sql( $origin_day_1,$origin_day_2); 
    $time_start=date("Y-m-d",mktime(0,0,0,$month,$origin_day_1,$year));    
    $time_end=date("Y-m-d",mktime(0,0,0,$month,$origin_day_2+1,$year));  
    $regex="$year-0?$month-([0-9]{2})\s.*";                   
  }
  get_data($time_start,$time_end,$query, $regex);
}else if ($need=='get_click_week_data')   {                   // 點月               
    init_sql( $origin_day_1,$origin_day_2); 
    $time_start=date("Y-m-d",mktime(0,0,0,$month,$origin_day_1,$year));    
    $time_end=date("Y-m-d",mktime(0,0,0,$month,$origin_day_2,$year));  
    $regex="$year-0?$month-([0-9]{2})\s.*";                   
    get_data($time_start,$time_end,$query, $regex);
}else if ($need=='get_next_month_data')   {                   // next 月 新圖表的資料      
  $last_day=(int)month_last($next_month_last)+1;             // 為了計算這個月最後一天
  init_sql_month(1,$last_day);
  $time_start=date("Y-m-d",mktime(0,0,0,$month+1,1,$year));    
  $time_end=date("Y-m-d",mktime(0,0,0,$month+2,31,$year));
  $next_month=date("m",mktime(0,0,0,$month+1,1,$year)); 
  $regex="$year-0?$next_month-([0-9]{2})\s.*";
  get_data($time_start,$time_end,$query,$regex);
}else if ($need=='get_click_month_data')   {                   // click next 月 新圖表的資料      
  $last_day=(int)$month_last_day+1;                            // 為了計算這個月最後一天
  init_sql_month(1,$last_day);
  $time_start=date("Y-m-d",mktime(0,0,0,$month,1,$year));    
  $time_end=date("Y-m-d",mktime(0,0,0,$month+1,31,$year));
  $next_month=date("m",mktime(0,0,0,$month,1,$year)); 
  $regex="$year-0?$next_month-([0-9]{2})\s.*";
  get_data($time_start,$time_end,$query,$regex);



}else if ($need=='get_next_year_data')   {                   // next year  新圖表的資料
  init_sql(1,12);
  $time_start=$year+1;
  $time_end=$year+2; 
  $regex="$time_start-([0-9]{2})-.*";
  get_data($time_start,$time_end,$query, $regex);
}else if ($need=='get_click_year_data')   {                   // click year  新圖表的資料
  init_sql(1,12);
  $time_start=$year;
  $time_end=$year+1; 
  $regex="$time_start-([0-9]{2})-.*";
  get_data($time_start,$time_end,$query, $regex);

}else if ($need=='get_last_week_data')   {                   // last 週 新圖表的資料
if ($origin_day_2 < $origin_day_1)                    // 2 比 1 小就是換月了
  {
    init_sql_next_week( $origin_day_1,$origin_day_1+6, $month_next_last_day);           // 初始化陣列也不同  
    $time_start=date("Y-m-d",mktime(0,0,0,$month-1,$origin_day_1,$year));    
    $time_end=date("Y-m-d",mktime(0,0,0,$month,$origin_day_2+1,$year)); 
    $last_month=date("m",mktime(0,0,0,$month-1,$origin_day_1,$year));    
    $regex="$year-0?[$last_month,$month]-([0-9]{2})\s.*";  
  }else{
    init_sql($origin_day_1,$origin_day_2);
    //$time_start="$year-$month-$origin_day_1";
    //$time_end="$year-$month-$origin_day_2";
    $time_start=date("Y-m-d",mktime(0,0,0,$month,$origin_day_1,$year));    
    $time_end=date("Y-m-d",mktime(0,0,0,$month,$origin_day_2+1,$year)); 
    $regex="$year-0?$month-([0-9]{2})\s.*";
  } 
  get_data($time_start,$time_end,$query, $regex);
}else if ($need=='get_last_month_data')   {                   // last 月 新圖表的資料      
  $last_day=(int)month_last($last_month_last)+1;             // 為了計算這個月最後一天
  init_sql_month(1,$last_day);
  $time_start=date("Y-m-d",mktime(0,0,0,$month-1,1,$year));    
  $time_end=date("Y-m-d",mktime(0,0,0,$month,31,$year));
  $last_month=date("m",mktime(0,0,0,$month-1,1,$year)); 
  $regex="$year-0?$last_month-([0-9]{2})\s.*";
  get_data($time_start,$time_end,$query,$regex);
}else if ($need=='get_last_year_data')   {                   // last year  新圖表的資料
  init_sql(1,12);
  $time_start=$year-1;
  $time_end=$year; 
  $regex="$time_start-([0-9]{2})-.*";
  get_data($time_start,$time_end,$query, $regex);




}else {}



// 最後的回傳值 初始化
function init_sql( $origin_day_1,$origin_day_2){ 
global $sql;
for ($i=$origin_day_1;$i<=$origin_day_2;$i++)
{ 
  if ($i<10){$j="0".$i;}else {$j=$i;}
  $j=(string)($j);
  $sql[$j]['wCalory_0'] =0;
  $sql[$j]['lTotalDistance_0'] =0;
  $sql[$j]['wAscent_0'] =0;
  $sql[$j]['wCalory_1'] =0;
  $sql[$j]['lTotalDistance_1'] =0;
  $sql[$j]['wAscent_1'] =0;
  $sql[$j]['wCalory_2'] =0;
  $sql[$j]['lTotalDistance_2'] =0;
  $sql[$j]['wAscent_2'] =0;
}}

function init_sql_next_week( $origin_day_1,$origin_day_2,$last_day){ 
global $sql;
for ($i=$origin_day_1;$i<=$origin_day_2;$i++)
{ 
  if ($i > $last_day){$j=$i-$last_day;}else{$j=$i;}
  if ($j<10){$j1="0".$j;}else {$j1=$j;}
  $j1=(string)($j1);
  $sql[$j1]['wCalory_0'] =0;
  $sql[$j1]['lTotalDistance_0'] =0;
  $sql[$j1]['wAscent_0'] =0;
  $sql[$j1]['wCalory_1'] =0;
  $sql[$j1]['lTotalDistance_1'] =0;
  $sql[$j1]['wAscent_1'] =0;
  $sql[$j1]['wCalory_2'] =0;
  $sql[$j1]['lTotalDistance_2'] =0;
  $sql[$j1]['wAscent_2'] =0;
}}


function init_sql_month($origin_day_1,$origin_day_2)
{ 
global $sql;

for ($i=$origin_day_1;$i<$origin_day_2;$i++)
{   
  if ($i<10){$j="0".$i;}else {$j=$i;}
  $j=(string)($j);
  $sql[$j]['wCalory_0'] =0;
  $sql[$j]['lTotalDistance_0'] =0;
  $sql[$j]['wAscent_0'] =0;
  $sql[$j]['wCalory_1'] =0;
  $sql[$j]['lTotalDistance_1'] =0;
  $sql[$j]['wAscent_1'] =0;
  $sql[$j]['wCalory_2'] =0;
  $sql[$j]['lTotalDistance_2'] =0;
  $sql[$j]['wAscent_2'] =0;
}
}


function get_data($time_start,$time_end, $query,$regex)
{
global $sql;
$query=$query." and a.Start_time>'$time_start' and  a.Start_time<'$time_end' ";
$result=mysql_query($query) or die ('error');
if ($result)
{
  while ($row=mysql_fetch_array($result))
  {          
    if(preg_match("/$regex/",$row['Start_time'],$match_2))
    {     
      month_match($match_2[1],$row,0);         // 目的，若是搜 2013 - 2014，我需要分辨那些是  1 月，2 月 .. 的資料
    }                                
  }
}
//echo $query;

$query1=$query." and a.cSport6='1' and a.Start_time>'$time_start' and  a.Start_time<'$time_end' ";
$result=mysql_query($query1) or die ('error');
if ($result)
{
  while ($row=mysql_fetch_array($result))
  {          
    if(preg_match("/$regex/",$row['Start_time'],$match_2))
    {     
      month_match($match_2[1],$row,1);         // 目的，若是搜 2013 - 2014，我需要分辨那些是  1 月，2 月 .. 的資料
    }                                
  }
}

$query2=$query." and a.cSport6='2' and a.Start_time>'$time_start' and  a.Start_time<'$time_end' ";
$result=mysql_query($query2) or die ('error');
if ($result)
{
  while ($row=mysql_fetch_array($result))
  {          
    if(preg_match("/$regex/",$row['Start_time'],$match_2))
    {    
      month_match($match_2[1],$row,2);
    }                                
  }
}
$new_sql=array();
foreach ($sql as $key => $value ) 
{
  array_push($new_sql,$value);       // json 無法對 key 排序，所以就不要给他 key
}

$sql_json= json_encode($new_sql);
echo $sql_json;
}










function next_week($year,$month,$origin_day_1,$origin_day_2)              // 下週
{
global $lang,$year;
$temp_day = date("Y-m-d H:i:s",mktime(0,0,0,$month,1,$year));
$last_day=getthemonth($temp_day);
$new_day_1=$origin_day_1+7;
$new_day_2=$origin_day_2+7;
$new_month=$month;
$hh="";
if ( $new_day_1 < $last_day and $new_day_2 <= $last_day )              // 都沒換月，2最多碰臨界 （第一種）
{
  $new_month=$new_month;
  $new_day_1=$new_day_1;
  $new_day_2=$new_day_2;
}else if ( $new_day_1 <= $last_day and $new_day_2 > $last_day   ){     // 1 沒換月碰臨界，2 換月 (第二種）   
  $new_month=$new_month;
  $if_next_month=$new_month+1;
  $next_year=$year+1;
  if ($if_next_month==13){$if_next_month=1;$show_next_year="$next_year/";}else{$show_next_year='';}
  $hh=$show_next_year.$if_next_month."/";
  $new_day_1=$new_day_1;
  $new_day_2=$new_day_2-$last_day;
}else if ( $new_day_1 > $last_day and  $new_day_2 < $last_day)        // 2 原本已經跨月，1 跟上跨月而已 （第三種）
{
  $new_month=$new_month+1;
  if ($new_month==13){$new_month=1;$year++;}
  $new_day_1=$new_day_1-$last_day;
  $new_day_2=$new_day_2;  
} else if ($new_day_1 > $last_day and $new_day_2 > $last_day )         // 兩個同時跨月（第四種）
{
  $new_month=$new_month+1;
  $next_year=$year+1;
  if ($new_month==13){$new_month=1;$show_next_year="";}else{$show_next_year='';}
  $hh=$show_next_year;
  $new_day_1=$new_day_1-$last_day ;
  $new_day_2=$new_day_2-$last_day; 
}else{}

setcookie("new_day_1",$new_day_1,time()+7200);
setcookie("new_day_2",$new_day_2,time()+7200);
$next_date="$year-$new_month-($new_day_1~$hh$new_day_2)";     // 最後的新的日期
echo $next_date;
}

function last_week($year,$month,$origin_day_1,$origin_day_2)        // 這邊不會有第四種情況
{
global $lang,$year;
if ($month=="1"){$temp=$month-1+12;$temp_y=$year-1; }else {$temp=$month-1; $temp_y=$year; }
$temp_day = date("Y-m-d H:i:s",mktime(0,0,0,$temp,1,$temp_y));
$last_day=getthemonth($temp_day);        // 這邊計算的是上個月的最後一天
$new_day_1=$origin_day_1-7;
$new_day_2=$origin_day_2-7;
$new_month=$month;
$hh="";
if ( $new_day_1 <= 0 and $new_day_2 > 0   )           // 1換月,2不換月(第二種） ，  1 的日期是  2,3,4,5,6,7   
{
  $new_month=$new_month;
  //$if_next_month=$new_month+1;
  $hh=$new_month."/";
  $new_month=$new_month-1;
  $origin_year=$year;
  if ($new_month==0){$new_month=12;$year--;$hh=$origin_year."/".$hh;}
  $new_day_1=$new_day_1+$last_day;
  $new_day_2=$new_day_2;
}else if ( $new_day_1 >0  and  $new_day_2 < 0){       // 兩個本來就不同月份，按完又換月（第三種） ，極限狀態  1-31  2-6   
  $new_month=$new_month;
  $new_day_1=$new_day_1;
  $temp_day = date("Y-m-d H:i:s",mktime(0,0,0,$month,1,$year));
  $last_day_1=getthemonth($temp_day);              //  這邊要去計算本月的最後一天。而不是上個月，因為早就換月了          
  $new_day_2=$new_day_2+$last_day_1;
}else if ($new_day_1 > 0 and $new_day_2 > 0)       //   都沒換月 （第一種）
{
  $new_month=$new_month;
  //if ($new_month==0){$new_month=12;$year--;}
  $new_day_1=$new_day_1 ;
  $new_day_2=$new_day_2 ;  
}
else if ( $new_day_1 < 0 and $new_day_2 == 0)        // 兩個按完都換月（第四種），只會出現在1:1  2:7 
{
  $new_month=$new_month-1;
  $origin_year=$year;
  if ($new_month==0){$new_month=12;$year--;$hh=$origin_year."/".$hh;}  
  $new_day_1=$new_day_1+$last_day;
  $new_day_2=$new_day_2+$last_day;
}

else{}
setcookie("new_day_1",$new_day_1,time()+7200);
setcookie("new_day_2",$new_day_2,time()+7200);
$next_date="$year-$new_month-($new_day_1~$hh$new_day_2)";     // 最後的新的日期
echo $next_date;
}


// 共用函數
function month_match($key,$row,$csport_6 )
{
  global $sql;
  if ($csport_6 ==1){
    $sql[$key]['lTotalDistance_1'] +=$row['lTotalDistance']/1000;
    $sql[$key]['wCalory_1'] +=$row['wCalory'];
    $sql[$key]['wAscent_1']+= $row['wAscent'];
  }else if ($csport_6 ==2)  {
    $sql[$key]['lTotalDistance_2'] +=$row['lTotalDistance']/1000;
    $sql[$key]['wCalory_2'] +=$row['wCalory'];
    $sql[$key]['wAscent_2']+= $row['wAscent'];
  }else{
    $sql[$key]['lTotalDistance_0'] +=$row['lTotalDistance']/1000;
    $sql[$key]['wCalory_0'] +=$row['wCalory'];
    $sql[$key]['wAscent_0']+= $row['wAscent'];  
  } 
}


function getthemonth($date)
{
  $firstday = date('Y-m-01', strtotime($date));
  $lastday = date('d', strtotime("$firstday +1 month -1 day"));
  return $lastday;
}


function month_last($date)
{
  $firstday = date('Y-m-01', strtotime($date));
  $lastday = date('d', strtotime("$firstday +1 month -1 day"));
  return $lastday;
}

?>
