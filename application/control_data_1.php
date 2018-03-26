<?php 
// 按下搜尋是走這支程式
  include ("../auth.php");
  include ("../config/lang_select.php");
  $queryMode=$_GET["SearchMode"];
	$sportType=$_GET["type"];

  $sortType=$_GET["sortType"];
  $findUserName=$_GET["findUserName"];
	$findkeyword=$_GET["keyword"];
  $startDate=$_GET["startDate"];
	$endDate=$_GET["endDate"];
	$photo=$_GET["photo"];
	$distanceRangeStart=$_GET["distanceRangeStart"];
	$distanceRangeEnd=$_GET["distanceRangeEnd"];
	$timeRange=$_GET["timeRange"];
  $slope_diff=$_GET["slope_diff"];

  $show_status=$_COOKIE['show_status']; 


	switch($queryMode){
		case 1:
			$requestPageURL.='./lib/GetShareBoundaryActivity.php?runType='.$sportType;
			break;
		case 2:
			$requestPageURL='./common/lib/php/GetShareActivityByFilter.php?runType='.$sportType
				.'&sortType='.$sortType.'&findUserName='.$findUserName
				."&findkeyword=".$findkeyword."&startDate=".$startDate
				."&endDate=".$endDate."&photoExist=".$photo."&distanceRangeStart="
				.$distanceRangeStart."&distanceRangeEnd=".$distanceRangeEnd."&timeRange=".$timeRange."&slope_diff=".$slope_diff;
			break;
		case 3:
			$requestPageURL='./common/lib/php/GetShareActivityByFilter.php?runType='
				.$sportType.'&findUserName='.$findUserName.'&findkeyword='
				.$findkeyword."&startDate=".$startDate.'&endDate='.$endDate.'&photoExist='
				.$photo."&distanceRangeStart=".$distanceRangeStart."&distanceRangeEnd="
				.$distanceRangeEnd."&timeRange=".$timeRange."&slope_diff=".$slope_diff;
			break;
		default:
			  $requestPageURL='./lib/GetShareActivity.php?runType='.$sportType;
			break;
	}
   
?>
<link href="./com/sortdatagrid/css/jquery-ui-1.8.2.custom.css" rel="stylesheet" type="text/css" media="screen">
<link href="./com/sortdatagrid/css/ui.jqgrid.css" rel="stylesheet" type="text/css" media="screen">
<link href="./com/sortdatagrid/css/ui.multiselect.css" rel="stylesheet" type="text/css" media="screen">     
<STYLE type="text">
	html, body {
		margin:5px;			/* Remove body margin/padding */
		padding:0px;
		overflow: hidden;	/* Remove scroll bars on browser window */"
	}

</STYLE>
<script type="text/javascript">
    var show_status='<?php echo $show_status?>';  
    var requestPageURL='<?php echo $requestPageURL ?>';
    // 語系檔
    var edit_1='<?php echo $lang['edit'] ?>';
    var share='<?php echo $lang['share'] ?>';
    var detail_info='<?php echo $lang['detail_info'] ?>';
		var titleFilterDetail='<?php echo $lang['FilterDetail'] ?>';
		var titleFilterPublishTime='<?php echo $lang['FilterPublishTime'] ?>';
		var titleFilterActivityStartTime='<?php echo $lang['FilterActivityStartTime'] ?>';
		var titleFilterUser='<?php echo $lang['FilterUser'] ?>';
		var titleFilterActivityName='<?php echo $lang['train_name']?>';
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
<script src="./com/sortdatagrid/js/jquery.js" type="text/javascript"></script>
<script src="./com/sortdatagrid/js/grid.locale-zw.js" type="text/javascript"></script>
<script src="./com/sortdatagrid/js/jquery.jqGrid.min.js" type="text/javascript"></script>
<script src="./com/sortdatagrid/js/jquery-ui-custom.min.js" type="text/javascript"></script>
<script src="./common/lib/js/datetime.js"></script>
<script src="./js/control_data_1.js" type="text/javascript"></script>

</head>
<body topmargin="0" leftmargin="0">
<table id="list"><tr><td></td><tr></table>
<div id="pager"></div>
</body>

<style>
/* 不太確定他這裡為何要覆蓋，先這樣吧 */
.ui-jqgrid .ui-pg-input{height:18px}
</style>

</html>
