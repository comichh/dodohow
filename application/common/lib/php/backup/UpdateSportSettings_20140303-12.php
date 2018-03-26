<?php
	//-------------- include mysql profile ----------------------------
	include_once "ThisProfiles.php";
	include_once SqlServerProfiles;
	//-----------------------------------------------------------------

	$trainID=trim($_POST['TrainID']);    
	$sportName=trim($_POST['SportName']);
	$statu=trim($_POST['statu']);
	$startLat=$_POST['slat'];
	$startLng=$_POST['slng'];
	$endLat=$_POST['elat'];
	$endLng=$_POST['elng'];
	$desc=$_POST['desc'];
	$sportType=$_POST['sporttype'];
	$imgsrc=$_POST['imgsrc'];
	$societies=$_POST['societies'];
	$datetime=date('Y-m-d H:i:s');
	try {

		mysql_query("set names 'utf8'"); 
		$sqlstr="update tbl_train_data set train_name='".$sportName."',public_access=".$statu.",start_lat=".$startLat.",start_lng=".$startLng.",end_lat=".$endLat.",end_lng=".$endLng.",train_description='".$desc."',cSport6=".$sportType.$upadtePostime." where id=".$trainID;			
		$result = mysql_query($sqlstr) or die($sqlstr);
		// 分享到其他社團，目前沒有無法選擇多個社團
		/*
		if ($societies !='0')
		{
		  $query2="select * from tbl_train_share_recode where for_train_key1='$trainID' and  for_societies_key1='$societies'";      
		  $result2 = mysql_query($query2);      
		  if (mysql_num_rows($result2)==0){
			$query="INSERT  into tbl_train_share_recode (for_train_key1,for_societies_key1) VALUES('$trainID','$societies')"; 
			$result = mysql_query($query); 
		  }
		}
		*/
		
		$img = RouteImagePath.'/'.$trainID.'.'.RouteImageType;
		if(!file_exists($img)){
			file_put_contents($img, file_get_contents($imgsrc));
		}
		echo $sportName;
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from UpdateSportSettings.php", "\n";
	}
	
	function checkdirexit($dir){
		if(!is_dir($dir)){
			mkdir($dir);
		}
	}
	
?>
