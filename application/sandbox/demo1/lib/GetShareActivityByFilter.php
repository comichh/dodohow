<?php
 include (dirname(__FILE__)."/../../../../config/web.ini");
 include (dirname(__FILE__)."/../../../../config/mysql.php");
 include (dirname(__FILE__)."/../../../../function/slope_difficulty.php");
 mysql_query("set names 'utf8'");
 $dis_limit=50;

	$runType=$_GET['runType']."";
	$findUserName=trim($_GET['findUserName']);
	$sortType=trim($_GET['sortType']);
	$findkeyword=trim($_GET['findkeyword']);
	$startDate=trim($_GET['startDate']);
	$endDate=trim($_GET['endDate']);
	$distanceRangeStart=((int)trim($_GET['distanceRangeStart']))*1000;
	$distanceRangeEnd=((int)trim($_GET['distanceRangeEnd']))*1000;
	$timeRange=((int)trim($_GET['timeRange']))*10;
  $slope_diff=$_GET['slope_diff'];

	$centerLat=$_GET['lat'];
	$centerLng=$_GET['lng'];


$query_1="select * from tbl_train_data as a,tbl_device as b";
$query_1.=" where  a.deviceid=b.deviceid  and a.public_access=1 group by b.deviceid ";
$result_1=mysql_query($query_1);
$i=0;
$accecpt=false;
while ($row_total=mysql_fetch_array($result_1))
{
  if ($i<1000)           // 作一些限制，只秀出1000 筆 ，效能考量
  {      
    $strdata='';
    $sqlstr="select *,a.id as userID,a.image as user_image , b.id as a_id,a.displayname as a_fullname ";
    $sqlstr.=" FROM tbl_user a, tbl_train_data b, tbl_device c , tbl_train_share_recode d ,$row_total[db_name]  e ";
		$sqlstr.=" WHERE b.public_access=1 and e.train_data_key=b.id and e.no='0'";	
		if($findUserName!=""){
			$sqlstr.=" and a.displayname like '%".$findUserName."%' ";
		}
		$sqlstr.=" and a.id = c.creator ";
		$sqlstr.=" and b.deviceid = c.deviceid ";
		$sqlstr.=" and b.lTotalDistance between ".$distanceRangeStart." and ".$distanceRangeEnd." ";
		$sqlstr.=" and b.lTotalTime<=".$timeRange." ";
		if($runType!=="0"){
			$sqlstr.=" and b.cSport6 = ".$runType." ";
		}
		//key word filter
		if($findkeyword!=""){
			$sqlstr.=" and b.train_name like '%".$findkeyword."%' ";
		}	
		if($startDate!=""){
			$sqlstr.=" and b.Start_time>='".$startDate."' ";
		}
		if($endDate!=""){
			$sqlstr.=" and b.Start_time<='".$endDate."' ";
		}
    if($slope_diff!=""){
			$sqlstr.=" and b.slope ='$slope_diff'";
		}
		$result = mysql_query($sqlstr);
  
		while($row = mysql_fetch_array($result)){
      $row=escape($row);           // 他這樣寫，單引號會出錯。先用作弊作法去掉，理論上每一個地方都要這樣寫。   
      $train_id= $row['a_id']; 
        if($centerLat !=999){              
          $dis=getDistance($row['latitude'],$row['longitude'],$centerLat,$centerLng);    // 這裡做掉距離
        }
 
     if($dis<=$dis_limit or $centerLat==999 ){    
         $i++; 
         $accecpt=true;
		  if(getPicQueryResult($train_id)){		
				if(is_null($row['view_cnt'])){
					$viewCountVal=0;
				}else{
					$viewCountVal=$row['view_cnt'];
				}
      $dis_km=$row['lTotalDistance']/1000;
      $height_km=$row['wAscent']/1000;
      $slope_pic=slope_difficulty ($dis_km,$height_km,$http_path,1);
      $slope_pic=str_replace( "'","\'",$slope_pic);     
			$AccumulationAndMax=getAccumulationAndMax($row['userID']);
      
      $post_datetime=$row['post_datetime'];
      $lTotalTime=$row['lTotalTime'];

				$strdata="{";
	      $strdata.="id:'".$train_id."',";        
        $strdata.="slope_pic:'".$slope_pic."',";
				$strdata.="userid:'".$row['userID']."',";
        $strdata.="fullname:'".$row['a_fullname']."',";
        $strdata.="image:'".$work_web."/upload/user/".$row['user_image']."',";   
				$strdata.="deviceID:'".$row['deviceid']."',";
				$strdata.="train_name:'".$row['train_name']."',";
				$strdata.="lTotalDistance:'".$row['lTotalDistance']."',";
				//$train_description=str_replace("'"," ",$row['train_description']); 
			  //$strdata.="train_description:'".$train_description."',";
				$strdata.="StartTime:'".$row['Start_time']."',";
				$strdata.="lTotalTime:".$lTotalTime.",";
				$strdata.="Calory:".$row['wCalory'].",";
				$comment_number= getDataRowCount("tbl_comment","for_train_id",$train_id);
        $strdata.="comment_count:".$comment_number.",";
        $Praise_number=getDataRowCount("tbl_planning","tain_planning",$train_id); 		
				$strdata.="PraiseCount:".$Praise_number.",";
        $FavSport_number=getDataRowCount("tbl_praise","praise_train_key",$train_id);
				$strdata.="FavSportList:".$FavSport_number.",";
		    $strdata.="SportType:".$row['cSport6'].",";
				$strdata.="ViewCount:".$viewCountVal.",";
				$strdata.="AccDistance:".$AccumulationAndMax[0].",";
				$strdata.="AccTime:".$AccumulationAndMax[1].",";
				$strdata.="MaxhighestEle:".$AccumulationAndMax[2].",";
				$strdata.="AccRise:".$AccumulationAndMax[3].",";
				$strdata.="start_lat:".$row['start_lat'].",";  
				$strdata.="start_lng:".$row['start_lng'];
				$strdata.="},";
        $temp_array[$i]=$strdata;
//echo $strdata;

        switch($sortType){
         case "1":  
              $sort_array[$i]= $post_datetime;
          break;
         case "2":  
              $sort_array[$i]= $lTotalTime;
          break;     
          case "3":              
             $sort_array[$i]= $comment_number;
          break;
          case "4":
             $sort_array[$i]= $Praise_number;
          break;
          case "5":
             $sort_array[$i]= $FavSport_number;
          break; 
          default:          
             $sort_array[$i]= $post_datetime;
          break;        
     		}
       //echo $strdata;

    //echo $strdata."\r\n";
       }
			}
		}
  }

    //$y=$y.$strdata;
}    // 撈資料庫結束 ，沒有資料會直接跳到這裡，

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


	function getPicQueryResult($id){
		$photoExist=trim($_GET['photoExist']);
		$rowVaild=true;//default row exist in filter
		switch($photoExist){
			case "1"://photo exist
				if(getDataRowCount("tbl_pic","pic_train_key",$id)<=0){
					$rowVaild=false;
				}
				break;
			case "2"://photo none exist
				if(getDataRowCount("tbl_pic","pic_train_key",$id)>0){
					$rowVaild=false;
				}
				break;
		}
		return $rowVaild;
	}
	
	function getDataRowCount($tableName,$colName,$id){
			$totalCount=0;
			$sqlstr="select count(*) as totalCount from ".$tableName." where ".$colName."=".$id;
			$result= mysql_query($sqlstr) or die($sqlstr);
			$row= mysql_fetch_array($result);
			$totalCount=$row['totalCount'];	
			return $totalCount;
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

  function escape($row)
  { 
    foreach ($row as $key => $value )
    {
       $row[$key]=str_replace("'"," ",$value);      // 目前只跳脫單引。 
       if ($row[$key] ==''){$row[$key]=0;}     
    }
    return $row; 
  }


	
	function getAccumulationAndMax($userID){
		
		try{
			$sqlstr="SELECT SUM( b.lTotalDistance ) AS TotalDistance, SUM( b.lTotalTime ) AS TotalTime, MAX( sMaxAlti ) AS MaxAlti, SUM( b.wAscent ) AS TotalAscent
					FROM tbl_device a, tbl_train_data b, tbl_user c
					WHERE a.deviceid = b.deviceid
					AND c.id=".$userID."
					AND a.creator = c.id
					AND b.public_access =1
					GROUP BY c.id, c.displayname, c.image";	
			$result = mysql_query($sqlstr) or die($sqlstr);
			$row = mysql_fetch_array($result);
			if(!is_null($row)){
				return array($row["TotalDistance"],$row["TotalTime"],$row["MaxAlti"],$row["TotalAscent"]);
			}else{
				return array(0,0,0,0);
			}
		}catch(Exception $e){
			return array(0,0,0,0);
		}
		
	}
	
	

	
?>
