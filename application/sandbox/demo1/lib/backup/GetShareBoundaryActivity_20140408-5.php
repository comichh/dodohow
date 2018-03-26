<?php
	//-------------- include mysql profile ----------------------------
	include_once "../../../profile.php";
	include_once SqlServerProfiles;
	//-----------------------------------------------------------------
	$runType=$_GET['runType']."";
	$NELat=$_GET['NE_Lat'];
	$NELng=$_GET['NE_Lng'];
	$SWLat=$_GET['SW_Lat'];
	$SWLng=$_GET['SW_Lng'];

	try {
		$sqlstr.=" SELECT a.displayname,b.wCalory,b.Start_time,b.cSport6,a.image, b.id, b.deviceid, b.train_name, b.start_lat, b.start_lng ,d.for_societies_key1,b.lTotalDistance,b.lTotalTime,b.train_description ";
		$sqlstr.=" FROM tbl_user a, tbl_train_data b, tbl_device c , tbl_train_share_recode d ";
		$sqlstr.= $sql_from;
		$sqlstr.=" WHERE b.public_access=1 ";
		$sqlstr.=" and a.id = c.creator ";
		$sqlstr.=" and b.deviceid = c.deviceid ";
		$sqlstr.=" and b.public_access=1 ";
		if($runType!=="0"){
			$sqlstr.=" and b.cSport6 = ".$runType." ";
		}
		$sqlstr.=" and b.start_lat>=".$SWLat." and b.start_lat<=".$NELat;
		$sqlstr.=" and b.start_lng>=".$SWLng." and b.start_lat<=".$NELng;
		$sqlstr.=" order by b.id desc";

		mysql_query("set names 'utf8'"); 
		$result = mysql_query($sqlstr) or die($sqlstr);
		while($row = mysql_fetch_array($result)){
			$sqlstr2 ="select count(*) as totalcount from tbl_comment where for_train_id=".$row['id'];
			$result2 = mysql_query($sqlstr2) or die($sqlstr2);
			$row2 = mysql_fetch_array($result2);      
			$totalCount=$row2['totalcount'];
			$strdata.="{";
			$strdata.="id:'".$row['id']."',";
			$strdata.="fullname:'".$row['displayname']."',";
			$strdata.="image:'".UploadUserImgPhotoPath."/".$row['image']."',";
			$strdata.="deviceID:'".$row['deviceid']."',";
			$strdata.="train_name:'".$row['train_name']."',";
			$strdata.="lTotalDistance:'".$row['lTotalDistance']."',";
			$strdata.="train_description:'".$row['train_description']."',";
			$strdata.="StartTime:'".$row['Start_time']."',";
			$strdata.="lTotalTime:".$row['lTotalTime'].",";
			$strdata.="Calory:".$row['wCalory'].",";
			$strdata.="comment_count:".$totalCount.",";
			$strdata.="SportType:".$row['cSport6'].",";
			$strdata.="start_lat:".$row['start_lat'].",";
			$strdata.="start_lng:".$row['start_lng'];
			$strdata.="},";       
		}
		$strdata=substr($strdata,0,strlen($strdata)-1);
		$strdata="[".$strdata."]";
		echo $strdata;
	} catch (Exception $e) {
		 echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
?>
