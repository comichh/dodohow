<?php
	include_once "../../../../config/mysql.php";
	$CommentID=trim($_POST['CommentID']);
	try {
		mysql_query("set names 'utf8'"); 
		$sqlstr="update tbl_comment set Notice=0 where id_comment=".$CommentID;			
		$result = mysql_query($sqlstr) or die($sqlstr);
		echo '1';
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
?>
