<?php
	include_once "../../../../config/mysql.php";
	$trainID=trim($_POST['TrainID']);
	$sportName=trim($_POST['SportName']);

	try {
		mysql_query("set names 'utf8'"); 
		$sqlstr="update tbl_train_data set train_name='".$sportName."' where id=".$trainID;			
		$result = mysql_query($sqlstr) or die($sqlstr);
		echo $sportName;
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
?>
