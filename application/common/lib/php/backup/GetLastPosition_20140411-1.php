<?php
	//-------------- include mysql profile ----------------------------
	include_once "ThisProfiles.php";
	include_once SqlServerProfiles;
	//-----------------------------------------------------------------
	
	session_start();
	$userID=$_SESSION['user_id'];

	try {
		$sqlstr.=" select lastlat,lastlng ";
		$sqlstr.=" from tbl_user";
		$sqlstr.=" where id=".$userID;
		mysql_query("set names 'utf8'"); 
		$result = mysql_query($sqlstr) or die('MySQL query error');
		$row=mysql_fetch_array($result);
		if((trim($row['lastlat'])==="")||(trim($row['lastlng'])==="")){
			$strdata="";
		}else{
			$strdata.="{";
			$strdata.="latitude:".$row['lastlat'].",";
			$strdata.="longitude:".$row['lastlng'];
			$strdata.="}";
		}
		echo "[".$strdata."]";
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
?>
