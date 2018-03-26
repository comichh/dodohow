<?php
echo "<link href='$work_web/_css/navigation.css' rel='stylesheet' type='text/css'/>"; 
echo "<script type='text/javascript'  src='$work_web/js/navigation.js'></script>"; 


  if ($head_show !='home'){ 
   $query="select a.id,a.deviceid,a.train_name,a.train_description,b.id_comment,b.for_train_id from tbl_train_data a,tbl_comment b where a.id=b.for_train_id and b.for_comment_user=".$_SESSION['user_id']." and b.Notice='1'"; 
   $result=mysql_query($query);  
   $comment_number=0;
   $comment_notice='';
   if ($result)
   {
    while ($row=mysql_fetch_array($result))
    {    
      $comment_number++;
	    $comment_notice.="<a target='_blank'  href='$work_web/train/comment.php?train_id=".$row['id']."&commentid=".$row['id_comment']."&cancel=1"."'/>".$row['train_name']."</a>";
  	}
   }
   $comment_notice.="";
   if ($comment_number !=0){         // 增加沒有留言時狀況
      $show_comment_notice="<div><a id='comment_list_show' href='#'>$lang[show_comment_notice]：".$comment_number."</a></div>";   
   }else{
     $show_comment_notice="<div><a href='#'>$lang[show_comment_notice]：".$comment_number."</a></div>";  // 維持 a ，但是js 抓不到後續動作就好
   }
 } 

?>


 <div id='top_head_line'></div> 
   <div style='height:60px'>
     <a id='head_pic_1' title='<?php echo $lang['go_to_homepage'] ?>' href='<?php echo $work_web;?>/person/index.php'></a>
     <div id="container_head">
     <ul class='menu'>
        <li><a href="#" class="dropdown"><?php echo $lang['MyProfile'] ?> ▼ </a></li>    
        <li class="sublinks">
              <a href="<?php echo $work_web;?>/person/config1.php"><?php echo $lang['MyProfile/1'];?> </a>    
              <a href="<?php echo $work_web;?>/person/config2.php"><?php echo $lang['MyProfile/2'];?> </a>         
        </li>
      </ul>
      <ul class='menu'>
        <li><a href="#" class="dropdown"><?php echo $lang['SportHistory']?> ▼ </a></li>
        <li class="sublinks"> 
          <a href="<?php echo $work_web?>/application/control_data.php?show_status=0"><?php echo $lang['SportHistory_1']?></a>           
        </li>
      <ul class='menu'>
        <li><a href="#" class="dropdown"><?php echo $lang['SportPlan']?> ▼ </a></li>
        <li class="sublinks">
         <a href="<?php echo $work_web;?>/plan/new.php"><?php echo $lang['new_path']?></a>
         <a href="<?php echo $work_web;?>/plan/old.php?q=edit"><?php echo $lang['update_path']?></a>   
         <a href="<?php echo $work_web;?>/plan/old.php?q=download"><?php echo $lang['download_to_device']?></a>                   
        </li>     
    </ul>

  <ul class='menu'>
        <li><a href="#" class="dropdown"><?php echo $lang['ExploreSport']?> ▼ </a></li>
        <li class="sublinks"> 
            <a href="<?php echo $work_web?>/application/social_map.php"><?php echo $lang['ExploreSport_map']?></a>
            <a href="<?php echo $work_web?>/application/control_data.php?show_status=1"><?php echo $lang['ExploreSport_table']?></a>
        </li>     
   </ul>
  <?php     
 if ($head_show =='home'){ 
   echo "<span  style='float:right;margin-right:-17px'>           
           <a class='homepage_login' href='login.php'>$lang[login]  </a>
           <a class='homepage_login' href='registrator.php'> $lang[registrator] </a>
           <a class='homepage_login' href='download.php'>$lang[download] </a> 
           <a class='homepage_login' href='mailto:$sport_mail'>$lang[Contact_Us]</a>
         </span>
        ";  
 }else{ 
   if ($_SESSION['auth']== true)
   {
   echo "   
     <span style='float:right;padding:0 150px 0 0;'>   <!-- 多往左一點 -->     
      <a id='show_table' href='#'>
        <img style='width:50px;height:50px;margin:-20px 0 0 0' src='$work_web/upload/user/$_SESSION[UserImage]'>
      </a>
      <span style='color:red'>$i </span>
       <div id='comment_list_pic'><img id='navigation_tri'  src='../pic/person/navigation_tri.png'/></div>
     </span>
    <span style='float:right;padding-right:20px'> $_SESSION[displayname] </span>
    <div  id='comment_list'>
      <div><img src='$work_web/pic/home/home.png'></div>
      <div><a href='$work_web/person/index.php'>$lang[homepage]</a></div>
      <hr>
      <div><img  src='$work_web/pic/home/logout.png'></div>  
      <div><a href='$work_web/loginout.php'>$lang[logout] </a></div>
      <hr>
      <div><img src='$work_web/pic/home/update_passwd.png'></div>  
      <div><a href='$work_web/new_passwd.php'>$lang[new_passwd] </a> </div>
      <hr>
      <div><img  src='$work_web/pic/home/message.png'></div>
      $show_comment_notice     
      </div>";
     // 這邊放那裡無所謂，是js 控制相對位置
    echo "<div  id='new_comment'>$comment_notice </div>";
     // 管理選單，放那裡無關緊要。
     if ( $_SESSION['user_id'] == $admin_id ){ 
       echo "<a href='$work_web/admin.php'>管理介面</a>";
     }  
  }
 } 
?>
    </div>
 </div>
 <div id='down_head_line'></div>





