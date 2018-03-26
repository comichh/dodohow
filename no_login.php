<?php 
  $no_check=true;
  $navigation=true;
  include ("config/head.php");
?>
<style>
#body_content{width:400px;height:150px;}
.button_css3 {margin:10px;padding:5px;}

</style>
       
  <div id='body_page'> <div id='body_table'> <div id='body_content'>
   <br>  <br>  <br>  <br>  <br>  <br>  <br>  <br>  <br>  <br>  <br>
    <h2><?php echo $lang['no_login'] ?> </h2><br><br>
    <?php
      echo "<span><a class='button_css3' href='login.php'>$lang[login] </a></span>";
      echo "<span><a class='button_css3' href='registrator.php'>$lang[registrator] </a></span>";
   ?>
</div></div></div>