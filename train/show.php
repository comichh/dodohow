<?php
$navigation=true;
$no_check=false;
include ("../config/head.php");
$train_id=$_GET['train_id'];
$user_id=$_GET['user_id'];

?>

<script type="text/javascript" src="../jquery/plugin/cycle2/jquery.cycle2.all.js"></script>
<script type="text/javascript" src="../jquery/plugin/cycle2/jquery.cycle2.Carousel.js"></script>


<style>
#body_table{}
/*  圖片輪播 */
#pause{display:none}
/* #main_table{display:none}*/
.slideshow_pic {width:100% ;height:100%;}
.slideshow_pic img {width:100%; height:auto ; padding:5px ;}  

#main_table{width:100%;height:720px;text-align:left;padding:0}
#main_table td{padding:2px;}
#cycle_left_td{width:80%;height:720px;text-align:center;background-color:#D1D1D1;}
#cycle_left_td img {height:720px}
#cycle_mid_td{width:20%;height:720px; vertical-align:top;background:#D0D0D0;text-align:left;}      
#show img{max-width:800px}
.pic_info_1{background:#C3BCB0;margin:10px 0;padding:5px}

</style>


<?php
// 圖片資料個別撈
$j=0;
$query_pic="select * from tbl_pic  where pic_train_key='$train_id' and pic_lat !='999'";
$result_pic=mysql_query($query_pic);
if (mysql_num_rows($result_pic) > 0)
{
  while ($row=mysql_fetch_array($result_pic))
  {
    $sql_pic_array[$j]['pic_lat']=$row['pic_lat'];      //  pic 經度
    $sql_pic_array[$j]['pic_lng']=$row['pic_lng'];      //  pic 緯度
    $sql_pic_array[$j]['pic_name']=$row['pic_name'];    //  pic 檔名                                                  
    if ($j==0){
      $first_pic="../upload/trip_photo/$user_id/$train_id/thumbnail/$row[pic_name]";   
      $first_pic_title=$row['pic_title'];  
    }
    if ( $row[pic_title] ==''){$row[pic_title]='N/A';}   
    $need_pic.="<img  style='height:180px' alt='$row[pic_title]' src='../upload/trip_photo/$user_id/$train_id/thumbnail/$row[pic_name]'>";
    $j++; 
  }
}else{
  $first_pic="$work_web/pic/train_detail/sample.jpg";
  $first_pic_title='sample';    
  $need_pic="<img  src='$first_pic'>"; 
}
$first_pic_show="<div id='show'>";
$first_pic_show.="<img  src='$first_pic'></div>";    
$first_pic_show.="<div  class='pic_info_1'> $first_pic_title</div>";


$sql_pic_json=json_encode($sql_pic_array);
$to_js="<script type='text/javascript'>";
$to_js.="var beaches_pic=$sql_pic_json";
$to_js.="</script>";
echo $to_js; 
?>

<div id='body_page'><div id='body_table'>
<table id='main_table'>
 <tr>
  <td id='cycle_left_td'>   
     <!-- 再多一個 table 出來吧-->
    <table align='center' style='width:100%'><tr>
      <td style='width:10px'>  
        <a href='#' id='prev3'><img style='width:48px;height:91px;' src='../pic/train_detail/button_back_1.png'/> </a>
      </td>
      <td style='width:95%'>  
        <?php echo  $first_pic_show;?>
      </td>
      <td style='width:10px'> 
        <a href='#'id='next3'> <img style='width:48px;height:91px;'  src='../pic/train_detail/button_next_1.png'/></a>
      </td>
      </tr></table>
  </td>
  <td id='cycle_mid_td'>            
     <div id="cycle-2" class="slideshow_pic" 
                data-cycle-fx=carousel
                data-cycle-paused=true
                data-cycle-timeout=2000
                data-cycle-carousel-visible=3
                data-cycle-carousel-slide-dimension=240      
                data-cycle-next="#next3"
                data-cycle-prev="#prev3"
                data-cycle-stop="#stop"
                data-cycle-pager="#pager3"
                data-cycle-carousel-vertical=true
                data-cycle-pause-on-hover=true
                data-allow-wrap=false  
                data-cycle-log=false              
              >
           <?php echo $need_pic; ?>
    </div>
    <div style='float:right;'>  
       <a href='#' id='start' ><img  src='../pic/train_detail/button_play_40x35_small_b.png'/> </a>    
       <a href='#' id='pause' ><img  src='../pic/train_detail/button_stop_40x35_small_b.png'/> </a> 
    </div>  		       
  </td>
</tr></table>
</div></div>
<script src='js/pic_cycle.js'></script>

