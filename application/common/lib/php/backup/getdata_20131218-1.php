<?php
	include_once "../../../../config/mysql.php";
	$tripID=trim($_GET['tripID']);
	try {
		$sqlstr.="select b.id,b.start_time,b.latitude,b.longitude,b.altitude,b.speed,b.heart_rate,b.cadence,b.pwr_cadence,b.power,b.distance";
		$sqlstr.=" from tbl_train_data a,gsgh_625xt12W32A0000021 b ";
		$sqlstr.=" where a.id=b.train_data_key and a.id=".$tripID;
		$sqlstr.=" order by b.start_time";
		$result = mysql_query($sqlstr) or die('MySQL query error');
		while($row = mysql_fetch_array($result)){
			$strdata.="{";
			$strdata.="id:'".$row['id']."',";
			$strdata.="start_time:'".$row['start_time']."',";
			$strdata.="latitude:".$row['latitude'].",";
			$strdata.="longitude:".$row['longitude'].",";
			$strdata.="altitude:".$row['altitude'].",";
			$strdata.="speed:".$row['speed'].",";
			$strdata.="heart_rate:".$row['heart_rate'].",";
			$strdata.="cadence:".$row['cadence'].",";
			$strdata.="pwr_cadence:".$row['pwr_cadence'].",";
			$strdata.="power:".$row['power'].",";
			$strdata.="distance:".$row['distance'].",";
			$strdata.="},";
		}
		$strdata=substr($strdata,0,strlen($strdata)-1);
		$strdata="[".$strdata."]";
		echo $strdata;
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
	
	
?>
