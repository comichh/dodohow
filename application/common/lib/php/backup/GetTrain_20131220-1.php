<?php
	include_once "../../../../config/mysql.php";
	$deviceID=trim($_GET['deviceid']);
	$startTime=trim($_GET['starttime']);
	$endTime=trim($_GET['endtime']);
	try {
		
		$sqlstr="select id,train_name,train_description,Start_time";
		$sqlstr.=" from tbl_train_data";
		$sqlstr.=" where deviceid='".$deviceID."' and Start_time between '".$startTime."' and '".$endTime."'";
		$sqlstr.=" order by Start_time desc";
		
		mysql_query("set names 'utf8'"); 	
		$result = mysql_query($sqlstr) or die('MySQL query error');
		while($row = mysql_fetch_array($result)){
			$strdata.="{";
			$strdata.="id:'".$row['id']."',";
			$strdata.="train_name:'".$row['train_name']."',";
			$strdata.="train_description:'".$row['train_description']."',";
			$strdata.="Start_time:'".$row['Start_time']."'";
			$strdata.="},";
		}
		$strdata=substr($strdata,0,strlen($strdata)-1);
		$strdata="[".$strdata."]";
		echo $strdata;
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
?>
