<?php
$navigation=true;
$no_check=false;
include ("../config/head.php");
include ("../function/slope_difficulty.php");

$user_id=$_SESSION['user_id'];
$map_config=$_SESSION['map'];
//$map_config=2;

$q=$_GET['q'];
$download_button="";
$kill_button="<div id='kill' style='width:100%' class='button_css3'>$lang[kill] </div>";
if ($q=='download')
{
  $download_button="<span style='width:100%' id='download' class='button_css3'>$lang[download_to_device] </span>";
  $kill_button='';
  echo "<style>.edit{display:none;}</style>";
}



// 注意，我這邊這樣寫，兩個表的欄位，都要一樣才行。
$query_base=" tbl_user as b WHERE user_planning='$user_id' and origin_user=b.id";
$query="(SELECT * FROM tbl_planning ,$query_base)";
$query.="UNION ALL ";
$query.="(SELECT * FROM tbl_planning_private_create ,$query_base)";
$query.=" ORDER BY create_time desc ";
$result=mysql_query($query);
$num=mysql_num_rows($result);
$total_page=ceil($num/$page_number);
$select_page="<select id='select_page'>";
for ($i=1;$i<=$total_page;$i++)
{
   $select_page.="<option value='$i'>$lang[page_1] $i $lang[page_2]</option>";
}
$select_page.="</select>";
$query_base=" tbl_user as b WHERE user_planning='$user_id' and origin_user=b.id";
$query="(SELECT * FROM tbl_planning ,$query_base)";
$query.="UNION ALL ";
$query.="(SELECT * FROM tbl_planning_private_create ,$query_base)";
$query.=" ORDER BY create_time desc LIMIT 0,$page_number";
$result=mysql_query($query);
$right_1_content.="<table id='right_table'>";
while ($row=mysql_fetch_array($result))
{
  if ($row[sport_type] ==2)
  {
    $sport_type_pic="<img style='width:25px' src='../pic/train_detail/type_biking.png'/>";
  }else{
    $sport_type_pic="<img style='width:25px' src='../pic/train_detail/type_running.png'/>";
  }

$slope=slope_difficulty_2($row['slope'],1,$http_path);
 $right_1_content.="
 <tr><td>   
      <table ><tr>     
               <td id='show_right_pic_td'>
                   <div><input type='checkbox' name='$row[tain_planning]' value='$row[id_planning]'>$sport_type_pic </div>
                   <div><img id='man_pic'  src='../upload/user/$row[image]'/></div> 
                   <div id='show_map' class='button_css3' name='$row[tain_planning]' value='$row[id_planning]' map_source='$row[map_source]'> $lang[show_map]</div>
                   <div id='edit' class='button_css3' name='$row[tain_planning]' value='$row[id_planning]' map_source='$row[map_source]'>  $lang[edit] </div>          
                </td>
                <td >
                    $row[displayname]<br>
                    $row[web_planning_name]<br>
                    $lang[total_distance](m)：$row[lTotalDistance]<br>
                    $lang[climb](m)：$row[wAscent]<br>
                    $lang[SectionsDifficulty]：$slope
                </td>       
      </td></table>
   
              
                </td></tr>";
  
}
$right_1_content.="</table>";
?>
<script>
var select_no_data='<?php echo $lang['select_no_data']?>' ;
var lang_error_dis_1='<?php echo $lang['lang_error_dis_1']?>';
var lang_error_dis_2='<?php echo $lang['lang_error_dis_2']?>';
var lang_error_wAscent_1='<?php echo $lang['lang_error_wAscent_1']?>';
var lang_error_wAscent_2='<?php echo $lang['lang_error_wAscent_2']?>';
var lang_error_play_format ='<?php echo $lang['lang_error_play_format']?>';
var lang_limit_use_baidu ='<?php echo $lang['limit_use_baidu']?>';
var map_config='<?php echo $map_config?>';
</script>
<script src='js/old.js'></script>
<script src='js/share_function.js'></script>
<!-- 函數名稱要取不同，因為同時引入 -->
<script src='js/old_baidu.js'></script>        
<script src='js/old_google.js'></script>    
<?php
// 函數庫都要引入，都會用到 
//if ($map_config==1){  
  echo '<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=geometry"></script>';
//}else{ 
  echo '<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.5&ak=rHvlawvttpb6EzXsUskGh6f6"></script>';
  echo '<script type="text/javascript" src="http://developer.baidu.com/map/jsdemo/demo/changeMore.js"></script>';
//}
?>
       

     



<style>
#tatal_page{width:100%}
#main_table{width:100%}
#td_left{padding:0px}
#td_right{width:370px;text-align:left;padding:0px}
input[type=text]{width:200px}
/*  地圖 */
#main{position:relative;height:720px;width:100%;vertical-align:top;}   
#map-canvas{height:720px;width:100%;margin:5px;}
/*  地圖重疊定義 , 在 main 裡面*/
#map_right1{position:absolute;right:10px;top:0px;z-index:200;width:95%;height:720px;text-align:left;overflow-y:scroll;word-break:break-all;} 
#map_right2{position:absolute;right:10px;top:0px;z-index:100;width:95%;height:720px;text-align:left;overflow-y:scroll;word-break:break-all;} 

/*  右邊的主畫面 */
#train_pic{height:60px}
#man_pic{width:50px;max-height:50px}
#right_table{width:100%}
#right_table span{display: inline-block; vertical-align:top;margin:0px 10px 0px 0px }
#right_table tr{line-height:20px;}
#right_table td{width:100%;padding:4px 0; text-align:left;background:<?php echo $background_color_1?>}
#right_table td #show_right_pic_td{width:10px;padding:0px 6px;text-align:center; }
#show_right_pic_td div{margin:2px 0 }
.button_css3{height:20px;width:75px;line-height:20px}

</style>


<table id='main_table'>
 <tr>
  <td id='td_left'> 
    <div id="map-canvas"></div>
  </td>
  <td id='td_right'> 
<div id='main'>
<!-- show list-->
  <div id='map_right1'>
       <span ><input type='text' id='search_1'></span>       
       <span id='search' class='button_css3'  ><?php echo $lang['keyword'] ?> </span>
       <p>  
       <?php echo $lang['sort']?>: 
       <select id='select_sort'>
         <option><?php echo $lang['create_date']?></option>
         <option><?php echo $lang['total_distance']?></option>
         <option><?php echo $lang['SectionsDifficulty']?></option>
         <option><?php echo $lang['climb']?></option>
       </select>
    <!-- 頁數-->
        <?php echo $select_page ?>
    <p>
    <?php
          echo $download_button;          
          echo $kill_button;         
        ?>  
    <br><br> 
 
       <div id='1_search_result'>   
          <?php echo $right_1_content;?>
       </div> 
  
  </div>
   <div id='map_right2'></div>
</div>
</td>



</tr></table>

<?php
 include ("../foot_all.php");
?>