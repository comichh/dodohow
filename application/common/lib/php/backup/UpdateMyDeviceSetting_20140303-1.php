<?php
	include_once "../../../../config/mysql.php";
	$DeviceID=trim($_POST['DeviceID']);
	$DeviceName=trim($_POST['DeviceName']);
	try {
		mysql_query("set names 'utf8'"); 
		$sqlstr="update tbl_device set displayname='".$DeviceName."' where deviceid='".$DeviceID."'";			
		$result = mysql_query($sqlstr) or die($sqlstr);
		echo '1';
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
?>
