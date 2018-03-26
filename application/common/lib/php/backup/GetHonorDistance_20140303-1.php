<?php
	include_once "../../../../config/mysql.php";
		
	$sqlstr.=" SELECT c.id, c.displayname,c.image, sum( b.lTotalDistance ) AS TotalDistance";
	$sqlstr.=" FROM tbl_device a, tbl_train_data b, tbl_user c";
	$sqlstr.=" WHERE a.deviceid = b.deviceid AND a.creator=c.id";
	$sqlstr.=" GROUP BY c.id,c.displayname,c.image";
	$sqlstr.=" ORDER BY TotalDistance DESC";

	mysql_query("set names 'utf8'"); 	
	try{
		$result = mysql_query($sqlstr) or die($sqlstr);
		while($row = mysql_fetch_array($result)){
			$strdata.="{";
			$strdata.="UserID:".$row['id'].",";
			$strdata.="UserName:'".$row['displayname']."',";
			$strdata.="UserImage:'".$row['image']."',";
			$strdata.="TotalDistance:".$row['TotalDistance'];
			$strdata.="},";
		}
		$strdata=substr($strdata,0,strlen($strdata)-1);
		$strdata="[".$strdata."]";
		echo $strdata;
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
?>
