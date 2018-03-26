<?php
  // 只有表格頁使用 ,地圖頁，他又是獨立的， 進階搜尋的時候，目前都是忽略地點！
  include (dirname(__FILE__)."/../../../../config/web.ini");
  include (dirname(__FILE__)."/../../../../auth.php");
  include (dirname(__FILE__)."/../../../../config/mysql.php");
  include (dirname(__FILE__)."/../../../../config/lang_select.php");
  include (dirname(__FILE__)."/../../../../function/slope_difficulty.php");


  //mysql_query("set names 'utf8'"); 
	$runType=$_GET['runType']."";
   
	$findkeyword=trim($_GET['findkeyword']);
	$startDate=trim($_GET['startDate']);
	$endDate=trim($_GET['endDate']);
	$distanceRangeStart=((int)trim($_GET['distanceRangeStart']))*1000;
	$distanceRangeEnd=((int)trim($_GET['distanceRangeEnd']))*1000;
	$timeRange=((int)trim($_GET['timeRange']))*10;
  $slope_diff=$_GET['slope_diff'];  

// 用  cookie 去判斷,到底是哪一頁要用的
$show_status=$_COOKIE['show_status'];

if ($show_status ==0 )
{
  $findUserName=$_SESSION['displayname'];
}else{
	$findUserName=trim($_GET['findUserName']);
}



	  $sqlstr.="select *,b.id as train_id,a.displayname as user_displayname,a.id as userID,a.image as user_image ";
    $sqlstr.=" FROM tbl_user a, tbl_train_data b, tbl_device c , tbl_train_share_recode d ,tbl_device_model e ";
    $sqlstr.=" where a.id = c.creator and e.id=c.model";
		$sqlstr.=" and b.deviceid = c.deviceid ";
		$sqlstr.=" and b.lTotalDistance between ".$distanceRangeStart." and ".$distanceRangeEnd." ";
		$sqlstr.=" and b.lTotalTime<=".$timeRange." ";	
		if($runType!=="0"){
			$sqlstr.=" and b.cSport6 = ".$runType." ";
		}
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
   // if($findUserName!="" and $findUserName!='null'){
			$sqlstr.=" and a.displayname like '%".$findUserName."%' ";
	 // }
    if ($show_status !=0){
      $sqlstr.=" and  b.public_access=1 ";
      $sqlstr.=" order by b.post_datetime desc";   
    }else{
      $sqlstr.=" order by b.Start_time DESC";
    }  	
   // echo $sqlstr."\r\n";


		$result = mysql_query($sqlstr) or die($sqlstr);
		while($row = mysql_fetch_array($result)){		
			if(getPicQueryResult($row['id'])){	  
        /*           
				if(is_null($row['view_cnt'])){
					$viewCountVal=0;
				}else{
					$viewCountVal=$row['view_cnt'];
				} 
       */       
    $dis_km=$row['lTotalDistance']/1000;
    $height_km=$row['wAscent']/1000;
    $slope_pic=slope_difficulty ($dis_km,$height_km,$http_path);
    $slope_pic=str_replace( "'","\'",$slope_pic);
    // js 的距離，都是 js 部分才再去運算,所以這邊不管

				//$AccumulationAndMax=getAccumulationAndMax($row['userID']);
				$strdata.="{";
				$strdata.="trainid:'".$row['train_id']."',";
        $strdata.="slope_pic:'".$slope_pic."',";
				$strdata.="PostDatetime:'".$row['post_datetime']."',";
				$strdata.="userid:'".$row['userID']."',";
				$strdata.="fullname:'".$row['user_displayname']."',";
        $strdata.="image:'".$work_web."/upload/user/".$row['user_image']."',";
				$strdata.="deviceID:'".$row['deviceid']."',";
				$strdata.="train_name:'".$row['train_name']."',";
				$strdata.="lTotalDistance:'".$row['lTotalDistance']."',";
        $train_description=mb_substr($row['train_description'],0,30,"utf-8");
        if (mb_strlen($row['train_description'],"utf-8") > 30 ){$train_description.=".....";}
        $train_description=str_replace("'"," ",$train_description);   
				$strdata.="train_description:'".$train_description."',";	
        $strdata.="StartTime:'".$row['Start_time']."',";
				$strdata.="lTotalTime:".$row['lTotalTime'].",";
				$strdata.="PictureCount:".getDataRowCount("tbl_pic","pic_train_key",$row['train_id']).",";
				//$strdata.="Calory:".$row['wCalory'].",";
				$strdata.="comment_count:".getDataRowCount("tbl_comment","for_train_id",$row['train_id']).",";
				//$strdata.="SportType:".$row['cSport6'].",";
        $strdata.="DeviceName:'".$row['name']."',";           // 機器型號
				$strdata.="PraiseCount:".getDataRowCount("tbl_planning","tain_planning",$row['train_id']).",";
				$strdata.="FavSportList:".getDataRowCount("tbl_praise","praise_train_key",$row['train_id']).",";
				//$strdata.="ViewCount:".$viewCountVal.",";
				//$strdata.="AccDistance:".$AccumulationAndMax[0].",";
				//$strdata.="AccTime:".$AccumulationAndMax[1].",";
				//$strdata.="MaxhighestEle:".$AccumulationAndMax[2].",";
				//$strdata.="AccRise:".$AccumulationAndMax[3].",";
        $strdata.="public_access:".$row['public_access'].",";
				$strdata.="start_lat:".$row['start_lat'].",";
				$strdata.="start_lng:".$row['start_lng'];
				$strdata.="},";
			}
		}
		$strdata=substr($strdata,0,strlen($strdata)-1);
		$strdata="[".$strdata."]";
		echo $strdata;

	
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
