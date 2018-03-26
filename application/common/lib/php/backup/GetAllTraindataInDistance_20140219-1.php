<?php
	include_once "../../../../config/mysql.php";
	$speedMeter=0.01;
	$speedMeterStr='km/hr';
	$maxLat=$_GET['maxlat'];
	$minLat=$_GET['minlat'];
	$maxLng=$_GET['maxlng'];
	$minLng=$_GET['minlng'];
	try {
			
		$sqlstr.=" SELECT b.creator, c.displayname, c.image, a.Start_time, a.id,a.deviceid,a.train_name,a.post_datetime,a.train_description, a.wTotalPoint, a.lTotalTime, a.lTotalDistance,d.name as devicename";
		$sqlstr.=" FROM tbl_train_data a ";
		$sqlstr.=" INNER JOIN tbl_device b ON a.deviceid = b.deviceid ";
		$sqlstr.=" INNER JOIN tbl_user c ON b.creator = c.id ";
		$sqlstr.=" INNER JOIN tbl_device_model d ON b.model = d.id ";
		$sqlstr.=" WHERE a.public_access =1 and a.start_lat <= ".$maxLat." and a.start_lat>=".$minLat." and a.start_lng <= ".$maxLng." and a.start_lng >= ".$minLng;
		$sqlstr.=" ORDER BY a.post_datetime DESC";
		
		
		mysql_query("set names 'utf8'"); 
		$result = mysql_query($sqlstr) or die($sqlstr);
		$num_rows = mysql_num_rows($result);
		if($num_rows>0){
			while($row = mysql_fetch_array($result)){
				$strdata.="{";
				$strdata.="creator:'".$row['creator']."',";
				$strdata.="trainid:".$row['id'].",";
				$strdata.="deviceid:'".$row['deviceid']."',";
				//$strdata.="displayname:'<img src=\"./upload/upload/".$row['image']."\" width=\"72\">".$row['displayname']."',";
				$strdata.="displayname:'".$row['displayname']."',";
				$strdata.="UserImage:'".$row['image']."',";
				$strdata.="StartTime:'".$row['Start_time']."',";
				$strdata.="Trainname:'".$row['train_name']."',";
				$strdata.="Description:'".$row['train_description']."',";
				$strdata.="PublishTime:'".$row['post_datetime']."',";
				$strdata.="PictureCount:".getPhotoCount($row['id']).",";
				$strdata.="TotalTime:".$row['lTotalTime'].",";
				$strdata.="TotalDistance:".$row['lTotalDistance'].",";
				$strdata.="DeviceName:'".$row['devicename']."',";
				$strdata.="CommentCount:".getItemCount($row['id']);
				$strdata.="},";
			}
			$strdata=substr($strdata,0,strlen($strdata)-1);
			$strdata="[".$strdata."]";
		}else{
			$strdata="[]";
		}
		echo $strdata;
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
	function getPhotoCount($tripID){
		$index=0;
		foreach(glob('../../../sandbox/FileUpload/server/php/files/'.$tripID.'/thumbnail/{*.jpg,*.gif,*.png}', GLOB_BRACE | GLOB_NOSORT) as $imagename){
			$index+=1;
		}
		return $index;
	}
	
	function getItemCount($trainID){
		$sqlstr ="select count(*) as totalcount from tbl_comment where for_train_id=".$trainID;
		mysql_query("set names 'utf8'"); 
		$result = mysql_query($sqlstr) or die($sqlstr);
		$row = mysql_fetch_array($result);
		
		return $row['totalcount'];
	}
	
?>
