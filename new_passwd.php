<?php 
  $navigation=true;
  $no_check=false;
  include ("config/head.php");
?>
<style>
#body_content{width:600px;}

</style>


<?php

    $sign_form="<div id=' body_page'> <div id='body_table'> <div id='body_content'>
    <form action='#' method='post'>
        <h2>$lang[config_new_passwd]</h2>
        <table><tr><td>
           $lang[input_new_passwd]:</td><td style='width:330px'><input type='password'  name='passwd'></td></tr>
        <tr><td></td></tr>
        <tr><td>     
          $lang[repeat_new_passwd]:</td><td><input type='password' name='r_passwd'></td></tr></table>   
        <br>
         <div style='text-align:center;'>   
          <button type='submit' class='button_css3'>$lang[submit]</button><br>
        </div> 
   </form></div></div></div>
   ";



if ( $_POST['passwd'] !='' and  $_POST['r_passwd'] !='')
{
  $passwd=$_POST['passwd'];
  $r_passwd=$_POST['r_passwd'];
  if ( $passwd ==  $r_passwd){
    $new_passwd=md5($passwd);
    $query="update tbl_user set password='$new_passwd',pm_password='$passwd' where id=$_SESSION[user_id]"; 
    $result=mysql_query($query);
    if ($result){ $message=$lang['update_success'];}
  }else{ $message=$lang['error_not_equal'];}
  echo "<div id=' body_page'><div id='body_table'><div id='body_content'>".$message."</div></div></div>";
}else {
  echo $sign_form;
} 



/*
   if ($_GET['random1'] == $_COOKIE['passwd']){          
     $query="select * from  tbl_user where lose_passwd='$_GET[random]'";
     $result=mysql_query($query); 
     if (mysql_num_rows($result) ==1)
     {
       while ($row=mysql_fetch_array($result))
       {$id=$row['id'];} 
        //修改密碼 ，這邊改用 ajax 會比較好，不然會重複驗證             
        if ($_POST['passwd']!='' and  $_POST['passwd']!='')
        {                
          $new_passwd=md5($_POST['passwd']);
          $query_1="update tbl_user set password='$new_passwd' where id=$id";         
          $result_1=mysql_query($query_1); 
          if ($result_1){header("Location:$work_web/application/login.php");}
          else {echo "修改失敗，請聯絡管理員";}
        }else { 
           echo $sign_form;
        }                  
     }else {echo "請不要嘗試入侵其他人帳號";}
   }else {echo "重設密碼有效期超過時效，請重新要求重設密碼";}
*/

             

     ?>


		




