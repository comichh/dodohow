<?php
 include ("../../../../config/web.ini");
include ("../../../../auth.php");
include ("../../../../config/mysql.php");
include ("../../../../config/lang_select.php");

//  include ("../../../../config/mysql.php");
//  mysql_query("set names 'utf8'"); 

//	session_start();
	$userID=$_SESSION['user_id'];
//print_r ($_COOKIE);


		$sqlstr.=" select lastlat,lastlng,lastlocation ";
		$sqlstr.=" from tbl_user";
		$sqlstr.=" where id=".$userID;
 //   echo $sqlstr;
		$result = mysql_query($sqlstr) or die('MySQL query error');
		$row=mysql_fetch_array($result);
		if((trim($row['lastlat'])==="")||(trim($row['lastlng'])==="")){
			$strdata="";
		}else{
			$strdata.="{";
			$strdata.="latitude:".$row['lastlat'].",";
			$strdata.="longitude:".$row['lastlng'].",";
      if ($_COOKIE['show_status']==0){$row['lastlocation'] ='';}
	    $strdata.="LastLddress:'".$row['lastlocation']."'";
			$strdata.="}";
		}
		echo "[".$strdata."]";

	
?>
