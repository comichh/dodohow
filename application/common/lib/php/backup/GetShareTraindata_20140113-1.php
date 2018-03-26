<?php
	include_once "../../../../config/mysql.php";
	$tableName=trim($_GET['deviceID']);	//設備記錄表名稱 for transtrip
	$tableNameArray=explode("-",$tableName);
	$tableNameForRowdata=$tableNameArray[0].'_'.$tableNameArray[1];	// for rowdata
	$tripID=trim($_GET['tripID']);			//訓練id
	$speedMeter=0.01;
	$speedMeterStr='km/hr';
	
	try {
		$sqlstr="select train_name,train_description,wTotalPoint,lTotalTime,lTotalDistance,wLapCnts,wCalory,lMaxSpeed,cMaxHeart,cAvgHeart,wAscent,wDescent,sMinAlti,sMaxAlti ";
		$sqlstr.=" from tbl_train_data";
		$sqlstr.=" where id=".$tripID;
		
		mysql_query("set names 'utf8'"); 
		$result = mysql_query($sqlstr) or die('MySQL query error1');
		$num_rows = mysql_num_rows($result);
		if($num_rows>0){
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
				$strdata.="MinAlti:".$row['sMinAlti'].",";
				$strdata.="MaxAlti:".$row['sMaxAlti'];
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
		}else{
			$strdata="[]";
		}
		echo $strdata;
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
	
	
?>
