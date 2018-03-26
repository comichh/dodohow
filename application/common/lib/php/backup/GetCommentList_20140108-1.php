<?php
	include_once "../../../../config/mysql.php";
	session_start();
	$sqlstr="select * from  tbl_comment where for_comment_user=".$_SESSION['user_id']." and Notice='1'";
	mysql_query("set names 'utf8'"); 	
	try{
		$result = mysql_query($sqlstr) or die($sqlstr);
		while($row = mysql_fetch_array($result)){
			$strdata.="{";
			$strdata.="CommentID:".$row['id_comment'];
			$strdata.="},";
		}
		$strdata=substr($strdata,0,strlen($strdata)-1);
		$strdata="[".$strdata."]";
		echo $strdata;
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
?>
