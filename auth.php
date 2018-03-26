<?php
session_start() ;

//echo "目前".$no_check;
// 若是那頁不需要檢查驗證，請在引入 head 之前，定義 $no_check=1
if ($no_check != true )    // 需要做登入驗證
{
  if ($_SESSION['auth'] !=TRUE){
  //  echo "<br><br>未登入，暫時不強迫跳轉，方便測試";
    header("Location:$work_web/no_login.php");  
  }
  //else {
  //echo "<br><br>已經登入";
  //}
}else {
  //echo "<br><br>這頁不驗證"; 
}
$no_check=false;


?>
