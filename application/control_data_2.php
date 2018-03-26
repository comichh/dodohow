<?php
// 第一次進來是走這支程式, 按下進階搜尋後，是走 control_data_1.js 
  include ("../auth.php");
  include ("../config/lang_select.php");
   
  $lat=$_GET["lat"];
	$lng=$_GET["lng"];
  $show_status=$_COOKIE['show_status']; 
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link href="./com/sortdatagrid/css/jquery-ui-1.8.2.custom.css" rel="stylesheet" type="text/css" media="screen">
<link href="./com/sortdatagrid/css/ui.jqgrid.css" rel="stylesheet" type="text/css" media="screen">
<link href="./com/sortdatagrid/css/ui.multiselect.css" rel="stylesheet" type="text/css" media="screen">     
<STYLE type="text">
	html, body {
		margin:5px;		
		padding:0px;
		overflow: hidden;
	}
</STYLE>
<script type="text/javascript">
    var show_status='<?php echo $show_status?>'; 
</script>
<script src="./com/sortdatagrid/js/jquery.js" type="text/javascript"></script>
<script src="./com/sortdatagrid/js/grid.locale-zw.js" type="text/javascript"></script>
<script src="./com/sortdatagrid/js/jquery.jqGrid.min.js" type="text/javascript"></script>
<script src="./com/sortdatagrid/js/jquery-ui-custom.min.js" type="text/javascript"></script>
<script src="./common/lib/js/datetime.js"></script>
	<script type="text/javascript">
    // 這個不知道是怎麼傳過來的，目前看起來是要傳過去  
		 var requestPageURL='<?php echo $requestPageURL ?>';
		var lat=<?php echo $lat ?>;
		var lng=<?php echo $lng ?>;
    // 語系檔
     var sportHistory_errer_2='<?php echo $lang['portHistory_errer_2'] ?>';
     var edit_1='<?php echo $lang['edit'] ?>';
     var share='<?php echo $lang['share'] ?>';
     var detail_info='<?php echo $lang['detail_info'] ?>';

		var titleFilterDetail='<?php echo $lang['FilterDetail'] ?>';
		var titleFilterPublishTime='<?php echo $lang['FilterPublishTime'] ?>';
		var titleFilterActivityStartTime='<?php echo $lang['FilterActivityStartTime'] ?>';
		var titleFilterUser='<?php echo $lang['FilterUser'] ?>';
		var titleFilterActivityName='<?php echo $lang['train_name'] ?>';
		var titleFilterPhotos='<?php echo $lang['FilterPhotos'] ?>';
		var titleFilterActivityDurtion='<?php echo $lang['total_time'] ?>';
		var titleFilterActivityDistance='<?php echo $lang['total_distance'] ?>';
		var titleFilterActivityDesc='<?php echo $lang['sport_info'] ?>';
    var title_machine_type ='<?php echo $lang['machine_type'] ?>';
		var titleFilterMessage='<?php echo $lang['comment'] ?>';
		var titleFilterPraise='<?php echo $lang['praise'] ?>';
		var titleFilterCollect='<?php echo $lang['planning'] ?>';
		var titleSectionsDifficulty='<?php echo $lang['SectionsDifficulty'] ?>';
	</script>
<script src="./js/control_data_2.js" type="text/javascript"></script>

</head>
<body topmargin="0" leftmargin="0">
<table id="list"><tr><td></td><tr></table>
<div id="pager"></div>
  <?php include ("../foot.php");?>
</body>
</html>

