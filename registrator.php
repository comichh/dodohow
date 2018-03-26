<?php 
  $no_check=true;
  $navigation =true;
  include ("config/head.php");
  include ("function/database.php");
?>
<style>
#body_content{width:1000px;}
/*.input-block-level{width:330px;height:30px;border:solid black 1px;}*/
#registrator_table td:first-child{width:80px}
input[type=text]{height:30px;width:400px;}    
td{text-align:left;}
#browser span{display: inline-block;vertical-align: middle;}
</style>
<script>
  var fb_appId='<?php echo $fb_appId?>';
  var fb_channelUrl='<?php echo $fb_channelUrl ?>';
</script>
<script type='text/javascript' src='js/registrator.js'></script>
<script type='text/javascript'>var registrator_error='<?php echo $lang['registrator_true_data'] ?>';</script> 
</head>

    <?php   
  $sign_form="<div id='body_page'> <div id='body_table'> <div id='body_content'>
    <form  action='#' method='post'>
     <br><br><br><br>
        <!--
        <h2 style='background:#0066FF;height:40px'>$lang[registrator_need_text]</h2>
        -->
        <table id='registrator_table'><tr>
          <td>$lang[name]:</td>   
          <td><input class='input-block-level' type='text' name='true_name'> </td>
          <td><span class='show_alert'></span><span></span> </td> 
       </tr>
      <tr>
      <td colspan='3'><hr></td>
      </tr>
         <td>e-mail:</td>   
         <td><input type='text' class='input-block-level' name='mail' id='mail'> </td>
          <td><span class='show_alert'></span><span>$lang[registrator_mail_info]</span> </td>    
       </tr>
      <tr>
      <td colspan='3'><hr></td>
      </tr>
         <td>$lang[nickname]:</td>   
         <td>   <input type='text' class='input-block-level' name='displayname' id='displayname'> </td>
         <td><span class='show_alert'></span><span>$lang[registrator_nickname_info]</span> </td>   
       </tr>
      <tr>
      <td colspan='3'><hr></td>
      </tr>
          <td>$lang[passwd]:</td>   
          <td>   <input type='password' class='input-block-level' name='password'  id='password'> </td>
          <td><span class='show_alert'></span><span>$lang[registrator_passwd_info]</span> </td> 
  
       </tr>
       <tr>
            <td colspan='3'><hr></td>
        </tr>
          <td>$lang[repeat_new_passwd]:</td>   
          <td><input type='password'  name='password1' id='password1'> </td>
          <td><span class='show_alert'></span><span>$lang[passwd_equal_info]</span></td>   
        </tr>
        </table>
         <p> 
        <div style='text-align:center;'>
     <button id='submit' class='button_css3'  type='submit' style='width:500px;' >$lang[submit_account]</button>        
        <p>$lang[login_other]：<p>
        <img  onclick='FBLogin()' src='pic/login/facebook.png'/>  
    <hr>        
        $lang[browser]  ：
    <span id='browser'>
            <span><img src='pic/homepages/chrome.png'></span>
            <span><img src='pic/homepages/firefox.png'> </span>      
            <span><img src='pic/homepages/safari.png'></span> 
            <span><img  src='pic/homepages/ie.png'></span>
            <span>9+</span>
        </span>
    

     </form>
     


</div></div></div>";

     
    if ($_SESSION['auth']== true )      //  先註冊，才接入 pc-tool
    {
       if ($_GET['device'] !='')
       {
          $create_result= create_database($_GET['device'],$_SESSION['user_id'],$work_path ); 
          if ( $create_result == 'ok'){             
             echo "<br><br><br><br><br><br><br><div style='font-size:30px;color:red;text-align:center;'>";
             echo "$lang[registrator_pctool_info]</div><p>";
          }else {echo   $create_result;}
       }else {
          header("Location:person/index.php");  
       }
            
    }else {                                  // 正常註冊程序  
       // 這邊要把 device 傳給 js
       echo "<script type='text/javascript'>"; 
       echo "var device='$_GET[device]';"; 
       echo "</script>";

       if ( $_POST['true_name']!='' and $_POST['mail']!='' and $_POST['password']!='' and  $_POST['password1']!=''  )
       {    
          if ($_POST['password']==$_POST['password1'])
          {  
            $password=md5($_POST['password']);
            $db_col="(true_name,email,password,displayname,pm_password)";
            $db_value="('$_POST[true_name]','$_POST[mail]','$password','$_POST[displayname]','$_POST[password]')"; 
            $query_add="insert into tbl_user".$db_col. "values".$db_value;
            $result=mysql_query($query_add);
         
            if ($result)
            {          
              $user_id=mysql_insert_id();                // 取得 user_id
               if ($_GET['device'] !='')
               {  
                  create_database($_GET['device'],$user_id,$work_path);
               } 
               header("Location:login.php");
            }else {echo $lang['error_registrator_account'];}
          }else {echo $lang['error_not_equal'];}
      }else {        
          echo $sign_form;
      }
    } 







       

     ?>


		


<script type="text/javascript" src="facebook/js/facebook.js"></script>

