<?php
	include_once "../../../../config/mysql.php";
	$CommentID=trim($_GET['comment_id']);
	
	$sqlstr="select a.displayname,a.image,b.content,b.for_user_id,b.id_comment,b.for_train_id,c.train_name ";
	$sqlstr.=" from tbl_user a,tbl_comment b,tbl_train_data c ";
	$sqlstr.=" where a.id=b.for_user_id and b.for_train_id=c.id and b.id_comment=".$CommentID;

	mysql_query("set names 'utf8'"); 	
	try{
		$result = mysql_query($sqlstr) or die($sqlstr);
		while($row = mysql_fetch_array($result)){
			$strdata.="{";
			$strdata.="CommentUserID:'".$row['for_user_id']."',";
			$strdata.="CommentUserName:'".$row['displayname']."',";
			$strdata.="CommentID:'".$row['id_comment']."',";
			$strdata.="TrainID:'".$row['for_train_id']."',";
			$strdata.="TrainName:'".$row['train_name']."',";
			$strdata.="Content:'".$row['content']."',";
			$strdata.="ImageName:'".$row['image']."'";
			$strdata.="},";
		}
		$strdata=substr($strdata,0,strlen($strdata)-1);
		$strdata="[".$strdata."]";
		echo $strdata;
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." --from getdata.php", "\n";
	}
	
?>
