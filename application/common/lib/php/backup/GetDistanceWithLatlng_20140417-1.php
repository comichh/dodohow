<?php
	//-------------- include mysql profile ----------------------------
	include_once "ThisProfiles.php";
	include_once SqlServerProfiles;
	//-----------------------------------------------------------------
		
	$speedMeterStr='km/hr';
	$centerLat=$_POST['centerlat'];
	$centerLng=$_POST['centerlng'];
	$distance=$_POST['distance'];
	$minSportDistance=intval($_POST['minSportDistance'])*1000;
	$maxSportDistance=intval($_POST['maxSportDistance'])*1000;
	$userSearch=$_POST['userSearch'];
	$sportNameSearch=$_POST['sportNameSearch'];
	$sportDescriptionSearch=$_POST['sportDescriptionSearch'];
	$sportDurtionSearch=intval($_POST['sportDurtionSearch'])*10;
	$sportMessageLimit=$_POST['sportMessageLimit'];
	
	$sqlSubQuery=" and a.id in (SELECT c.id FROM tbl_train_data c left join tbl_comment d on c.id=d.for_train_id group by c.id having count(d.for_train_id)>=".$sportMessageLimit.")";
	
	if(($minSportDistance!=0)&&($maxSportDistance!=0)){
		$sqlSportDistance=" And a.lTotalDistance between ".$minSportDistance." and ".$maxSportDistance;
	}else{
		$sqlSportDistance="";
	}
		
	if($userSearch!=""){
		$sqlSearchDisplayName=" And c.displayname like '%".$userSearch."%'";
	}else{
		$sqlSearchDisplayName="";
	}
	
	if($sportNameSearch!=""){
		$sqlSearchSportName=" And a.train_name like '%".$sportNameSearch."%'";
	}else{
		$sqlSearchSportName="";
	}
	
	if($sportDescriptionSearch!=""){
		$sqlSearchDescription=" And a.train_description like '%".$sportDescriptionSearch."%'";
	}else{
		$sqlSearchDescription="";
	}
	
	if($sportDurtionSearch!=0){
		$sqlSearchDurtion=" And a.lTotalTime <=".$sportDurtionSearch;
	}else{
		$sqlSearchDurtion="";
	}
		
	try {
		$sqlstr.=" SELECT a.start_lat,a.start_lng,b.creator, c.displayname, c.image, a.Start_time, a.id,a.deviceid,a.train_name,a.post_datetime,a.train_description, a.wTotalPoint, a.lTotalTime, a.lTotalDistance,d.name as devicename";
		$sqlstr.=" FROM tbl_train_data a ";
		$sqlstr.=" INNER JOIN tbl_device b ON a.deviceid = b.deviceid ";
		$sqlstr.=" INNER JOIN tbl_user c ON b.creator = c.id ";
		$sqlstr.=" INNER JOIN tbl_device_model d ON b.model = d.id ";
		$sqlstr.=" WHERE a.public_access =1 ";
		$sqlstr.=$sqlSubQuery;
		$sqlstr.=$sqlSportDistance;
		$sqlstr.=$sqlSearchDisplayName;
		$sqlstr.=$sqlSearchSportName;
		$sqlstr.=$sqlSearchDescription;
		$sqlstr.=$sqlSearchDurtion;
		$sqlstr.=" ORDER BY a.post_datetime DESC";
		
		
		mysql_query("set names 'utf8'"); 
		$result = mysql_query($sqlstr) or die($sqlstr);
		$num_rows = mysql_num_rows($result);
		if($num_rows>0){
			while($row = mysql_fetch_array($result)){
				if($centerLat==999){
					/*
					$strdata.="{";
					$strdata.="creator:'".$row['creator']."',";
					$strdata.="trainid:".$row['id'].",";
					$strdata.="deviceid:'".$row['deviceid']."',";
					$strdata.="displayname:'".$row['displayname']."',";
					$strdata.="UserImage:'".$row['image']."',";
					$strdata.="StartTime:'".$row['Start_time']."',";
					$strdata.="StartLatitude:".$row['start_lat'].",";
					$strdata.="StartLongitude:".$row['start_lng'].",";
					$strdata.="Trainname:'".$row['train_name']."',";
					$strdata.="Description:'".$row['train_description']."',";
					$strdata.="PublishTime:'".$row['post_datetime']."',";
					$strdata.="PictureCount:".getPhotoCount($row['id']).",";
					$strdata.="TotalTime:".$row['lTotalTime'].",";
					$strdata.="TotalDistance:".$row['lTotalDistance'].",";
					$strdata.="DeviceName:'".$row['devicename']."',";
					$strdata.="CommentCount:".getItemCount($row['id']);
					$strdata.="},";
					*/
					$strdata.=rowInsertToClient($row);
				}else{
					$dis=getDistance($row['start_lat'],$row['start_lng'],$centerLat,$centerLng);
					if($dis<=$distance){
						/*
						$strdata.="{";
						$strdata.="creator:'".$row['creator']."',";
						$strdata.="trainid:".$row['id'].",";
						$strdata.="deviceid:'".$row['deviceid']."',";
						$strdata.="displayname:'".$row['displayname']."',";
						$strdata.="UserImage:'".$row['image']."',";
						$strdata.="StartTime:'".$row['Start_time']."',";
						$strdata.="StartLatitude:".$row['start_lat'].",";
						$strdata.="StartLongitude:".$row['start_lng'].",";
						$strdata.="Trainname:'".$row['train_name']."',";
						$strdata.="Description:'".$row['train_description']."',";
						$strdata.="PublishTime:'".$row['post_datetime']."',";
						$strdata.="PictureCount:".getPhotoCount($row['id']).",";
						$strdata.="TotalTime:".$row['lTotalTime'].",";
						$strdata.="TotalDistance:".$row['lTotalDistance'].",";
						$strdata.="DeviceName:'".$row['devicename']."',";
						$strdata.="CommentCount:".getItemCount($row['id']);
						$strdata.="},";
						*/
						$strdata.=rowInsertToClient($row);
					}
				}
			}
			$strdata=substr($strdata,0,strlen($strdata)-1);
			$strdata="[".$strdata."]";
		}else{
			$strdata="[]";
		}
		echo $strdata;
		//echo $sqlstr;
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
	function rowInsertToClient($row){
		
		$sqlstr.=" SELECT count(*) FROM tbl_planning where tain_planning=".$row['id'];
		mysql_query("set names 'utf8'"); 
		$result = mysql_query($sqlstr) or die($sqlstr);
		$num_rows = mysql_num_rows($result);
						
		$strdata.="{";
		$strdata.="creator:'".$row['creator']."',";
		$strdata.="trainid:".$row['id'].",";
		$strdata.="deviceid:'".$row['deviceid']."',";
		$strdata.="displayname:'".$row['displayname']."',";
		$strdata.="UserImage:'".$row['image']."',";
		$strdata.="StartTime:'".$row['Start_time']."',";
		$strdata.="StartLatitude:".$row['start_lat'].",";
		$strdata.="StartLongitude:".$row['start_lng'].",";
		$strdata.="Trainname:'".$row['train_name']."',";
		$strdata.="Description:'".$row['train_description']."',";
		$strdata.="PublishTime:'".$row['post_datetime']."',";
		$strdata.="PictureCount:".getPhotoCount($row['id']).",";
		$strdata.="TotalTime:".$row['lTotalTime'].",";
		$strdata.="TotalDistance:".$row['lTotalDistance'].",";
		$strdata.="DeviceName:'".$row['devicename']."',";
		$strdata.="CommentCount:".getItemCount($row['id']).",";
		$strdata.="FavSportList:".$num_rows;
		$strdata.="},";
		
		return $strdata;
	}
	
	function getPhotoCount($tripID){
		$index=0;
		foreach(glob('../../../sandbox/FileUpload/server/php/files/'.$tripID.'/thumbnail/{*.jpg,*.gif,*.png}', GLOB_BRACE | GLOB_NOSORT) as $imagename){
			$index+=1;
		}
		return $index;
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
