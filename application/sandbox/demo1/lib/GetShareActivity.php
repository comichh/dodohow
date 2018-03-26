<?php
  // 這個是按下 腳踏車，跑步後但是這個應該是有 bug ~~~~
	//-------------- include mysql profile ----------------------------
//	include_once "../../../profile.php";
//	include_once SqlServerProfiles;
 include (dirname(__FILE__)."/../../../../config/web.ini");
 include (dirname(__FILE__)."/../../../../config/mysql.php");
 include (dirname(__FILE__)."/../../../../function/slope_difficulty.php");
 mysql_query("set names 'utf8'"); 
	//-----------------------------------------------------------------
	$runType=$_GET['runType']."";
	$sortName=trim($_GET['sortName']);
	// 社團功能暫時取消
  /*
	$societies_select=$_GET['societies_select'];
	if ($societies_select ==0){
	 $sql_societies=" and b.public_access=1";
	   //$sql_from=" FROM tbl_user a, tbl_train_data b, tbl_device c,tbl_train_share_recode d ";
	}
	else { 
	  $sql_societies=" AND b.id = d.for_train_key1 and d.for_societies_key1='$societies_select'";
	  //$sql_from=" FROM tbl_user a, tbl_train_data b, tbl_device c , tbl_train_share_recode d ";
	}
  */
		$sqlstr.=" SELECT b.view_cnt,a.id as userID,b.Start_time,b.wCalory,a.displayname,b.cSport6,a.image, b.wAscent,b.id, b.deviceid, b.train_name, b.start_lat, b.start_lng ,d.for_societies_key1,b.lTotalDistance,b.lTotalTime,b.train_description ";
		$sqlstr.=" FROM tbl_user a, tbl_train_data b, tbl_device c , tbl_train_share_recode d ";
		$sqlstr.= $sql_from;
		$sqlstr.=" WHERE b.public_access=1 ";
		$sqlstr.=" and a.id = c.creator ";
		$sqlstr.=" and b.deviceid = c.deviceid ";
		if($runType!=="0"){
			$sqlstr.=" and b.cSport6 = ".$runType." ";
		}	
		//$sqlstr.=$sql_societies;
		if($sortName===""){
			$sqlstr.=" order by b.post_datetime desc";
		}else{
			$sqlstr.=" order by b.".$sortName." desc";
		}

		$result = mysql_query($sqlstr);
		while($row = mysql_fetch_array($result)){
			$sqlstr2 ="select count(*) as totalcount from tbl_comment where for_train_id=".$row['id'];
			$result2 = mysql_query($sqlstr2) or die($sqlstr2);
			$row2 = mysql_fetch_array($result2);      
			$totalCount=$row2['totalcount'];
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
			$strdata.="{";
			$strdata.="id:'".$row['id']."',";
      $strdata.="slope_pic:'".$slope_pic."',";
			$strdata.="userid:'".$row['userID']."',";
			$strdata.="fullname:'".$row['displayname']."',";
			$strdata.="image:'".$work_web."/upload/user/".$row['image']."',";	
  		$strdata.="deviceID:'".$row['deviceid']."',";
			$strdata.="train_name:'".$row['train_name']."',";
			$strdata.="lTotalDistance:'".$row['lTotalDistance']."',";
      $train_description=str_replace("'"," ",$row['train_description']); 
			$strdata.="train_description:'".$train_description."',";
			$strdata.="StartTime:'".$row['Start_time']."',";
			$strdata.="lTotalTime:".$row['lTotalTime'].",";
			$strdata.="Calory:".$row['wCalory'].",";
			$strdata.="SportType:".$row['cSport6'].",";
			$strdata.="comment_count:".getDataRowCount("tbl_comment","for_train_id",$row['id']).",";
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
			$result = mysql_query($sqlstr);
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
