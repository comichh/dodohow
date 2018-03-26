<?php
	include_once "../../../../config/mysql.php";
	$userID=trim($_POST['id']);
	$name=trim($_POST['name']);
	$useMap=trim($_POST['map']);
	$useLanguage=trim($_POST['language']);
	try {
		mysql_query("set names 'utf8'"); 
		$sqlstr="update tbl_user set displayname='".$name."',language='".$useLanguage."' where id=".$userID;			
		$result = mysql_query($sqlstr) or die($sqlstr);
		session_start();
		$_SESSION['displayname']=$name;
		echo '1';
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
?>
