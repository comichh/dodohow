<?php
include ("../../config/web.ini");
include ("../../config/mysql.php");

function show_comment_form ($row,$train_id,$show_reply=0)
{
global $creator,$admin_id;
switch ($row['indent'])
      {
        case 1:
          $use_css='form-signin_1';
        break; 
        case 2:
          $use_css='form-signin_2';
        break; 
        default:
          $use_css='form-signin';
     } 
      mysql_query("set names 'utf8'");  
      $query_4="select * from  tbl_comment,tbl_user where id_comment='$row[id_comment]' and   tbl_comment.for_comment_user=tbl_user.id";      
      $result_4=mysql_query($query_4);    
      while ($row4=mysql_fetch_array($result_4))
      { 
        $reply_men=" 回覆 ".$row4['displayname'];          
      }
      // 個別黑名單， 不能對我的回應（巢狀）留言
      $black_user_1=0;
      $query_black="select * from tbl_blacklist where  for_me_user_key='$row[id]' and for_black_user_key='$_SESSION[user_id]'";
      $result_black=mysql_query($query_black);   
      if (mysql_num_rows($result_black)==1){$black_user_1=1;}    

      // 個人照片      
      $img="<img width='30' src='$work_web/dodohow/upload/user/$row[image]'></img>";       
      $comment_origin_form.="<div class='$use_css'>";
      if ($show_reply==0 and $black_user_1!=1){   
        $comment_origin_form.="<button id='new_reply_".$row['id']."_".$train_id."_".$row['id_comment']."'>回應此文</button>"; 
      }
      // 刪除條件,文章擁有者,紀錄的所有者,網站管理者     
      $kill="<button id='kill_".$row['id_comment']."'>刪除此文</button>";
      if ($row['fullname'] == $_SESSION['fullname'] or $_SESSION['user_id']==$creator  or  $_SESSION['user_id']==$admin_id){
         $comment_origin_form.=$kill;
      } 
      $comment_origin_form.="<div class='name'>".$img.$row['displayname'].$reply_men."</div>";       
      $comment_origin_form.="<div class='input-block-level'>".$row['content']."</div>";        
      $comment_origin_form.="<div id='content_new_reply_".$row['id']."_".$train_id."_".$row['id_comment']."'><TextArea Cols='40' Rows='3' Wrap='Virtual' class='input-block-level' placeholder='回覆內容' name='content'></TextArea>";
      $comment_origin_form.="<button id='submit_new_reply_".$row['id']."_".$train_id."_".$row['id_comment']."'>送出</button></div>";       
      $comment_origin_form.="</div>";


      return $comment_origin_form;
}


function nested_1($train_id,$for_comment_id)
{
  $query_1="select * from tbl_comment,tbl_user where for_train_id='$train_id' and  tbl_comment.for_user_id=tbl_user.id  and for_comment_id='$for_comment_id'";
  $result_1=mysql_query($query_1);
  while ($row1=mysql_fetch_array($result_1))
  { 
    $comment_origin_form.=show_comment_form ($row1,$train_id); 
    $comment_origin_form.=nested_2($train_id,$row1['id_comment']);  
  } 
  return $comment_origin_form;
}


function nested_2($train_id,$for_comment_id)
{
  $query_2="select * from tbl_comment,tbl_user where for_train_id='$train_id' and  tbl_comment.for_user_id=tbl_user.id  and for_comment_id='$for_comment_id'";
  $result_2=mysql_query($query_2);
  while ($row2=mysql_fetch_array($result_2))
  { 
    $comment_origin_form.=show_comment_form ($row2,$train_id,1); 
  }
  return $comment_origin_form;
}

// 主程式開始
   $train_id=$_POST['tripID'];
   session_start() ;

// 撈一下文章的創造者 
$query_1="select * from tbl_train_data,tbl_device   where tbl_train_data.id='$train_id' and tbl_train_data.deviceid=tbl_device.deviceid"; 
$result_1=mysql_query($query_1); 
while ($row=mysql_fetch_array($result_1))
{
  $creator=$row['creator'];     // 這筆紀錄擁有者的 autokey
}


   $comment_form="     
     <button id='reply_".$train_id."'>發表回應</button>   
     <TextArea Cols='40' Rows='3' Wrap='Virtual' class='input-block-level' placeholder='回覆內容' name='content'></TextArea>               
    ";      
  
    $query="select * from tbl_comment,tbl_user where  for_train_id='$train_id' and tbl_comment.for_user_id=tbl_user.id  and for_comment_id=0 order by id_comment desc";
   
    $result=mysql_query($query);      
    while ($row=mysql_fetch_array($result))
    { 
      $comment_origin_form.=show_comment_form ($row,$train_id);       //第一層  
      $comment_origin_form.=nested_1($train_id,$row['id_comment']);   //第二層     
    } 
// 這邊撈一次黑名單,  黑名單有兩種，若是訓練紀錄擁有者，檔全部留言。巢狀裡面也可以個別擋。
    $black_user=0; 
    $query_black="select * from tbl_blacklist where  for_me_user_key='$creator' and for_black_user_key='$_SESSION[user_id]'";
    $result_black=mysql_query($query_black);   
    if (mysql_num_rows($result_black)==1){$black_user=1;}

     if ($black_user !=1){
        echo $comment_form;              // 對紀錄留言
        echo $comment_origin_form;       // 歷史留言
    }else {echo "禁止留言";}
?>
