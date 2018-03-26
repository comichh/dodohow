<?php 
   include_once '../config/head.php';
?>
<html lang="en">
  <head>
    <?php include_once $includePath.'/MetaDescription.php' ?>
	<?php include_once $includePath.'/HeaderCSS.php' ?>
    <?php include_once $includePath.'/StyleCSS.php' ?>
	
	<!------------- 系統函式庫 ------------->
	<script src="../jquery/ui/bootstrap-2.3.2/docs/assets/js/jquery.js"></script>
	<script src="../lib/chart/highcharts.js"></script>
    <script src="../lib/chart/modules/exporting.js"></script>
	<!--------------------------------------->
	
	<!----- user 定義與引用的函式庫 ---------->
	<script src="./common/lib/js/NavMenubar.js"></script>
	<script src="./common/lib/js/ServerRequest.js"></script>
	<script src="./js/jquery.msgPlay.min.js"></script>
	<script src="./js/explore.js"></script>
	<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
    <!---------------------------------------->	
	
	<!-- fix Google map error --> 
	<style>
		#map-canvas {
			margin: 0px;
			padding: 0px;
		}
		#mapCanvas label { width: auto; display:inline; }
		#mapCanvas img { max-width: none; }
		
		.gm-style img {
			max-width: none;
		}

		.gm-style label {
			width: auto; display:inline;
		}
		
		.modal-backdrop {
			background: none;
		}
		
		.modal {
		  width: 80%; /* desired relative width */
		  left: 10%; /* (100%-width)/2 */
		  /* place center */
		  margin-left:auto;
		  margin-right:auto; 
		}
    </style>
</head>

<body>


    <!-- Part 1: Wrap all page content here -->
    <div id="wrap">

      <!-- Fixed navbar -->
     <?php include_once $includePath.'/NavigationBar.php';?>
       
      <!-- Begin page content -->
      <div class="container" style="width:80%">
        <div class="page-header">
         
        </div>
        <div class="bs-docs-example">
            <ul id="myTab" class="nav nav-tabs">
              <li id="MyProfile" class="active"><a href="#MapType" data-toggle="tab">依地理位置顯示</a></li>
              <li id="GetBodyStatu"><a href="#GroupType" data-toggle="tab">依活動種類顯示</a></li>
            </ul>
            <div id="myTabContent" class="tab-content" style="border:1px;min-height:600px;">
			  <div class="tab-pane fade in active" id="MapType" style="position:relative;left:20px;width:98%;">
				<table width="100%">
					<tr>
						<td width="70%">
							<div id="map-canvas" style="width:100%;height:400px;border:1px #cecece solid;"></div>
						</td>
						<td width="30%" valign="top">
							<div id="activitys"></div>
						</td>
					</tr>
				</table>
			  </div>
			  <div class="tab-pane fade" id="GroupType" style="position:relative;width:100%;">
				<div class="alert alert-info">
					<strong>騎車自由行</strong><span id="displayswitch" style="position:relative;left:20px;cursor:pointer" align="right" class="badge badge-info">顯示更多...</span>
				</div>
				<ul class="thumbnails">
					<li class="span3">
						<div class="thumbnail">
						  <img data-src="holder.js/160x120" src='./images/trip/2.jpg' alt="">
						  <h3>貓空騎景</h3>
						</div>
					</li>
					<li class="span3">
						<div class="thumbnail">
						  <img data-src="holder.js/160x120" src='./images/trip/3.jpg' alt="">
						  <h3>彰化鐵馬道自由行</h3>
						</div>
					</li>
					<li class="span3">
						<div class="thumbnail">
						  <img data-src="holder.js/160x120" src='./images/trip/4.jpg' alt="">
						  <h3>坪林茶葉自由行</h3>
						</div>
					</li>
					<li id="trip4" class="span3" style="display:none">
						<div class="thumbnail">
						  <img data-src="holder.js/160x120" src='./images/trip/5.jpg' alt="">
						  <h3>武陵農場櫻花祭</h3>
						</div>
					</li>
					<li id="trip5" class="span3" style="display:none">
						<div class="thumbnail">
						  <img data-src="holder.js/160x120" src='./images/trip/6.jpg' alt="">
						  <h3>花海騎車自由行</h3>
						</div>
					</li>
				</ul>
				<div class="alert alert-info">
					<strong>體能自我挑戰(有心血管疾病者不宜)</strong>
				</div>
				<ul class="thumbnails">
					<li class="span3">
						<div class="thumbnail">
						  <img data-src="holder.js/200x180" src='./images/trip/7.jpg' alt="">
						  <h3>勇闖皇帝殿</h3>
						</div>
					</li>
					<li class="span3">
						<div class="thumbnail">
						  <img data-src="holder.js/200x180" src='./images/trip/8.jpg' alt="">
						  <h3>跨年小鐵人三項</h3>
						</div>
					</li>
					<li class="span3">
						<div class="thumbnail">
						  <img data-src="holder.js/200x180" src='./images/trip/9.jpg' alt="">
						  <h3>征服雪山</h3>
						</div>
					</li>
				</ul>
				<p>Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui.</p>
			  </div>
			  			
          </div>
		</div>
		<div id="myModal" class="modal hide">
		  <div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
			<h3><div id="TrainName"></div></h3>
		  </div>
		  <div class="modal-body">
			<p></p>
			<div id="map-canvas2" style="display:none;width:50%;height:380px;border:1px #cecece solid;"></div>
		  </div>
		  <div class="modal-footer">
			<a href="#" class="btn btn-primary">加入我的最愛</a>
		  </div>
		</div>
		<!-- Footer -->
		<?php include_once $includePath.'/Footer.php';?>
    </div>
	
	<!-- javascript librarys -->
	<?php include_once $includePath.'/LibraryScript.php';?>
  </body>
</html>
