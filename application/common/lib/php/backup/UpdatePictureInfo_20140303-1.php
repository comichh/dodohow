<?php
	include_once "../../../../config/mysql.php";
	$picTrip=trim($_POST['picTrip']);
	$picId=trim($_POST['picId']);
	$picTitle=trim($_POST['picTitle']);
	$picDescription=trim($_POST['picDescription']);
	$picLat=trim($_POST['picLat']);
	$picLng=trim($_POST['picLng']);
	
	try {
		mysql_query("set names 'utf8'"); 
		$sqlstr.="update tbl_pic ";
		$sqlstr.="set pic_title='".$picTitle."',";
		$sqlstr.="pic_lat=".$picLat.",";
		$sqlstr.="pic_lng=".$picLng.",";
		$sqlstr.="pic_descript='".$picDescription."'";
		$sqlstr.=" where pic_train_key=".$picTrip;
		$sqlstr.=" and pic_id=".$picId;
		$result = mysql_query($sqlstr) or die($sqlstr);
		echo "1";
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from UpdatePictureInfo.php->Update failure!", "\n";
	}
	
?>
