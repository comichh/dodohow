<?php
	//-------------- include mysql profile ----------------------------
	include_once "../../../profile.php";
	include_once SqlServerProfiles;
	//-----------------------------------------------------------------
	$runType=$_GET['runType']."";
	$findUserName=trim($_GET['findUserName']);
	$sortType=trim($_GET['sortType']);
	$findkeyword=trim($_GET['findkeyword']);
	$startDate=trim($_GET['startDate']);
	$endDate=trim($_GET['endDate']);
	$distanceRangeStart=((int)trim($_GET['distanceRangeStart']))*1000;
	$distanceRangeEnd=((int)trim($_GET['distanceRangeEnd']))*1000;
	
	try {
		$sqlstr.="SELECT b.post_datetime,b.comment_cnt,a.id as userID,b.Start_time,b.wCalory,a.displayname,b.cSport6,a.image, b.id, b.deviceid, b.train_name, b.start_lat, b.start_lng ,d.for_societies_key1,b.lTotalDistance,b.lTotalTime,b.train_description ";
		$sqlstr.=" FROM tbl_user a, tbl_train_data b, tbl_device c , tbl_train_share_recode d ";
		$sqlstr.=" WHERE b.public_access=1 ";
		if($findUserName!=""){
			$sqlstr.=" and a.displayname like '%".$findUserName."%' ";
		}
		$sqlstr.=" and a.id = c.creator ";
		$sqlstr.=" and b.deviceid = c.deviceid ";
		$sqlstr.=" and b.lTotalDistance between ".$distanceRangeStart." and ".$distanceRangeEnd." ";
		//Sport Type filter
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
		
		
		switch($sortType){
			case "1":
				$sqlstr.=" order by b.post_datetime desc";
				break;
			case "2":
				$sqlstr.=" order by b.lTotalTime desc";
				break;
			case "3":
				$sqlstr.=" order by b.comment_cnt desc";
				break;
			case "4":
				$sqlstr=getSpecialSortSQL("tbl_praise","praise_train_key");
				/*
				$sqlstr="SELECT post_datetime, comment_cnt, userID, Start_time, wCalory, displayname, cSport6, image, id, deviceid, train_name, start_lat, start_lng, for_societies_key1, lTotalDistance, lTotalTime, train_description, COUNT( b.praise_train_key ) AS parseCount
				FROM (
				SELECT b.post_datetime, b.comment_cnt, a.id AS userID, b.Start_time, b.wCalory, a.displayname, b.cSport6, a.image, b.id, b.deviceid, b.train_name, b.start_lat, b.start_lng, d.for_societies_key1, b.lTotalDistance, b.lTotalTime, b.train_description
				FROM tbl_user a, tbl_train_data b, tbl_device c, tbl_train_share_recode d
				WHERE b.public_access =1
				AND a.id = c.creator
				AND b.deviceid = c.deviceid
				) AS a
				LEFT OUTER JOIN tbl_praise b ON a.id = b.praise_train_key
				GROUP BY a.id
				ORDER BY parseCount DESC";
				*/
				break;
			case "5":
				$sqlstr=getSpecialSortSQL("tbl_planning","tain_planning");
				/*
				$sqlstr="SELECT post_datetime, comment_cnt, userID, Start_time, wCalory, displayname, cSport6, image, id, deviceid, train_name, start_lat, start_lng, for_societies_key1, lTotalDistance, lTotalTime, train_description, COUNT( b.tain_planning ) AS parseCount
				FROM (
				SELECT b.post_datetime, b.comment_cnt, a.id AS userID, b.Start_time, b.wCalory, a.displayname, b.cSport6, a.image, b.id, b.deviceid, b.train_name, b.start_lat, b.start_lng, d.for_societies_key1, b.lTotalDistance, b.lTotalTime, b.train_description
				FROM tbl_user a, tbl_train_data b, tbl_device c, tbl_train_share_recode d
				WHERE b.public_access =1
				AND a.id = c.creator
				AND b.deviceid = c.deviceid
				) AS a
				LEFT OUTER JOIN tbl_planning b ON a.id = b.tain_planning
				GROUP BY a.id
				ORDER BY parseCount DESC";
				*/
				break;
		}

		mysql_query("set names 'utf8'"); 
		$result = mysql_query($sqlstr) or die($sqlstr);
		while($row = mysql_fetch_array($result)){
			$totalCount=getDataRowCount("tbl_comment","for_train_id",$row['id']);			
			if(getPicQueryResult($row['id'])){		
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
		}
		$strdata=substr($strdata,0,strlen($strdata)-1);
		$strdata="[".$strdata."]";
		echo $strdata;
	} catch (Exception $e) {
		 echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
	function getSpecialSortSQL($joinTable,$colName){
		$sql="SELECT post_datetime, comment_cnt, userID, Start_time, wCalory, displayname, cSport6, image, id, deviceid, train_name, start_lat, start_lng, for_societies_key1, lTotalDistance, lTotalTime, train_description, COUNT( b.".$colName." ) AS parseCount
			FROM (
			SELECT b.post_datetime, b.comment_cnt, a.id AS userID, b.Start_time, b.wCalory, a.displayname, b.cSport6, a.image, b.id, b.deviceid, b.train_name, b.start_lat, b.start_lng, d.for_societies_key1, b.lTotalDistance, b.lTotalTime, b.train_description
			FROM tbl_user a, tbl_train_data b, tbl_device c, tbl_train_share_recode d
			WHERE b.public_access =1
			AND a.id = c.creator
			AND b.deviceid = c.deviceid
			AND b.lTotalDistance between ".$distanceRangeStart." and ".$distanceRangeEnd."
			) AS a
			LEFT OUTER JOIN ".$joinTable." b ON a.id = b.".$colName." 
			GROUP BY a.id
			ORDER BY parseCount DESC";
		return $sql;
	}
	
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
	
?>
