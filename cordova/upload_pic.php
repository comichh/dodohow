<?php
header("Access-Control-Allow-Origin:*");   
include ("../config/mysql.php");
include ("../function/random.php");

$value_get=file_get_contents("php://input");            // 用 post 收不到
$value=json_decode($value_get,true);


$name=$value['name'];
$parameter=str_replace("#",'',$value['parameter']);
$auth=$value['auth'];
$user_id=$value['user_id'];


$query="select * from tbl_user as a, tbl_device as b , tbl_train_data as c";
$query.=" where a.id='$user_id' and a.password='$auth' and b.creator=a.id and b.deviceid=c.deviceid and c.id='$parameter'";
$result=mysql_query($query);
$num=0;
$num=mysql_num_rows($result);
if ( $num ==1 )
{
  $auth_user='true';
  $row=mysql_fetch_array($result);
  $db_name=$row['db_name'];     
}else{
  $auth_user='false';
  $return['result']='no';
}


if ( $auth_user == true)
{

   $temp=explode (",",$name);                        // 去除掉 base64 前面的多餘東西   
   $pic=base64_decode($temp[1],true);                
 
   $write_path="/home/wwwroot/dodohow/upload/trip_photo/$user_id";
   if (!is_dir ($write_path/$parameter))      // 先檢查目錄是否存在，
   {
     system ("mkdir $write_path",$return_file);
     system ("mkdir $write_path/$parameter",$return_file);
     system ("mkdir $write_path/$parameter/thumbnail",$return_file);   
   }
   $random=generatorPassword();
   $file_name=$parameter."_"."$random.jpg";
   $map_pic_path=$write_path."/$parameter/".$file_name;
   file_put_contents($map_pic_path, $pic);       // 將內容寫入到檔案
      // 產生縮圖
   $create_pic="convert -sample '800x600'  $map_pic_path  $write_path/$parameter/thumbnail/$file_name";
   system($create_pic,$create_result);        
   // 寫進資料庫，實際上圖片都有抓經緯度，這邊都先不要。都直接用預設值就好
   $query="select * from $db_name where train_data_key='$parameter' and no='0'";       // 沒有比對到，取第一點   
   $result=mysql_query($query);
   $row_total=mysql_fetch_array($result);   
   $new_lat=$row_total['latitude'];        
   $new_lng=$row_total['longitude'];
   $query="INSERT INTO tbl_pic(`pic_train_key`,`pic_lat`, `pic_lng`,`pic_name`)";
   $query.=" VALUES ('$parameter','$new_lat','$new_lng','$file_name')";
   $result=mysql_query($query);  

   $return['result']='ok';
   $return['file']=$file_name;
}

echo json_encode($return);

?>
