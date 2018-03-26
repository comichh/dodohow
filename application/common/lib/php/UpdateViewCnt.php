<?php
  include ("../../../../config/mysql.php");

	//-------------- include mysql profile ----------------------------
//	include_once "ThisProfiles.php";
//	include_once SqlServerProfiles;
	//-----------------------------------------------------------------

	
	$tripID=trim($_POST['tripID']);
	
		$sqlstr="select view_cnt from tbl_train_data where id=".$tripID;
		mysql_query("set names 'utf8'"); 
		$result = mysql_query($sqlstr) or die($sqlstr);
		$row = mysql_fetch_array($result);
		if(is_null($row[view_cnt])){
			$countVal=0;
		}else{
			$countVal=$row[view_cnt];
		}
		$newCountVal=$countVal+1;
		$sqlstr="update tbl_train_data set view_cnt='".$newCountVal."' where id=".$tripID;	
		mysql_query($sqlstr) or die($sqlstr);		
		echo '[{result:"1",returnVal:'.$newCountVal.'}]';
	
?>
