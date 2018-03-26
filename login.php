<?php 
  
  $no_check=true;
  $navigation =true;
  include_once 'config/head.php';
?>
<style>
#body_table{
   background:url('pic/login/back_ground.jpg') no-repeat; 
   width:1280px;height:800px;
}
#body_table::before{        
  content: '';
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 100%;
}
#body_content{                /* 垂直置中的內容層，寬度會變 ，這個是為了以後還有小視窗,直接用寬度讓內容置中  */  
  border:solid black 1px;
  width:350px;
  height:600px;
} 
#login_div div{margin:0 0 10px 0}
#login_div span{display:inline-block;width:290px;}  
#login_div span:first-child {width:50px;height:30px;}
#login_div span input{width:100%;background:white;color:black;border:solid #30a0d2 2px;height:30px; }
.stand_button_0 span{width:44%;text-align:center}    
#browser span{display: inline-block;vertical-align: middle;}
</style>

<script>
var fb_appId='<?php echo $fb_appId?>';
var fb_channelUrl='<?php echo $fb_channelUrl ?>';

$(document).ready(function(){
 $name=$("#name");
 $passwd=$("#passwd"); 
 $memory=$("#memory"); 
 
 $name.val(localStorage.lastemail);

 if (localStorage.passwd !=''){
  $passwd.val(localStorage.passwd);
    $memory.prop("checked","checked");
 }
 
 $name.on('change',function(){
  name=$(this).val();
  localStorage.lastemail=name;
 });
 $("#submit").on('click',function(){ 
    var passwd=$passwd.val(); 
    if ($memory.prop("checked") == true){             
      localStorage.passwd=passwd;     
    }else{   
      localStorage.passwd='';      
    } 
  });     
});
</script>
<script type="text/javascript" src="facebook/js/facebook.js"></script>


    <?php 
    if ($_GET['show_error'] ==1){
      $show_error="<h2 style='color:red;text-align:center;'> $lang[error_passed]</h2>";
    }else{  
      $show_error='';
    }
$sign_form=" <div id=' body_page'> <div id='body_table'> <div id='body_content'>
    <form action='#' method='post'>
        <h2> Sport4u $lang[sport4u_login]</h2>
        <div id='login_div'>
        <div>
        <span>
           <div style='background:#0e68ab;padding:10px;border:solid #30a0d2 2px; '>
             <img  src='pic/login/account.png' >
           </div>   
        </span>
        <span>
            <input type='text'  name='name' id='name'> 
        </span> 
    </div>
    <div>
          <span>
             <div style='background:#0e68ab;padding:2px 0px 12px 12px ;border:solid #30a0d2 2px; '>
               <img  src='pic/login/passwd.png' >
            </div>  
          </span>
          <span>
             <input type='password'  name='password' id='passwd'>
         </span> 
    </div>
    </div>       
       <div style='float:right'> $lang[memory_passwd]<input style='width:30px' type='checkbox'  id='memory'> </div>
       <br><br>
       <div class='stand_button_0'>
          <span ><a href='registrator.php'>$lang[registrator]</a></span>
          <span ><a href='lose_passwd.php'>$lang[lose_passwd]</a></span>         
       </div> 
       <br>
       <button type='submit' id='submit' class='button_css3' style='width:350px'>$lang[login]</button>
       $show_error
        <p>$lang[login_other]：<br><br>
        <img sryle='width:40px'  onclick='FBLogin()' src='pic/login/facebook.png'/>
        <br><hr><br>        
         $lang[browser]  ：<br> 
         <div id='browser'>
            <span><img src='pic/homepages/chrome.png'></span>
            <span><img src='pic/homepages/firefox.png'> </span>      
            <span><img src='pic/homepages/safari.png'></span> 
            <span><img  src='pic/homepages/ie.png'></span>
            <span>9+</span>
        </div>
        <br>
        <div> $lang[resolution] :  1280x800 </div>
        </form></div></div></div>   
      ";

     if ($_POST['name']!='' and $_POST['password']!='' )
     {            
       $email=check_input($_POST['name']);  
       $submit_passwd=$_POST['password'];    
       $password=md5($submit_passwd) ;
       $query="select * from  tbl_user where email='$email' and password='$password'";
       $result=mysql_query($query);
       while ($row=mysql_fetch_array($result))
       {
            $user_id=$row['id'];  
			      $displayname=$row['displayname'];
			      $image=$row['image'];
		       	$langID=$row['language']; 
            $map=$row['map']; 
       } 
       if (mysql_num_rows($result) ==1)
        {      
		    	$_SESSION['auth']=true;   
			    $_SESSION['user_id']=$user_id;
		      $_SESSION['displayname']=$displayname;
		      $_SESSION['UserImage']=$image;
			    $_SESSION['Lang']=$langID;
          $_SESSION['map']=$map;
          //$_SESSION['session_id']=session_id();            //  fb 那邊也要改。
          $_SESSION['login_type']='sport4u';     
          header("Location:person/index.php"); 
        }else{          
          header("Location:login.php?show_error=1");                  
          //echo $sign_form;   
          /*
          echo "<div id='body_page'><div id='body_table'><div id='body_content'>";
          echo "<h2> $lang[error_passed]</h2>";
          echo "<a href='login.php'>$lang[repeat_login] </a>";
          echo "</div></div></div>";
          */
        }
     }else {
       echo $sign_form;
     }
 
 
       

     ?>


		




