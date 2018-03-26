<?php
	//-------------- include mysql profile ----------------------------
	include_once "ThisProfiles.php";
	include_once SqlServerProfiles;
	//-----------------------------------------------------------------
	
	$tableName=trim($_GET['deviceID']);	//設備記錄表名稱 for transtrip
	$tableNameArray=explode("-",$tableName);

	$query_1="select * from tbl_device where deviceid='$tableName'"; 
	mysql_query("set names 'utf8'"); 
	$result_1 = mysql_query($query_1) or die('MySQL query error1');
	while($row1 = mysql_fetch_array($result_1)){
		$tableNameForRowdata=$row1['db_name'];
	}
  
	$tripID=trim($_GET['tripID']);
	$speedMeter=0.01;
	$speedMeterStr='km/hr';
	
	$photoCount=0;
	foreach(glob('../../../sandbox/FileUpload/server/php/files/'.$tripID.'/{*.jpg,*.gif,*.png}', GLOB_BRACE | GLOB_NOSORT) as $imagename){
		$photoCount+=1;
	}
	
	try {
		$sqlstr="select wAvgCadns,wBestCadns,wAvgPower,wMaxPower,train_name,train_description,wTotalPoint,lTotalTime,lTotalDistance,wLapCnts,wCalory,lMaxSpeed,cMaxHeart,cAvgHeart,wAscent,wDescent,sMinAlti,sMaxAlti ";
		$sqlstr.=" from tbl_train_data";
		$sqlstr.=" where id=".$tripID;
		
		mysql_query("set names 'utf8'"); 
		$result = mysql_query($sqlstr) or die('MySQL query error1');
		while($row = mysql_fetch_array($result)){
		   	$strdata="Trainname:'".$row['train_name']."',";
			$strdata.="Description:'".$row['train_description']."',";
			$strdata.="TotalPoint:".$row['wTotalPoint'].",";
			$strdata.="TotalTime:".$row['lTotalTime'].",";
			$strdata.="TotalDistance:".$row['lTotalDistance'].",";
			$strdata.="LapCnts:".$row['wLapCnts'].",";
			$strdata.="Calory:".$row['wCalory'].",";
			$strdata.="MaxSpeed:".$row['lMaxSpeed'].",";
			$strdata.="MaxHeart:".$row['cMaxHeart'].",";
			$strdata.="AvgHeart:".$row['cAvgHeart'].",";
			$strdata.="Ascent:".$row['wAscent'].",";
			$strdata.="Descent:".$row['wDescent'].",";
			$strdata.="AvgCadns:".$row['wAvgCadns'].",";
			$strdata.="BestCadns:".$row['wBestCadns'].",";
			$strdata.="AvgPower:".$row['wAvgPower'].",";
			$strdata.="MaxPower:".$row['wMaxPower'].",";
			$strdata.="MinAlti:".$row['sMinAlti'].",";
			$strdata.="MaxAlti:".$row['sMaxAlti'].",";
			$strdata.="PhotoCount:".$photoCount;
		}

		$sqlstr="select id,start_time,latitude,longitude,altitude,speed,heart_rate,cadence,pwr_cadence,power,distance";
		$sqlstr.=" from ".$tableNameForRowdata;
		$sqlstr.=" where train_data_key=".$tripID;
		$sqlstr.=" order by start_time";
		$result = mysql_query($sqlstr) or die('MySQL query error2');
		while($row = mysql_fetch_array($result)){
			$strdataSub.="{";
			$strdataSub.="id:'".$row['id']."',";
			$strdataSub.="start_time:'".$row['start_time']."',";
			$strdataSub.="latitude:".$row['latitude'].",";
			$strdataSub.="longitude:".$row['longitude'].",";
			$strdataSub.="altitude:".$row['altitude'].",";
			$strdataSub.="speed:".$row['speed']*$speedMeter.",";
			$strdataSub.="heart_rate:".$row['heart_rate'].",";
			$strdataSub.="cadence:".$row['cadence'].",";
			$strdataSub.="pwr_cadence:".$row['pwr_cadence'].",";
			$strdataSub.="power:".$row['power'].",";
			$strdataSub.="distance:".$row['distance'].",";
			$strdataSub.="speedMeter:'".$speedMeterStr."'";
			$strdataSub.="},";
		}
		$strdataSub=substr($strdataSub,0,strlen($strdataSub)-1);
		$strdataSub="[".$strdataSub."]";
		$strdata="[{".$strdata.",Detail:".$strdataSub."}]";
		echo $strdata;
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
	
	
?>