<?php
	$tripID=$_GET['train_data_key'];
	$deviceID=$_GET['deviceID'];
	
	include_once 'profile.php';
	include_once ServerHeadPath;
	include_once LoadLauguage;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>My First Grid</title>

<link href="./com/data_table/css/jquery-ui-1.8.2.custom.css" rel="stylesheet" type="text/css" media="screen">
<link href="./com/data_table/css/ui.jqgrid.css" rel="stylesheet" type="text/css" media="screen">
<link href="./com/data_table/css/ui.multiselect.css" rel="stylesheet" type="text/css" media="screen">     
<STYLE type="text">
html, body {
	margin:5px;			/* Remove body margin/padding */
	padding:0px;
	overflow: hidden;	/* Remove scroll bars on browser window */
}
</STYLE>

<script src="./com/data_table/js/jquery.js" type="text/javascript"></script>
<script src="./com/data_table/js/grid.locale-zw.js" type="text/javascript"></script>
<script src="./com/data_table/js/jquery.jqGrid.min.js" type="text/javascript"></script>
<script src="./com/data_table/js/jquery-ui-custom.min.js" type="text/javascript"></script>
<script src="../lib/chart/highcharts.js"></script>
<script src="../lib/chart/modules/exporting.js"></script>
<script src="./common/lib/js/datetime.js"></script>
<script type="text/javascript" src="./common/lib/js/Number.js"></script>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
<script type="text/javascript">
var tripID=<?php echo $tripID ?>;
var deviceID='<?php echo $deviceID ?>';
var titleCalory='<?php echo $Calory ?>';
var titleMaxSpeed='<?php echo $MaxSpeed ?>';
var titleAdvSpeed='<?php echo $AdvSpeed ?>';
var titleMaxHeartbit='<?php echo $MaxHeartbit ?>';
var titleAdvHeartbit='<?php echo $AdvHeartbit ?>';
var titleMaxHeight='<?php echo $MaxHeight ?>';
var titleMinHeight='<?php echo $MinHeight ?>';
var titleBestCadns='<?php echo $BestCadns ?>';
var titleAdvCadns='<?php echo $AdvCadns ?>';
var titleMaxPower='<?php echo $MaxPower ?>';
var titleAdvPower='<?php echo $AdvPower ?>';
var titleAscentHeight='<?php echo $AscentHeight ?>';
var titleDescentHeight='<?php echo $deviceID ?>';
var titleLaps='<?php echo $Laps ?>';
var titleLapEach='<?php echo $LapEach ?>';
var titleLapStartTime='<?php echo $LapStartTime ?>';
var titleLapDurtion='<?php echo $LapDurtion ?>';
var titleLapDistance='<?php echo $LapDistance ?>';
</script>
<script src="./js/SportLapData.js" type="text/javascript"></script>
</head>
<body topmargin="0" leftmargin="0">
<table>
	<tr>
		<td>
			<table id="list" width="100%"><tr><td></td><tr></table>
			<div id="pager"></div>
		</td>
		<td>
			<div style="height:20px"><img id="LapDataLoading" src="./images/loading.gif" style="position:relative;display:none;left:10px"></div>
			<div id="AxisGroup" class="btn-group" data-toggle="buttons-radio" style="position:relative;left:20px;">
				<button type="button" class="btn btn-info" onclick="showSelectID(1)"><?php echo $Calory ?></button>
				<button type="button" class="btn btn-info" onclick="showSelectID(2)"><?php echo $MaxSpeed ?></button>
				<button type="button" class="btn btn-info" onclick="showSelectID(3)"><?php echo $AdvHeartbit ?></button>
				<button type="button" class="btn btn-info" onclick="showSelectID(4)"><?php echo $AdvHeartbit ?></button>
				<button type="button" class="btn btn-info" onclick="showSelectID(5)"><?php echo $MaxHeartbit ?></button>
				<button type="button" class="btn btn-info" onclick="showSelectID(6)"><?php echo $BestCadns ?></button>
				<button type="button" class="btn btn-info" onclick="showSelectID(7)"><?php echo $AdvPower ?></button>
				<button type="button" class="btn btn-info" onclick="showSelectID(8)"><?php echo $MaxPower ?></button>
			</div>
			<div id="container" style="min-width: 310px; height: 300px; margin: 0 auto"></div>
		</td>
	</tr>
</table>	
</body>
</html>
