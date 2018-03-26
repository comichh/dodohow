<?php
	//-------------- include mysql profile ----------------------------
	include_once "ThisProfiles.php";
	include_once SqlServerProfiles;
	//-----------------------------------------------------------------
	
	$train_data_key=trim($_GET['train_data_key']);
	$deviceID=trim($_GET['deviceID']);
	  
	try {
		$sqlstr.="select start_time,lap_no,total_time,total_distance,calory,maxspeed,max_heart,avg_heart,avg_cadns,best_cadns,avg_power,max_power ";
		$sqlstr.=" from tbl_lap_data";
		$sqlstr.=" where train_data_key=".$train_data_key." and deviceid='".$deviceID."'";
		
		mysql_query("set names 'utf8'"); 
		$result = mysql_query($sqlstr) or die('error:->'.$sqlstr);
		while($row = mysql_fetch_array($result)){
		   	$strdata.="{";
			$strdata.="start_time:'".$row['start_time']."',";
			$strdata.="lap_no:'".$row['lap_no']."',";
			$strdata.="total_time:".$row['total_time'].",";
			$strdata.="total_distance:".$row['total_distance'].",";
			$strdata.="calory:".$row['calory'].",";
			$strdata.="maxspeed:".$row['maxspeed'].",";
			$strdata.="max_heart:".$row['max_heart'].",";
			$strdata.="avg_heart:".$row['avg_heart'].",";
			$strdata.="avg_cadns:".$row['avg_cadns'].",";
			$strdata.="best_cadns:".$row['best_cadns'].",";
			$strdata.="avg_power:".$row['avg_power'].",";
			$strdata.="max_power:".$row['max_power'];
			$strdata.="},";
		}
		$strdata=substr($strdata,0,strlen($strdata)-1);
		$strdata="[".$strdata."]";
		echo $strdata;
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from GetLapData.php", "\n";
	}
	
	
	
?>
