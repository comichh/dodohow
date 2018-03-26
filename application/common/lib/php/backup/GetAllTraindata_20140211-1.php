<?php
	include_once "../../../../config/mysql.php";
	$speedMeter=0.01;
	$speedMeterStr='km/hr';
	
	try {
			
		$sqlstr.=" SELECT b.creator, c.displayname, c.image, a.Start_time, a.id,a.deviceid,a.train_name, a.train_description, a.wTotalPoint, a.lTotalTime, a.lTotalDistance";
		$sqlstr.=" FROM tbl_train_data a ";
		$sqlstr.=" INNER JOIN tbl_device b ON a.deviceid = b.deviceid ";
		$sqlstr.=" INNER JOIN tbl_user c ON b.creator = c.id ";
		$sqlstr.=" WHERE a.public_access =1 ";
		$sqlstr.=" ORDER BY a.Start_time DESC";
		
		
		mysql_query("set names 'utf8'"); 
		$result = mysql_query($sqlstr) or die('MySQL query error1');
		$num_rows = mysql_num_rows($result);
		if($num_rows>0){
			while($row = mysql_fetch_array($result)){
				$strdata.="{";
				$strdata.="creator:'".$row['creator']."',";
				$strdata.="trainid:".$row['id'].",";
				$strdata.="deviceid:'".$row['deviceid']."',";
				//$strdata.="displayname:'<img src=\"./upload/upload/".$row['image']."\" width=\"72\">".$row['displayname']."',";
				$strdata.="displayname:'".$row['displayname']."',";
				$strdata.="UserImage:'".$row['image']."',";
				$strdata.="StartTime:'".$row['Start_time']."',";
				$strdata.="Trainname:'".$row['train_name']."',";
				$strdata.="Description:'".$row['train_description']."',";
				$strdata.="TotalTime:".$row['lTotalTime'].",";
				$strdata.="TotalDistance:".$row['lTotalDistance'];
				/*
				$strdata.="TotalPoint:".$row['wTotalPoint'].",";
				$strdata.="LapCnts:".$row['wLapCnts'].",";
				$strdata.="Calory:".$row['wCalory'].",";
				$strdata.="MaxSpeed:".$row['lMaxSpeed'].",";
				$strdata.="MaxHeart:".$row['cMaxHeart'].",";
				$strdata.="AvgHeart:".$row['cAvgHeart'].",";
				$strdata.="Ascent:".$row['wAscent'].",";
				$strdata.="Descent:".$row['wDescent'].",";
				$strdata.="MinAlti:".$row['sMinAlti'].",";
				$strdata.="MaxAlti:".$row['sMaxAlti'];
				*/
				$strdata.="},";
			}
			$strdata=substr($strdata,0,strlen($strdata)-1);
			$strdata="[".$strdata."]";
		}else{
			$strdata="[]";
		}
		echo $strdata;
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
	
	
?>
