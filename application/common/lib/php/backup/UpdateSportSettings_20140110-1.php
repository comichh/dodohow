<?php
	include_once "../../../../config/mysql.php";
	$trainID=trim($_POST['TrainID']);
	$sportName=trim($_POST['SportName']);
	$statu=trim($_POST['statu']);
	$startLat=$_POST['slat'];
	$startLng=$_POST['slng'];
	$endLat=$_POST['elat'];
	$endLng=$_POST['elng'];
	try {
		mysql_query("set names 'utf8'"); 
		$sqlstr="update tbl_train_data set train_name='".$sportName."',public_access=".$statu.",start_lat=".$startLat.",start_lng=".$startLng.",end_lat=".$endLat.",end_lng=".$endLng." where id=".$trainID;			
		$result = mysql_query($sqlstr) or die($sqlstr);
		echo $sportName;
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
?>
