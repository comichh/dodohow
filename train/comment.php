<?php
$navigation=true;
$no_check=false;
include ("../config/head.php");
global $lang;

$to_js="<script type='text/javascript'>";
$to_js.="var http_path='$http_path'; ";
$to_js.="</script>";
echo $to_js;             //傳遞參數給 js
?>
<link rel="stylesheet" type="text/css" href="../_css/comment.css"> 
<script type='text/javascript'  src='js/comment.js' ></script>
<?php
   $train_id=$_GET['train_id'];
   $comment_id=$_GET['commentid'];
   $cancel=$_GET['cancel'];
// 取消通知
if ($cancel =='1' ){
  $query="update  tbl_comment set  Notice=0 where  id_comment='$comment_id'";
  $result=mysql_query($query);
}

// 一些固定變數
$comment_pic_path="$work_web/pic/comment";
$show_white="<img src='$comment_pic_path/show_b-.png'/>";
$show_black_1="<img  src='$comment_pic_path/show_b+.png'/>";
$triangle="<img width='35px;' src='$comment_pic_path/triangle.png'/>";

 
// 最下面的回應框
   $comment_form="
     <div>
     <TextArea  Cols='2' Rows='3' Wrap='Virtual' class='input-block-level_1'  name='content'></TextArea>               
     <button class='button_css3' id='reply_".$train_id."'>$lang[submit_comment]</button>
     </div>
";   
// end




// 撈一下文章的擁有者 ，還是撈一下好了，不然可以偽裝
$query_1="select * from tbl_train_data,tbl_device,tbl_user  where tbl_train_data.id='$train_id' and tbl_train_data.deviceid=tbl_device.deviceid and tbl_device.creator=tbl_user.id" ; 
$result_1=mysql_query($query_1); 
while ($row=mysql_fetch_array($result_1))
{
  $creator=$row['creator'];                       // 這筆紀錄擁有者的 autokey
  $train_description=$row['train_description'];
  if ( strlen($train_description) > 50){
    $train_description=substr($row['train_description'],0,50);
    $train_description.="....";
  }  
  if ($train_description !=''){$train_description="(".$train_description.")";}
  $top_content_m="<span id='top_content_m'>$row[train_name] </span>";
  $creator_img="<img  src='$work_web/upload/user/$row[image]'></img>";
}


// 主畫面的呈現
$train_top_head="<body><div id='body_page'> <div id='body_table'>";
$train_top_head.="<div id='top_pic_div'><span>$creator_img</span>".$top_content_m."<span>".$train_description."<span>  </div>";
//$train_top_head.="<div id='top_content_1'><span class='te'>$creator_img</span><span class='te'>".$train_description."</span><hr>";
$train_top_head.="<div id='top_content_1'><br>";

     
    $query="select * from tbl_comment,tbl_user where  for_train_id='$train_id' and tbl_comment.for_user_id=tbl_user.id  and for_comment_id=0 order by id_comment";  //這邊是最上層的總紀錄  
    $result=mysql_query($query);
    $total_0_result_number=mysql_num_rows($result);  
    $comment_origin_form.="<table>";    
    while ($row=mysql_fetch_array($result))
    { 
      $first_id="hide_".$row['id_comment'];
      $img="<img class='first_me_pic'  src='$work_web/upload/user/$row[image]'></img>";        
      $comment_origin_form.="<tr><td class='triangle' >".$img."</td><td>";  
      $comment_origin_form.="<div id='range_comment'>";
      $comment_origin_form.=show_comment_form ($row,$train_id);       //第一層  
      $comment_origin_form.=nested_1($train_id,$row['id_comment']);   //第二層     
      $comment_origin_form.="</div></td></tr>";
    } 
// 這邊撈一次黑名單,  黑名單有兩種，若是訓練紀錄擁有者，擋全部留言。巢狀裡面也可以個別擋。
    $black_user=0; 
    $query_black="select * from tbl_blacklist where  for_me_user_key='$creator' and for_black_user_key='$_SESSION[user_id]'";
    $result_black=mysql_query($query_black);   
    if (mysql_num_rows($result_black)==1){$black_user=1;}

    echo $train_top_head;
    echo "<div style='color:black'> <a id='show_total_comment' href='#'>$show_white </a>$lang[show_comment_1] :$total_0_result_number</div>";
     if ($black_user !=1){   
        echo "<div id='all_content'>";    
        echo $comment_origin_form;       // 歷史留言
        echo "</td></tr></table></div>";
        echo $comment_form ;          // 對紀錄留言
        echo "</div></div><div> </body>";
    }else {echo $lang['no_comment'];}








function show_comment_form ($row,$train_id, $show_reply=0)
{
global $creator,$admin_id,$work_web,$first_id,$show_black_1;
global $lang;
$img="<img class='second_me_pic' src='$work_web/upload/user/$row[image]'></img>";     // 2,3 層個人大頭照 
$show_hidden_list="";
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
          $show_hidden_list="<a style='' id='show_2_".$row['id_comment']."' href='#'>".$show_black_1."</a>$lang[show_comment_2]:".nested_1_number($train_id,$row['id_comment']);          
          $img="";   
     }              
       $reply_men=" $lang[say] ";               
      // 個別黑名單， 不能對我的回應（巢狀）留言
      $black_user_1=0;
      $query_black="select * from tbl_blacklist where  for_me_user_key='$row[id]' and for_black_user_key='$_SESSION[user_id]'";
      $result_black=mysql_query($query_black);   
      if (mysql_num_rows($result_black)==1){$black_user_1=1;}    
              
      $comment_origin_form.="<div class='$use_css $first_id'>";     
      $comment_origin_form.="$img<div class='name'>".$row['displayname'].$reply_men."</div><br>";       
      $comment_origin_form.="<div class='input-block-level'>".$row['content']."</div>";
        
      $comment_origin_form.="<div id='content_new_reply_".$row['id']."_".$train_id."_".$row['id_comment']."'><TextArea  Cols='40' Rows='3' Wrap='Virtual' class='input-block-level'  name='content'></TextArea>";
      $comment_origin_form.="<span class='button_css3'  id='submit_new_reply_".$row['id']."_".$train_id."_".$row['id_comment']."'>$lang[submit]</span></div>";       
      $comment_origin_form.="<div class='right_button'>".$row['comment_data']."</div><br>";
      $comment_origin_form.=$show_hidden_list;
      if ($show_reply==0 and $black_user_1!=1){   
        $comment_origin_form.="<span  class='right_button comment_button button_css3' id='new_reply_".$row['id']."_".$train_id."_".$row['id_comment']."'>".$lang['responses_comment']."</span>"; 
      }
      // 刪除條件,文章擁有者,紀錄的所有者,網站管理者(alfred )     
      $kill="<span class='right_button comment_button button_css3'  id='kill_".$row['id_comment']."'>$lang[kill_comment]</span>";
      if ($row['fullname'] == $_SESSION['fullname'] or $_SESSION['user_id']==$creator  or  $_SESSION['user_id']==$admin_id){
         $comment_origin_form.=$kill;
      }     
      $comment_origin_form.="<br></div>";

      return $comment_origin_form;
}


function nested_1($train_id,$for_comment_id)
{
  global $lang;
  $query_1="select * from tbl_comment,tbl_user where for_train_id='$train_id' and  tbl_comment.for_user_id=tbl_user.id  and for_comment_id='$for_comment_id'";
  $result_1=mysql_query($query_1);
  $total_1_result_number=mysql_num_rows($result_1);
  while ($row1=mysql_fetch_array($result_1))
  { 
    $comment_origin_form.=show_comment_form ($row1,$train_id); 
    $comment_origin_form.=nested_2($train_id,$row1['id_comment']);  
  } 
  return $comment_origin_form;
}
function nested_1_number($train_id,$for_comment_id)
{
  global $lang;
  $query_1="select * from tbl_comment,tbl_user where for_train_id='$train_id' and  tbl_comment.for_user_id=tbl_user.id  and for_comment_id='$for_comment_id'";
  $result_1=mysql_query($query_1);
  $total_1_result_number=mysql_num_rows($result_1); 
  return $total_1_result_number;
}


function nested_2($train_id,$for_comment_id)
{
  global $lang;
  $query_2="select * from tbl_comment,tbl_user where for_train_id='$train_id' and  tbl_comment.for_user_id=tbl_user.id  and for_comment_id='$for_comment_id'";
  $result_2=mysql_query($query_2);
  while ($row2=mysql_fetch_array($result_2))
  { 
    $comment_origin_form.=show_comment_form ($row2,$train_id,1); 
  }
  return $comment_origin_form;
}


?>
