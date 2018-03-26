<?php
   include ("../../../config/web.ini");
   include ("../../../auth.php");
   include ("../../../config/lang_select.php");
  
$user_id=$_SESSION['user_id'];
$map_config=$_SESSION['map'];
//$map_config=2;               // baidu 好像有些東西還缺，第一次進去時，沒有預覽點

//$showAlert=0;

//$right_frame_height="684px";
//$ie_Compatible="edge";
?>
<html>
<head>
    <meta charset="utf-8">
  	<link type="text/css" rel="stylesheet" href="./css/index.css">
  	<link type="text/css" rel="stylesheet" href="../../../_css/style.css"  >

	<link type="text/css"  rel="stylesheet" type="text/css" media="screen" href="./css/google-map-fix.css">
  <link type="text/css"  rel="stylesheet" href="../../../jquery/ui/jquery_ui/jquery-ui_1.10.4.css">
  <link type="text/css"  rel='stylesheet' type='text/css' media='all' href='../../../jquery/plugin/dynDateTime/css/calendar-blue2.css' />   
<style>
th{background:blue;color:white;text-align:left;padding:0px;}
td{text-align:left;padding:0 }
#show_vscroll_div{ width:100%;height:684px;}
#slider-range_2,#slider-range-max{width:70%}
.ui-widget-header,.ui-slider-range {background:blue;width:50px;}
#DeepSearch { 
  position:absolute;left:0px;bottom:0px;z-index:0;
  background:#888888;
  width:320px;
  height:380px;
  display:none;
	color:white;
  font-size:14px;
} 
#DeepSearch input[type=text]{width:140px;height:30px;}
#DeepSearch input[type=select]{width:140px;height:26px}
#SortCollection{    /* 換圖片吧 */ 
 position:absolute;left:0px;bottom:0px;z-index:0 ;
 background:#888888;
 width:320px;
 height:170px;
 display:none;
 color:white;
 font-size:14px;
}
#search_title::before
{
  content: '';
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 100%;
}

#tab_sport{float:right;padding:0px;margin:0px}
.stand_button_0 img{padding:4px;}

/*  浮窗那塊 */
#targethtml_tatal{background-color:black;width:310px;height:320px;padding-left:5px}
.targethtml_title{font-size:18px;color:#FF6600;font-weight:900;}
#targethtml_tatal table{width:100%;font-size:16px;color:white}
#show_info{position:relative;top:10px;color:#ffffff} 
#show_info div{display:inline-block;vertical-align: middle;}
#div_align{text-align:center}
.detail_button{color:white;width:290px;margin:0:auto}
</style>
  <script type="text/javascript" src="js/jquery-1.8.3.js"></script> 
	<script type="text/javascript" src="./js/jquery-migrate-1.2.1.min.js"></script> 
    <script type="text/javascript">
		var id=<?php echo $user_id ?>;
    var map_config='<?php echo $map_config ?>';
		var runType="0";
    // 這邊加入語系檔
		var titleTotalDistance='<?php echo $lang['total_distance'] ?>';
		var titleTotalTime='<?php echo $lang['total_time'] ?>';
		var titleTotalCalory='<?php echo $lang['total_calory'] ?>';
	  var titleCumulativeAscent='<?php echo $lang['total_climb'] ?>';
		var titleCumulativeDistance='<?php echo $lang['sum_distance'] ?>';
		var titleHighestElevation='<?php echo $lang['HighestElevation'] ?>';
		var titleCumulativeTime='<?php echo $lang['sum_time'] ?>';
    var titleSectionsDifficulty='<?php echo $lang['SectionsDifficulty'] ?>';
		var routeImageBaseUrl='<?php echo "$work_web/upload/point_thumbnail" ?>';
    var portHistory_errer_1='<?php echo $lang['portHistory_errer_1'] ?>';
    // 看看要不要這邊就直接抽掉？ 先把跟地圖有關的東西，和跟地圖無關的功能抽離 
	</script>

<script type="text/javascript" src="./js/index_nb.js"></script>
<?php  
if ($map_config==1){  
  echo '<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=geometry"></script>';
	echo "<script type='text/javascript' src='js/index_nb_google.js'></script>";
}else{ 
  echo '<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.5&ak=rHvlawvttpb6EzXsUskGh6f6"></script>';
  echo '<script type="text/javascript" src="http://developer.baidu.com/map/jsdemo/demo/changeMore.js"></script>';
  echo "<script src='js/index_nb_baidu.js'></script>";
}
?>

	<!-- <script type="text/javascript" src="./js/infobox.js"></script> -->

  <script type="text/javascript" src="./js/datetime.js"></script>
  <script type="text/javascript" src="../../../jquery/ui/jquery_ui/jquery-ui_1.10.4.js"></script>
  <script type='text/javascript' src='../../../jquery/plugin/dynDateTime/JS/jquery.dynDateTime.js'></script>
  <script type='text/javascript' src='../../../jquery/plugin/dynDateTime/lang/calendar-utf8-tw.js'></script>

</head>
<!-- 最後那一塊，還有右邊那塊，又是 iframe  -->
<div id='body_page'>
	<table id="WrapperTableContet" class="WrapperTable" style='height:684px;width:1280px;margin:0 auto;text-align:left; ' >
		<tr>
			<td  id='search_title' >      
      	<?php echo $lang['search_address']?>：
              <input class="span2" id="addressFieldName" type="text" size="80" style="width:300px" />
              <span  class='button_css3' onclick="codeAddress()" /> 
                    <?php echo $lang['search']?> 
              </span>
              <span class='stand_button_0' id='tab_sport'>           
                   <span class='no_padding'><img id="showRunningRecord" src="../../../pic/social_map/tab_Running_over_1.png" onclick="resetButtonBackgroundRunning()" ></span>
                   <span class='no_padding'><img id="showCycleRecord"  src="../../../pic/social_map/tab_Cycling_over_1.png" onclick="resetButtonBackgroundCycle()"></span>                
              </span>
			</td> 
			<td  width="250px" rowspan=3 valign="top">
				<div id="show_vscroll_div"></div>
			</td>
		</tr>
		<tr style="vertical-align:top;">
			<td>
        <div style='position:relative;'> 
				    <div id="map-canvas" style="width:100%;height:450px;"></div>
            <?php include ("include/deep_search.php");?>
       </div> 
			</td>
		</tr>
		<tr>
			<td style="vertical-align:top;margin:0px ">
        <!-- 這邊高度很怪，設這樣ie 可以正常， 應該是跟  brain 硬改的套件有關 -->
					<iframe id="ScrollFrame" frameBorder="0"  width="100%" height="145" scrolling="no"></iframe>		
			</td>
		</tr>
	</table>
</div>
</html>
