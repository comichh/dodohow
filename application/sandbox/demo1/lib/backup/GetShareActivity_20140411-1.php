<?php
	//-------------- include mysql profile ----------------------------
	include_once "../../../profile.php";
	include_once SqlServerProfiles;
	//-----------------------------------------------------------------
	$runType=$_GET['runType']."";
	$sortName=trim($_GET['sortName']);
	
	$societies_select=$_GET['societies_select'];
	// 社團功能暫時取消
	if ($societies_select ==0){
	 $sql_societies=" and b.public_access=1";
	   //$sql_from=" FROM tbl_user a, tbl_train_data b, tbl_device c,tbl_train_share_recode d ";
	}
	else { 
	  $sql_societies=" AND b.id = d.for_train_key1 and d.for_societies_key1='$societies_select'";
	  //$sql_from=" FROM tbl_user a, tbl_train_data b, tbl_device c , tbl_train_share_recode d ";
	}

	try {
		$sqlstr.=" SELECT a.id as userID,b.Start_time,b.wCalory,a.displayname,b.cSport6,a.image, b.id, b.deviceid, b.train_name, b.start_lat, b.start_lng ,d.for_societies_key1,b.lTotalDistance,b.lTotalTime,b.train_description ";
		$sqlstr.=" FROM tbl_user a, tbl_train_data b, tbl_device c , tbl_train_share_recode d ";
		$sqlstr.= $sql_from;
		$sqlstr.=" WHERE b.public_access=1 ";
		$sqlstr.=" and a.id = c.creator ";
		$sqlstr.=" and b.deviceid = c.deviceid ";
		if($runType!=="0"){
			$sqlstr.=" and b.cSport6 = ".$runType." ";
		}	
		$sqlstr.=$sql_societies;
		if($sortName===""){
			$sqlstr.=" order by b.post_datetime desc";
		}else{
			$sqlstr.=" order by b.".$sortName." desc";
		}


		mysql_query("set names 'utf8'"); 
		$result = mysql_query($sqlstr) or die($sqlstr);
		while($row = mysql_fetch_array($result)){
			$sqlstr2 ="select count(*) as totalcount from tbl_comment where for_train_id=".$row['id'];
			$result2 = mysql_query($sqlstr2) or die($sqlstr2);
			$row2 = mysql_fetch_array($result2);      
			$totalCount=$row2['totalcount'];
			$strdata.="{";
			$strdata.="id:'".$row['id']."',";
			$strdata.="userid:'".$row['userID']."',";
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
