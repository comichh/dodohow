<?php
	//-------------- include system profile ----------------------------
	include_once "ThisProfiles.php";
	include_once SqlServerProfiles;
	//------------------------------------------------------------------
	session_start();
	$userID=$_SESSION['user_id'];
	$lastLat=trim($_POST['lastlat']);
	$lastLng=trim($_POST['lastlng']);
	try {
		mysql_query("set names 'utf8'"); 
		$sqlstr.=" update tbl_user ";
		$sqlstr.=" set lastlat=".$lastLat.",lastlng=".$lastLng;
		$sqlstr.=" where id=".$userID;
		$result = mysql_query($sqlstr) or die($sqlstr);
		echo "1";
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from UpdateSportPlan.php->Update failure!", "\n";
	}
	
?>
