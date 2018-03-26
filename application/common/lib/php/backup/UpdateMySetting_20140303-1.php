<?php
	include_once "../../../../config/mysql.php";
	$userID=trim($_POST['userID']);
	$photoPath=trim($_POST['photoImgName']);
	try {
		mysql_query("set names 'utf8'"); 
		$sqlstr="update tbl_user set image='".$photoPath."' where id=".$userID;			
		$result = mysql_query($sqlstr) or die($sqlstr);
		session_start();
		$_SESSION['UserImage']=$photoPath;
		echo '1';
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
?>
