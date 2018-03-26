<?php
	//-------------- include mysql profile ----------------------------
	include_once "ThisProfiles.php";
	include_once SqlServerProfiles;
	//-----------------------------------------------------------------
	session_start();
	$user_id=$_SESSION['user_id'];
	$tripID=$_GET['tripID'];
	$imagePath=UploadPhotoPath."/".$user_id."/".$tripID."/thumbnail";

	try {
		$sqlstr.=" select *";
		$sqlstr.=" from tbl_pic";
		$sqlstr.=" where pic_train_key=".$tripID;

		mysql_query("set names 'utf8'"); 
		$result = mysql_query($sqlstr) or die('MySQL query error');
		while($row = mysql_fetch_array($result)){
			$strdata.="{";
			$strdata.="pic_id:".$row['pic_id'].",";
			$strdata.="pic_train_key:".$row['pic_train_key'].",";
			$strdata.="pic_title:'".$row['pic_title']."',";
			$strdata.="pic_lat:".$row['pic_lat'].",";
			$strdata.="pic_lng:".$row['pic_lng'].",";
			$strdata.="pic_descript:'".$row['pic_descript']."',";
			$strdata.="pic_name:'".$imagePath."/".$row['pic_name']."'";
			$strdata.="},";
		}
		$strdata=substr($strdata,0,strlen($strdata)-1);
		$strdata="[".$strdata."]";
		echo $strdata;
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
?>
