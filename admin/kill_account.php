<?php
$no_check=false;
$navigation =true;
include ('../config/head.php');
include ('admin_head.php');





$form="
<form id='myform' action='#' method='post'>
  暱稱:<input type='text' name='displayname' style='width:60%'>    
<input type='submit' value='刪除'/></form>
</div></div></div>
";



if ($_POST['displayname'] !='')
{
  $displayname=$_POST['displayname'];
  $query="DELETE FROM tbl_user where displayname='$displayname'";
  $result=mysql_query($query); 
  if (mysql_affected_rows() > 0) {           
      echo "刪除成功";    
  }else{
     echo "暱稱不存在，或是資料庫錯誤";
  }    
}else{
  echo $form;
}

?>

