<?php
	include_once "../../../../config/mysql.php";
	$trainID=trim($_POST['trainID']);
	try {
		$sqlstr="delete from tbl_train_data where id=".$trainID;
		mysql_query("set names 'utf8'"); 
		$result = mysql_query($sqlstr) or die('MySQL query error');
		echo "1";
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
?>
