<?php
/*
trk 
  -> name (名稱）
  -> desc (描述）
  -> trkseg 
     -> trkpt  （lat lon)
       ->  time   時間 （這個單位也好像很亂！？）    2030-09-19T00:33:53.000Z  單位很亂
       ->  ele    高度 （單位？）
       ->  speed  單位（自己家的?）
example:
<trk>
    <name>Edge Tourting_1736_v2.12B_ANT+Sensors</name>
    <desc>使用編號1號測試,有插TWN圖卡.</desc>
    <trkseg>
      <trkpt lon="121.58488065004349" lat="25.047934781759977">
        <ele>37.0</ele>
        <time>2030-09-19T00:33:51.000Z</time>
        <speed>2.35 </speed>
        <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:atemp>29.0</gpxtpx:atemp>
            <gpxtpx:hr>168</gpxtpx:hr>
          </gpxtpx:TrackPointExtension>
        </extensions>
      </trkpt>
</trk>

*/

/*
自己家的 ， st 補充資料
*/


// 假如 有 trk ，這個為主，其他去補他的數據


include ("../../config/web.ini");
session_id($_POST["session_id"]);                  // 這個需要在 session start 前
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");
include ("../../function/sphere_distance.php");
include ("../../function/database.php");
$user_id=$_SESSION['user_id'];

$show_error='上傳成功';

if (!empty($_FILES)) 
{
 $file_name=$_FILES['Filedata']['name'];
 $tempFile = $_FILES['Filedata']['tmp_name']; 
 $fileTypes = array('gpx,GPX'); // File extensions
 $fileParts = pathinfo($file_name);
  if (in_array($fileParts['extension'],$fileTypes)) {
   $device_id=check_device ($user_id);         // 開新資料表，還有關連到人
   if ( $device_id != 'error')                 // gpx  資料寫入資料庫  
   {   
     $new_file_name=$user_id.".gpx";
     $targetFile= $work_path."/upload/gpx_temp/".$new_file_name;
     move_uploaded_file($tempFile, $targetFile);        
     gpx($targetFile,$device_id) ; 
     // 要刪除最後的檔案    
   }   
  }else { 
    $show_error=$lang['pic_ajax_error_2'];
  }
}
echo $show_error;


function check_device ($user_id)
{
  global $work_path,$show_error;
  $query="select * from  tbl_device where creator='$user_id' and model='4'";
  $result = mysql_query($query);
  $num=mysql_num_rows($result);
  if ($num >0)
  {
    while ($row=mysql_fetch_array($result))
    {
      $final_return=$row['deviceid']; 
    } 
  }else{        //  創造 ，用  user_id 來判斷就好   
    $deviceid="GPX_".$user_id;
    $create_result=create_database($deviceid,$user_id,$work_path);   
    if ( $create_result =='ok')
    {
      $final_return=$deviceid;
    }else{ $final_return ='error';}     
  }
return $final_return;  
}







function gpx($file,$deviceid)       // 開始解析 gpx
{
  global $sql_main,$sql,$i,$show_error;
  $i=0;
  if (file_exists($file)) { 
    $xml = simplexml_load_file($file);
    foreach( $xml->children() AS $first_child ) 
    {
        $first_name = $first_child->getName();                  
        if ($first_name == 'trk'){     
           trk ($first_child);
        }else if ($first_name  =='metadata'){        // 紀錄的時間
           metadata($first_child);  
        }                                 
    }
    write_database($deviceid);
  }else {
    $show_error='Failed to open file';
  }                
}


function write_database($deviceid)
{
  global $sql_main,$sql,$i,$show_error;
  $total_point=$i+1;
  //  有些沒有訓練時間，抓第一點的時間
  if ($sql_main['Start_time'] ==''){ $sql_main['Start_time'] = $sql[0]['start_time'] ;} 
  $query_main="insert into tbl_train_data (deviceid,Start_time,train_name,train_description,wTotalPoint,wLapCnts)";
  $query_main.=" values ('$deviceid','$sql_main[Start_time]','$sql_main[train_name]','$sql_main[train_description]','$total_point','1')"; 
  $result_main=mysql_query($query_main);
  $final_id=mysql_insert_id();
  if ($final_id !='')
  {
    $j=$i;
    $i=0;
    $total_dis=0;
    $total_time=0;
    for ($i=0;$i<=$j;$i++)
    {
      $sql[$i]['distance']=0;
      $sql[$i]['speed']=0;
      $sql[$i]['train_data_key']=$final_id;
      $sql[$i]['no']=$i;
      $range_time=1;
      $tbl='(';
      $tbl_value='(';
      foreach($sql[$i] as $key => $value)
      {                         
        if ($i !=0 and  $sql[$i]['start_time']!='' and $sql[$i]['distance']==0 )   //這邊算一下距離 ，和速率  
        {
          $point[0]=(double)$sql[$i-1]['latitude'];
          $point[1]=(double)$sql[$i-1]['longitude'];
          $point1[0]=(double)$sql[$i]['latitude'];
          $point1[1]=(double)$sql[$i]['longitude']; 
          $sql[$i]['distance']=get_dis($point,$point1);           
          $range_time=strtotime($sql[$i]['start_time'])- strtotime($sql[$i-1]['start_time']);
          if  ( $range_time ==0 ){$range_time=1;} 
          //$show_error.= $range_time."\r\n";         // 時間一樣！   
          $sql[$i]['speed']=$sql[$i]['distance']/$range_time;         
        }          
        $tbl.=$key.",";
        $tbl_value.="'".$sql[$i][$key]."',";
      }
      $total_dis+=$sql[$i]['distance'];          
      $total_time=$total_time+$range_time*10;                // 資料庫存的時 0.1s ，我這邊算的是真實時間，因為我是用每一點去算的
        
      $tbl=substr ($tbl,0,-1);
      $tbl_value=substr ($tbl_value,0,-1);
      // 還有一個關連 key  
      $tbl.=")";
      $tbl_value.=")";
      $query="insert into $deviceid  $tbl VALUES $tbl_value";
      $result=mysql_query($query);

      //  再 update 總表，加入總時間，和總距離   
      $query="update  tbl_train_data  set lTotalTime='$total_time',lTotalDistance='$total_dis' where id='$final_id'";
 	    $result=mysql_query($query);   
      if (!$result){$show_error='database error';}     
    }
  }
}
 



function metadata($first_child)
{
global $sql_main,$sql,$i;
  foreach( $first_child->children() AS $child_2 )
  {
    $child_2_name = $child_2->getName();
    if ($child_2_name =='time')
    {      
       $sql_main['Start_time']=str_replace("T"," ",$child_2);
       $sql_main['Start_time']=preg_replace("/(\.000)?Z/","",$sql_main['Start_time']); 
    }
  }
}




function trk ($first_child)
{
 global $sql_main,$sql,$i;
 $i=0;
 foreach( $first_child->children() AS $child_2 ) 
 {
    $child_2_name = $child_2->getName();
    if ($child_2_name == 'name' or $child_2_name == 'Name') {     
       $sql_main['train_name']=$child_2;   
    }else if ($child_2_name == 'desc') {      
       $sql_main['train_description']=$child_2;
    }else if ($child_2_name == 'trkseg') {
       foreach( $child_2->children() AS $child_3 ) 
       {
         $child_3_name = $child_3->getName();   
         if ($child_3_name == 'trkpt') 
         {             
            //echo $child_3['lat'].' '.$child_3['lon']."<br>";
            $sql[$i]['latitude']= $child_3['lat'];
            $sql[$i]['longitude']= $child_3['lon']; 
            trk_3 ($child_3);           //  最複雜的
            //}else if ($child_3_name == 'ele') {      // 有些還會藏在這邊，沒有範例！        
         }         
         //echo "<br>";
         $i++;           
         // sql 寫入
       }
     }
 }
}

function  trk_3 ($child_3)
{
  global $sql_main,$sql,$i;
  foreach( $child_3->children() AS $child_4 ) 
  {
    $child_4_name= $child_4->getName();
    switch($child_4_name)
    {
       case 'time':        
        $sql[$i]['start_time']=str_replace("T"," ",$child_4);
        $sql[$i]['start_time']=preg_replace("/(\.000)?Z/","",$sql[$i]['start_time']); 
        //echo " time: ".$sql[$i]['start_time'] ;        
       break;
       case 'ele':
        //echo " ele: ".$child_4 ;
        $sql[$i]['altitude']=$child_4 ;
       break;
       case 'speed':
        //echo " speed: ".$child_4 ;
        $sql[$i]['speed']=$child_4 ;
       break; 
    }
  } 
}


/*
function wpt($first_child)
{
   global $sql_main,$sql,$i;
   //echo $first_child['lat'].' '.$first_child['lon'].'<br> ';
   $sql['latitude']= $first_child['lat'];
   $sql['longitude']= $first_child['lon']; 
  
   foreach( $first_child->children() AS $child_2 ) 
   {            
              $child_2_name = $child_2->getName();
              switch ($child_2_name)
              {
                 case 'ele':
                   //echo $child_2_name.":". $child_2 .' ';
                   $sql['altitude']=$child_2;
                 break;
                 case 'cmt':
                   //echo $child_2_name.":". $child_2 .' ';
                   $sql['start_time']=$child_2;
                 break; 
              }                           
  }
  //echo "<br>".$i."<p>";  
  $i++;
}
*/

?>
