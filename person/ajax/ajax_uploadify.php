<?php
include ("../../config/web.ini");
session_id($_POST["session_id"]); 
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");

// 實際上是一張一張過來，所以這邊不用迴圈
$user_id=$_SESSION['user_id'];
$train_id=$_POST['train_id'];
$db_name=$_POST['db_name'];
$rand_1=rand(1,100000);

if (!empty($_FILES)) 
{
 $file_name=$_FILES['Filedata']['name'];
 $tempFile = $_FILES['Filedata']['tmp_name']; 
 $file_name=preg_replace('/[^\w.][^\w.]*/','_', $file_name);        // 這邊多作一個保護，把雜七雜八的錯誤名稱，都變成_
 $file_name=$train_id."_".$rand_1."_".$file_name;
 $targetFile= $work_path."/upload/trip_photo/$user_id/$train_id/$file_name";
 $targetFile_thumb= $work_path."/upload/trip_photo/$user_id/$train_id/thumbnail/$file_name"; 

  $fileTypes = array('jpg','jpeg','gif','png');                    // File extensions
  $fileParts = pathinfo($file_name); 
  // 還缺一個驗證檔案大小, 目前是不限
     
  // 正式搬移到正式位置
  if (in_array($fileParts['extension'],$fileTypes)) {
      move_uploaded_file($tempFile,$targetFile);
      $exif = exif_read_data($targetFile, 0, true);
      $latitude = $exif['GPS']['GPSLatitude'];
      $file_time=$exif['EXIF']['DateTimeOriginal'];     
      if ($latitude !=''){     
         get_gps_data($exif);
      }else{         
        time_gps($train_id,$file_name,$db_name,$file_time);
      } 
      $id=write_database($train_id,$file_name); 
      // 產生縮圖
      $create_pic="convert -sample '800x600'  $targetFile  $targetFile_thumb";
      system($create_pic,$show);        
      $return_array['status']='ok'; 
      $return_array['id']=$id; 
      $return_array['file_name']=$file_name; 
      $return_array['position']=substr($new_lat,0,8).",".substr($new_lng,0,8);    
  }else {
     $return_array['status']=$lang['pic_ajax_error_2'];   
  }
  echo json_encode ($return_array);
   
}


function time_gps($train_id,$file_name,$db_name,$file_time)
{
  global $new_lat,$new_lng;
  $pic_time=$file_time;
  $query="select * from $db_name where start_time <'$pic_time' and  	train_data_key='$train_id' order by id desc";
  $result=mysql_query($query);
  $total_num=mysql_num_rows($result); 
  if ( $total_num> 0){
    $row_total=mysql_fetch_array($result);   // 只取最近的一筆就好   
  }else {
    $query="select * from $db_name where train_data_key='$train_id' and no='0'";       // 沒有比對到，取第一點
    $result=mysql_query($query);
    $row_total=mysql_fetch_array($result);   
  }
    $new_lat=$row_total['latitude'];        
    $new_lng=$row_total['longitude'];  
}


function get_gps_data($exif)
{
global $new_lat,$new_lng,$return_array;
$longitude = $exif['GPS']['GPSLongitude'];
$latitude = $exif['GPS']['GPSLatitude'];


//還要判斷南北半球 東西半球
if ( $exif['GPS']['GPSLatitudeRef'] =='S'){
 $latitude = -1*$latitude;
}
if ( $exif['GPS']['GPSLongitudeRef'] =='W'){
 $longitude = -1*$longitude;
}

$latitude = getGps($latitude);
$longitude = getGps($longitude);
$new_lat=$latitude['degrees']+$latitude['minutes']/60+$latitude['seconds']/3600;
$new_lng=$longitude['degrees']+$longitude['minutes']/60+$longitude['seconds']/3600;
}


function write_database($train_id,$file_name)
{
 global $new_lat,$new_lng;
 $query="INSERT INTO tbl_pic(`pic_train_key`,`pic_lat`, `pic_lng`,`pic_name`)";
 $query.=" VALUES ('$train_id','$new_lat','$new_lng','$file_name')";
 $result=mysql_query($query);
 $id=mysql_insert_id();     
 return $id;  
}

//Pass in GPS.GPSLatitude or GPS.GPSLongitude or something in that format
function getGps($exifCoord)
{
  $degrees = count($exifCoord) > 0 ? gps2Num($exifCoord[0]) : 0;
  $minutes = count($exifCoord) > 1 ? gps2Num($exifCoord[1]) : 0;
  $seconds = count($exifCoord) > 2 ? gps2Num($exifCoord[2]) : 0;
 
  //normalize
  $minutes += 60 * ($degrees - floor($degrees));
  $degrees = floor($degrees);
 
  $seconds += 60 * ($minutes - floor($minutes));
  $minutes = floor($minutes);
 
  //extra normalization, probably not necessary unless you get weird data
  if($seconds >= 60)
  {
    $minutes += floor($seconds/60.0);
    $seconds -= 60*floor($seconds/60.0);
  }
 
  if($minutes >= 60)
  {
    $degrees += floor($minutes/60.0);
    $minutes -= 60*floor($minutes/60.0);
  }
 
  return array('degrees' => $degrees, 'minutes' => $minutes, 'seconds' => $seconds);
}












function gps2Num($coordPart)
{
  $parts = explode('/', $coordPart);
 
  if(count($parts) <= 0)
    return 0;
  if(count($parts) == 1)
    return $parts[0];
 
  return floatval($parts[0]) / floatval($parts[1]);
}



?>
