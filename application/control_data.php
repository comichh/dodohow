<?php 
   $no_check=false;
   $navigation=true;
   include ("../config/head.php");
   $show_status=$_GET['show_status'];        // 0 沒有搜尋特定使用者, 自己的紀錄
   $map_config=$_SESSION['map'];
   //$map_config=2;
   setcookie("show_status",$show_status,time()+72000);
   if ($show_status == 0)
   {
      $search_user='';
      $deep_height='330'; 
      $gpx="<a class='button_css3' href='../gpx/index.php'>GPX Upload </a>"; 
   }else{
     $search_user="<tr><td>$lang[FilterUser]</td><td><input type='text' id='SearchByName' /></td></tr>";  
     $deep_height='370';
     $gpx='';   
   }   
?>
  <link rel='stylesheet' type='text/css' media='all' href='../jquery/plugin/dynDateTime/css/calendar-blue2.css' />   
  <link rel='stylesheet' type='text/css' media='all' href='../jquery/ui/jquery_ui/jquery-ui_1.10.4.css' />
 <style>
#DeepSearch
{
		color:white;
		font-size:14px;        
		/* background-image:url(images/DeepSearch.png); 
    background-repeat:no-repeat;    */
    background:#888888;
		display:none;
		width:290px;
		height:<?php echo $deep_height?>px;
}
#deepsearch_table{width:100%;padding:10px}
#deepsearch_table td{padding:2px;text-align:left;} 
#DeepSearch input[type=text]{width:140px;height:30px;}
#DeepSearch input[type=select]{width:140px;height:26px}


#slider-range_2,#slider-range-max{width:70%}
.ui-widget-header{ background:blue;width:50px;}
</style> 

	<script>
      var show_status='<?php echo $show_status?>';
      var SportHistory_errer_1='<?php echo $lang['portHistory_errer_1'] ?>';
      var map_config='<?php echo $map_config?>';
  </script>  
   <?php
   if ($map_config==1){ 
    echo "<script type='text/javascript' src='https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places,geometry'></script>";
    echo "<script type='text/javascript' src='js/control_google.js'></script>";    
   }else{
     echo "<script type='text/javascript' src='http://api.map.baidu.com/api?v=1.5&ak=rHvlawvttpb6EzXsUskGh6f6'></script>";
     echo "<script type='text/javascript' src='js/control_baidu.js'></script>";  
   }
   ?>
   <script type="text/javascript" src="js/control_data.js"></script>
   <script type="text/javascript" src="../jquery/ui/jquery_ui/jquery-ui_1.10.4.js"></script>
   <script type='text/javascript' src='../jquery/plugin/dynDateTime/JS/jquery.dynDateTime.js'></script>
   <script type='text/javascript' src='../jquery/plugin/dynDateTime/lang/calendar-utf8-tw.js'></script>
   
	<!-- 內容開始 ，有些沒有進入  css 控制，要單獨改 -->
  <div id='body_page'> <div id='body_table'> 
    <table>      
				<td style='text-align:left;padding:0px'>      
          <span class='stand_button_0'>
            <span><a id="FilterAdvSearch"><?php echo $lang['deep_search'];?></a></span>
          </span>             
						<?php echo $lang['search_address'] ?>：<input id="addressFieldName" type="text"  style="width:300px;"/>           		
				    <span class='button_css3' id='SearchByTop'><?php echo $lang['search'] ?> </span>
            <span style='float:right'><?php echo $gpx ?></span>
		    
       <!--  實際內容都在這邊, 都是用iframe 進來的 -->  
			  <iframe id="iframe_table" width="1280px" scrolling="no" frameborder=0 style="float:center;height:720px"></iframe>
				</td>
			</tr>
		</table>

    </div>
	</div>

<?php
include ("../foot.php");
?>

<!--  主內容 end ，浮窗內容 -->

  <div id="DeepSearch">
			<table id='deepsearch_table'>
				<tr>
					<td>
						<?php echo $lang['total_distance'];?>
					</td>
					<td>
            <div id="slider-range_2"></div>	
            <div id="amount_2" style="font-weight:bold;"></div>		
      		</td>
				</tr>
				<tr>
					<td >
						<?php echo $lang['total_time'];?>
					</td>
					<td>
             <div id="slider-range-max"></div>
             <div type="text" id="amount_1" style="font-weight:bold;"></div>
					</td>
				</tr>
 <?php echo $search_user;?>
				<tr>
					<td><?php echo $lang['sport_type'];?></td><td>
						<select id="SportType" >
							<option value="0"><?php echo $lang['all_select'];?></option>
							<option value="1"><?php echo $lang['run'];?></option>
							<option value="2"><?php echo $lang['bicycle'];?></option>
						</select>
					</td>
				</tr>
				<tr><td><?php echo $lang['train_name'];?></td><td><input type="text" id="SearchByKeyword" /></td></tr>
				<tr><td><?php echo $lang['start_time'];?></td>
					<td>
							<input id="date_start" type="text"></input>
					</td>
				</tr>

				<tr><td><?php echo $lang['end_time'];?></td>
					<td>
						<input id="date_end" type="text"></input>
					</td>
				</tr>
				<tr><td><?php echo $lang['SectionsDifficulty'];?></td>
					<td>
<select name='Difficulty[]'>
<option value='0'><?php echo $lang['select'] ?></option>
<option>0.5</option>
<option>1</option>
<option>1.5</option>
<option>2</option>
<option>2.5</option>
<option>3</option>
<option>3.5</option>
<option>4</option>
<option>4.5</option>
<option>5</option>
</select>
					</td>
				</tr>
				<tr>
          <td colspan=2  style='text-align:center;'><br>
               <span class='button_css3' id="Search"/><?php echo $lang['search']?></span>
            <!--
                <div id="LoadTripItems" style="position:relative;top:10px;display:none"><img src="./images/LoadingShine.gif" /></div>
            -->
          </td>
        </tr>
			</table>
		</div>
  <!---  左上角浮窗結束 -->





  

