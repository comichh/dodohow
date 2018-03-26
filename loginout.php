<?php
  //$_SESSION['auth']='';
  //unset($_SESSION['auth']);
  //unset($_SESSION['user_id']);
session_start();
session_destroy();
   header("Location:index.php");
  //print_r (   $_SESSION);
?>
