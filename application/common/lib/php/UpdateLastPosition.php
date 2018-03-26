<?php

include ("../../../../config/web.ini");
include ("../../../../auth.php");
include ("../../../../config/mysql.php");
include ("../../../../config/lang_select.php");


//include ("../../../../config/mysql.php");
//	mysql_query("set names 'utf8'");

//	session_start();
	$userID=$_SESSION['user_id'];
	$lastLat=trim($_POST['lastlat']);
	$lastLng=trim($_POST['lastlng']);
  if ( $_POST['address'] != ''){ 
	  $address=trim($_POST['address']);
  }else{
    $address='';
  }
		$sqlstr.=" update tbl_user ";
	//	if($address===''){        
		//	$sqlstr.=" set lastlat=".$lastLat.",lastlng=".$lastLng." ";
		//}else{
			$sqlstr.=" set lastlat=".$lastLat.",lastlng=".$lastLng.",lastlocation='".$address."' ";
	//	}
		$sqlstr.=" where id=".$userID;
		$result = mysql_query($sqlstr);
        //       echo $sqlstr;
                if ($result){
			echo "1";
                }
	
?>
