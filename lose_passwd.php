<?php 
  $no_check=true;
  $navigation =true;
  include ("config/head.php");
	//include_once 'function/random.php';
?>

<style>
#body_content{width:800px;}
</style>
  
    <?php 
    $sign_form="<div id=' body_page'> <div id='body_table'> <div id='body_content'>
        <form  action='#' method='post'>
        <h2> e-mail </h2>          
        <input type='text'  name='mail'><p>           
        <br>
        <button class='button_css3' type='submit'>$lang[get_new_passwd]</button><br>
     </form></div></div></div>
    ";
// 因為 pm 決定改用明碼發送密碼
// 加密的作法，這是原來可以用的作法，重建密碼的作法，應該還有 bug  

if ($_POST['mail']!='' )
{
       echo "<div id=' body_page'> <div id='body_table'> <div id='body_content'>";

       $mail=$_POST['mail'];   
       $query="select * from  tbl_user where email='$mail'";
       $result=mysql_query($query);     
        if (mysql_num_rows($result) ==1)
        { 
            echo "<h2>$lang[submit_new_passwd]</h2>";              
            while ($row=mysql_fetch_array($result))
            {
             $mail=$row['email'];   
             $passwd=$row['pm_password'];                   	            
            }
            $mail=$mail;
            $mail_title="sport4u $lang[get_new_passwd]";
            $mail_name="support";
            $reply_mail="support";        
            $content="$lang[passwd]：$passwd";    
            include ("function/mail.php");
        }else{
          echo "<a href='lose_passwd.php'><h2> $lang[no_passwd_data] </h2></a> <p>";       
        } 
       echo "</div></div></div> "; 
}else {
   echo $sign_form;
}




/*

     if ($_POST['mail']!='' )
     {
   
       $mail=$_POST['mail'];   
       $query="select * from  tbl_user where email='$mail'";
       $result=mysql_query($query);     
        if (mysql_num_rows($result) ==1)
        {       
          echo "已經重新發送新密碼信件到你設定的信箱，請檢查你的信箱，重設密碼有效時間 5 分";              
          while ($row=mysql_fetch_array($result))
          {
            $mail=$row['email'];   
            $passwd=$row['password'];
            $id=$row['id'];          	            
          }
          // 紀錄這筆要重設密碼
          $random=generatorPassword();
          $random1=generatorPassword();
           setcookie("passwd",$random1,time()+300);
           $query_1="update tbl_user set  	lose_passwd='$random' where id=$id";
           $result_1=mysql_query($query_1);
          if ($result_1){            
            $mail=$mail;
            $mail_title="sport4u 信箱驗證";
            $mail_name="sport4u";
            $reply_mail="sport4u";        
            $content="點以下連結重設密碼<br><a href='http://192.168.1.178/dodohow/application/new_passwd.php?random=$random&random1=$random1'>http://192.168.1.191/dodohow/application/new_passwd.php?random=$random&random1=$random1</a>";    
            include ("../function/mail.php");
          }    
        }else{
          echo "無此資料，請重新輸入<p>"; 
          echo "<a href='$work_web/application/lose_passwd.php'>請重新輸入</a>";        
        }

     }else {
       echo $sign_form;
     }
 */
 
       

?>

</html>
