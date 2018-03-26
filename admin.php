<?php
$no_check=false;
$navigation =true;
include ('config/head.php');
include ('admin/admin_head.php');


$form="
<form id='myform' action='#' method='post'>
  imei:<input type='text' name='imei' style='width:60%'>    
<input type='submit' value='送出'/></form>
</div></div></div>
";



if ($_POST['imei'] !='')
{
  $imei=$_POST['imei'];
  $query="DELETE FROM tbl_device where deviceid='$imei'";
  $result=mysql_query($query); 
  if ($result){     
    $dbname=str_replace('-','_',$imei);                    // 改成正式的表名稱。
    $shell_exec=exec ("bash sh/drop.sh $dbname 2>&1 1> /dev/null",$return,$status);
    if ($status !=0)
    {
      echo "錯誤：";
      print_r ($return);
    }else{ 
      echo "刪除成功";
    }
  }    
}else{
  echo $form;
}

?>

