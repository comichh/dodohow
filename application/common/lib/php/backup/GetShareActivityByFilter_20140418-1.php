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
	$timeRange=((int)trim($_GET['timeRange']))*10;

	try {
		$sqlstr.="SELECT b.view_cnt,b.post_datetime,b.comment_cnt,a.id as userID,b.Start_time,b.wCalory,a.displayname,b.cSport6,a.image, b.id, b.deviceid, b.train_name, b.start_lat, b.start_lng ,d.for_societies_key1,b.lTotalDistance,b.lTotalTime,b.train_description ";
		$sqlstr.=" FROM tbl_user a, tbl_train_data b, tbl_device c , tbl_train_share_recode d ";
		$sqlstr.=" WHERE b.public_access=1 ";
		if($findUserName!=""){
			$sqlstr.=" and a.displayname like '%".$findUserName."%' ";
		}
		$sqlstr.=" and a.id = c.creator ";
		$sqlstr.=" and b.deviceid = c.deviceid ";
		$sqlstr.=" and b.lTotalDistance between ".$distanceRangeStart." and ".$distanceRangeEnd." ";
		$sqlstr.=" and b.lTotalTime<=".$timeRange." ";
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
				$sqlstr=getSpecialSortSQL("tbl_praise","praise_train_key",$timeRange,$distanceRangeStart,$distanceRangeEnd,$SWLat,$SWLng,$NELat,$NELng);
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
				$sqlstr=getSpecialSortSQL("tbl_planning","tain_planning",$timeRange,$distanceRangeStart,$distanceRangeEnd,$SWLat,$SWLng,$NELat,$NELng);
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
			//$totalCount=getDataRowCount("tbl_comment","for_train_id",$row['id']);			
				
			if(is_null($row['view_cnt'])){
				$viewCountVal=0;
			}else{
				$viewCountVal=$row['view_cnt'];
			}
			$AccumulationAndMax=getAccumulationAndMax($row['userID']);
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
			$strdata.="comment_count:".getDataRowCount("tbl_comment","for_train_id",$row['id']).",";
			$strdata.="SportType:".$row['cSport6'].",";
			$strdata.="PraiseCount:".getDataRowCount("tbl_planning","tain_planning",$row['id']).",";
			$strdata.="FavSportList:".getDataRowCount("tbl_praise","praise_train_key",$row['id']).",";
			$strdata.="ViewCount:".$viewCountVal.",";
			$strdata.="AccDistance:".$AccumulationAndMax[0].",";
			$strdata.="AccTime:".$AccumulationAndMax[1].",";
			$strdata.="MaxhighestEle:".$AccumulationAndMax[2].",";
			$strdata.="AccRise:".$AccumulationAndMax[3].",";
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
	
	function getSpecialSortSQL($joinTable,$colName,$timeRange,$distanceRangeStart,$distanceRangeEnd,$SWLat,$SWLng,$NELat,$NELng){
		$sql="SELECT view_cnt,post_datetime, comment_cnt, userID, Start_time, wCalory, displayname, cSport6, image, id, deviceid, train_name, start_lat, start_lng, for_societies_key1, lTotalDistance, lTotalTime, train_description, COUNT( b.".$colName." ) AS parseCount
			FROM (
			SELECT b.view_cnt,b.post_datetime, b.comment_cnt, a.id AS userID, b.Start_time, b.wCalory, a.displayname, b.cSport6, a.image, b.id, b.deviceid, b.train_name, b.start_lat, b.start_lng, d.for_societies_key1, b.lTotalDistance, b.lTotalTime, b.train_description
			FROM tbl_user a, tbl_train_data b, tbl_device c, tbl_train_share_recode d
			WHERE b.public_access =1
			AND a.id = c.creator
			AND b.deviceid = c.deviceid
			AND b.lTotalTime<=".$timeRange."
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
	
	function getAccumulationAndMax($userID){
		
		try{
			$sqlstr="SELECT SUM( b.lTotalDistance ) AS TotalDistance, SUM( b.lTotalTime ) AS TotalTime, MAX( sMaxAlti ) AS MaxAlti, SUM( b.wAscent ) AS TotalAscent
					FROM tbl_device a, tbl_train_data b, tbl_user c
					WHERE a.deviceid = b.deviceid
					AND c.id=".$userID."
					AND a.creator = c.id
					AND b.public_access =1
					GROUP BY c.id, c.displayname, c.image";
			mysql_query("set names 'utf8'"); 
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
