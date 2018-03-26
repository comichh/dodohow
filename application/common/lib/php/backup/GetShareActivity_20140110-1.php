<?php
	include_once "../../../../config/mysql.php";

	try {
		$sqlstr.=" SELECT a.image, b.id, b.deviceid, b.train_name, b.start_lat, b.start_lng ";
		$sqlstr.=" FROM tbl_user a, tbl_train_data b, tbl_device c ";
		$sqlstr.=" WHERE a.id = c.creator ";
		$sqlstr.=" AND b.deviceid = c.deviceid ";
		$sqlstr.=" AND b.public_access=1";
	    /*
		$sqlstr="select id,deviceid,train_name,start_lat,start_lng";
		$sqlstr.=" from tbl_train_data";
		$sqlstr.=" where public_access=1";
		*/
		mysql_query("set names 'utf8'"); 	
		$result = mysql_query($sqlstr) or die($sqlstr);
		while($row = mysql_fetch_array($result)){
			$strdata.="{";
			$strdata.="id:'".$row['id']."',";
			$strdata.="image:'".$row['image']."',";
			$strdata.="deviceID:'".$row['deviceid']."',";
			$strdata.="train_name:'".$row['train_name']."',";
			$strdata.="start_lat:".$row['start_lat'].",";
			$strdata.="start_lng:".$row['start_lng'];
			$strdata.="},";
		}
		$strdata=substr($strdata,0,strlen($strdata)-1);
		$strdata="[".$strdata."]";
		echo $strdata;
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
?>
