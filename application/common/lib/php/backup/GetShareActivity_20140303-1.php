<?php
	include_once "../../../../config/mysql.php";

$societies_select=$_GET['societies_select'];
// 社團功能暫時取消
if ($societies_select ==0){
 $sql_societies=" and b.public_access=1";
   //$sql_from=" FROM tbl_user a, tbl_train_data b, tbl_device c,tbl_train_share_recode d ";
}
else { 
  $sql_societies=" AND b.id = d.for_train_key1 and d.for_societies_key1='$societies_select'";
  //$sql_from=" FROM tbl_user a, tbl_train_data b, tbl_device c , tbl_train_share_recode d ";
}

	try {
		$sqlstr.=" SELECT a.fullname, a.image, b.id, b.deviceid, b.train_name, b.start_lat, b.start_lng ,d.for_societies_key1,b.lTotalDistance,b.lTotalTime,b.train_description ";
		$sqlstr.=" FROM tbl_user a, tbl_train_data b, tbl_device c , tbl_train_share_recode d ";
	  $sqlstr.= $sql_from;
  	$sqlstr.=" WHERE a.id = c.creator ";
		$sqlstr.=" AND b.deviceid = c.deviceid ";
    //$sqlstr.=" AND b.id = d.for_train_key1 ";
		//$sqlstr.=" AND ".$sql_societies;
		$sqlstr.=$sql_societies;
    $sqlstr.=" order by b.id desc";
	    /*
		$sqlstr="select id,deviceid,train_name,start_lat,start_lng";
		$sqlstr.=" from tbl_train_data";
		$sqlstr.=" where public_access=1";
		*/

		mysql_query("set names 'utf8'"); 
		$result = mysql_query($sqlstr) or die($sqlstr);
		while($row = mysql_fetch_array($result)){
			$sqlstr2 ="select count(*) as totalcount from tbl_comment where for_train_id=".$row['id'];
			$result2 = mysql_query($sqlstr2) or die($sqlstr2);
			$row2 = mysql_fetch_array($result2);      
			$totalCount=$row2['totalcount'];
			$strdata.="{";
			$strdata.="id:'".$row['id']."',";
      $strdata.="fullname:'".$row['fullname']."',";
			$strdata.="image:'".$row['image']."',";
			$strdata.="deviceID:'".$row['deviceid']."',";
			$strdata.="train_name:'".$row['train_name']."',";
	    $strdata.="lTotalDistance:'".$row['lTotalDistance']."',";
      $strdata.="train_description:'".$row['train_description']."',";
	    $strdata.="lTotalTime:'".$row['lTotalTime']."',";
			$strdata.="comment_count:".$totalCount.",";
			$strdata.="start_lat:".$row['start_lat'].",";
			$strdata.="start_lng:".$row['start_lng'];
			$strdata.="},";      
	    //$strdata=json_encode($row);	  
  }

		$strdata=substr($strdata,0,strlen($strdata)-1);
		$strdata="[".$strdata."]";
		echo $strdata;
	} catch (Exception $e) {
		 echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
?>
