<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");


$page = isset($_POST['page']) ? intval($_POST['page']) : 1;
$rows = isset($_POST['rows']) ? intval($_POST['rows']) : 10;

/*
    $rs = mysql_query('select * from tbl_train_data limit $offset,$rows');
    
$result = array();

    while($row = mysql_fetch_object($rs)){
    //while($row = mysql_fetch_array($rs)){
      array_push($result, $row);
    }
  // echo $result[0]['id'];
  //  print_r ($result);    
 
    echo json_encode($result);
*/

$rs= mysql_query("select count(*) from gsgh_625xt12W32A0000023  where train_data_key='62'");
///$rs = mysql_query("select count(*) from tbl_train_data");
$row = mysql_fetch_row($rs);
$result["total"] = $row[0];

$rs= mysql_query("select * from gsgh_625xt12W32A0000023  where train_data_key='62' limit $page,$rows");
//$rs = mysql_query("select * from tbl_train_data limit $page,$rows");
 
$items = array();
while($row = mysql_fetch_object($rs)){
array_push($items, $row);
}
$result["rows"] = $items;
echo json_encode($result);

?>
