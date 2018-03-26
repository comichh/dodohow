<?php
// 第一次進來的搜尋
/*
  還是會關連到，底層資料庫，主要是撈  no=0 那一點的座標，存開始經緯度的地方，是只有按分享後才會存
*/
  include (dirname(__FILE__)."/../../../../config/web.ini");
  include (dirname(__FILE__)."/../../../../config/mysql.php");
  include (dirname(__FILE__)."/../../../../function/slope_difficulty.php");
  $distance=50;
	$speedMeterStr='km/hr';

	$centerLat=$_GET['centerlat'];
	$centerLng=$_GET['centerlng'];

  session_start() ;
  $id=$_SESSION['user_id'];

$show_status=$_COOKIE['show_status'];


if ($show_status ==0){
 $query_1="select * from  tbl_device as b where b.creator='$id'";
}else{
  $query_1="select * from tbl_train_data as a,tbl_device as b";
  $query_1.=" where  a.deviceid=b.deviceid  and  a.public_access=1 ";
  $query_1.=" group by b.deviceid  ";
}
$result_1=mysql_query($query_1);
$i=0;
$accecpt=false;
while ($row_total=mysql_fetch_array($result_1))
{  
    $strdata='';
		$sqlstr="select *,a.id as train_id,c.image as user_image ";
    $sqlstr.=" FROM tbl_train_data a ,tbl_device b , tbl_user c,tbl_device_model d,$row_total[db_name] e ";
		$sqlstr.=" WHERE a.deviceid = b.deviceid and   b.creator = c.id  and b.model = d.id   and e.train_data_key=a.id and e.no='0' ";               

    if ($show_status ==0){    
   	    $sqlstr.=" and c.id='$id'";
    }else{
         $sqlstr.=" and  a.public_access=1 ";
    }
    //$sqlstr.=" limit 1";
    
    
//echo $sqlstr."\r\n";
		$result = mysql_query($sqlstr) or die($sqlstr);
    if ($result){
			while($row = mysql_fetch_array($result)){       	
				if($centerLat==999){         // 所以中心座標给他 999 ，跳過距離的計算        			  
           $strdata=rowInsertToClient($row);
           $accecpt=true;       
				}else{     			
          $dis=getDistance($row['latitude'],$row['longitude'],$centerLat,$centerLng);
					if($dis<=$distance){         
            $accecpt=true;     
            $strdata=rowInsertToClient($row);            
					}else{  $accecpt=false; }
				}
        if ( $accecpt==true){
           $i++;
           $temp_array[$i]=$strdata;
           if ($show_status !=0){
              $sort_array[$i]= $post_datetime;              
           }else{
             $sort_array[$i]= $Start_time;  
           }      
       }
			}
      } 
} 
 if ( $accecpt==true){    
     arsort($sort_array);    
     foreach($sort_array as $key => $value)
     {      
       $y=$y.$temp_array[$key];
     }
  $y=substr($y,0,-1);
  $strdata_1="[".$y."]";
}else{ $strdata_1="[]";}
	echo $strdata_1;


	function rowInsertToClient($row){
		global $http_path,$work_web,$post_datetime,$Start_time ;

		$sqlstr.=" SELECT count(*) FROM tbl_planning where tain_planning=".$row['train_id'];
   
		$result = mysql_query($sqlstr) or die($sqlstr);
 		$num_rows = mysql_num_rows($result);
    $train_id=$row['train_id'];

    $dis_km=$row['lTotalDistance']/1000;
    $height_km=$row['wAscent']/1000;
    $slope_pic=slope_difficulty ($dis_km,$height_km,$http_path);
    //  路段難度要寫入資料庫,因為搜尋需要。 若是要順便寫入初始經緯度，有困難，因為還是需要去撈基本資料庫
    if ($row['slope'] =='' or $row['slope']==0 ){
      $slope_value=slope_difficulty_1 ($dis_km,$height_km);
      $query_slope="update  tbl_train_data   set slope='$slope_value' where id=' $train_id'";
      $result_slope = mysql_query($query_slope) or die($query_slope);
    }   
    $slope_pic="$row[slope]<br>".str_replace( "'","\'",$slope_pic);
    $post_datetime=$row['post_datetime'];
    $Start_time=$row['Start_time'];

		$strdata="{";
		$strdata.="trainid:".$train_id.",";         
    $strdata.="slope_pic:'".$slope_pic."',";
		$strdata.="creator:'".$row['creator']."',";
 		$strdata.="deviceid:'".$row['deviceid']."',";
		$strdata.="displayname:'".$row['displayname']."',";
    $strdata.="UserImage:'".$work_web."/upload/user/".$row['user_image']."',";
		$strdata.="StartTime:'".$Start_time."',";
		$strdata.="StartLatitude:".$row['start_lat'].",";
		$strdata.="StartLongitude:".$row['start_lng'].",";
		$strdata.="Trainname:'".trim($row['train_name'])."',";
    if (mb_strlen($row['train_description'],"utf-8") > 30 ){
       $train_description=mb_substr(trim($row['train_description']),0,30,"utf-8");
       $train_description.=".....";
    }else{
       $train_description=trim($row['train_description']);
    }
    $train_description=str_replace("'"," ",$train_description);               
		$strdata.="Description:'".$train_description."',";       // 他這樣寫，單引號會出錯。先用作弊作法去掉               
		$strdata.="PublishTime:'".$post_datetime."',";
		$strdata.="PictureCount:".getPhotoCount($train_id).",";
		$strdata.="TotalTime:".$row['lTotalTime'].",";
		$strdata.="TotalDistance:".$row['lTotalDistance'].",";
    $strdata.="DeviceName:'".$row['name']."',";                // 機器型號
		$strdata.="PraiseCount:".getDataRowCount("tbl_praise","praise_train_key", $train_id).",";
    $strdata.="FavSportList:".getDataRowCount("tbl_planning","tain_planning", $train_id).",";
		$strdata.="CommentCount:".getItemCount( $train_id).",";
    $strdata.="public_access:".$row['public_access'];
		$strdata.="},";          
		return $strdata;
	}
	function getPhotoCount($tripID){
		$sqlstr=" SELECT count(*) as TotalPicCount FROM tbl_pic where pic_train_key=".$tripID;
		$result = mysql_query($sqlstr) or die($sqlstr);
		$row = mysql_fetch_array($result);
		return $row['TotalPicCount'];
		
	}
	
	function getDataRowCount($tableName,$colName,$id){
		try{
			$totalCount=0;
			$sqlstr="select count(*) as totalCount from ".$tableName." where ".$colName."=".$id;
			$result= mysql_query($sqlstr) or die($sqlstr);
			$row= mysql_fetch_array($result);
			$totalCount=$row['totalCount'];	
			return $totalCount;
		}catch(Exception $e) {
			return 0;
		}
	}
	
	function getItemCount($trainID){
		$sqlstr ="select count(*) as totalcount from tbl_comment where for_train_id=".$trainID;
		mysql_query("set names 'utf8'"); 
		$result = mysql_query($sqlstr) or die($sqlstr);
		$row = mysql_fetch_array($result);
		
		return $row['totalcount'];
	}
	
	function getdistance($lat1,$lng1,$lat2,$lng2)//根據經緯度計算計離
	{
		//將角度轉換為弧度
		$radLat1=deg2rad($lat1);
		$radLat2=deg2rad($lat2);
		$radLng1=deg2rad($lng1);
		$radLng2=deg2rad($lng2);
		$a=$radLat1-$radLat2;//兩緯度之差,緯度<90
		$b=$radLng1-$radLng2;//兩經度之差，精度<180
		//以下是根據google map的距離計算方式所換算出來的公式，
		//相關網站已經遺失..有找到在補上
		$distance=2*asin(sqrt(pow(sin($a/2),2)+cos($radLat1)*cos($radLat2)*pow(sin($b/2),2)))*6378.137;
		return $distance;
	}
	
?>
