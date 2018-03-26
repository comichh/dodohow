<?php
	include_once "../../../../config/mysql.php";
	$uid=$_SESSION['user_id'];
	try {
		$sqlstr="select a.id,a.deviceid,a.displayname,b.name,b.image";
		$sqlstr.=" from tbl_device a,tbl_device_model b";
		$sqlstr.=" where a.model=b.id and a.creator=".$uid;
		
		mysql_query("set names 'utf8'"); 	
		$result = mysql_query($sqlstr) or die($sqlstr);
		while($row = mysql_fetch_array($result)){
			$strdata.="{";
			$strdata.="id:".$row['id'].",";
			$strdata.="deviceid:'".$row['deviceid']."',";
			$strdata.="modelname:'".$row['name']."',";
			$strdata.="image:'".$row['image']."',";
			$strdata.="displayname:'".$row['displayname']."'";
			$strdata.="},";
		}
		$strdata=substr($strdata,0,strlen($strdata)-1);
		$strdata="[".$strdata."]";
		echo $strdata;
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
?>
