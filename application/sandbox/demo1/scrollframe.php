<?php
  include ("../../../config/web.ini");
  include ("../../../auth.php");
  include ("../../../config/mysql.php");
  include ("../../../config/lang_select.php");
  include ("$work_path/function/slope_difficulty.php");

	$queryMode=$_GET["SearchMode"];
	$sportType=$_GET["type"];
  $slope_diff=$_GET["slope_diff"];

  $lat=$_GET["lat"];
  $lng=$_GET["lng"];

  $sortType=$_GET["sortType"];
  $findUserName=$_GET["findUserName"];
  $findkeyword=$_GET["keyword"];
	$startDate=$_GET["startDate"];
	$endDate=$_GET["endDate"];
	$photo=$_GET["photo"];
	$distanceRangeStart=$_GET["distanceRangeStart"];
	$distanceRangeEnd=$_GET["distanceRangeEnd"];
	$timeRange=$_GET["timeRange"];

	switch($queryMode){
		case 1:
			$requestPageURL.='./lib/GetShareBoundaryActivity.php?runType='.$sportType;
      $requestPageURL.="&lat=$lat&lng=$lng";
			break;
		case 2:
			$requestPageURL='./lib/GetShareActivityByFilter.php?runType='.$sportType
				.'&sortType='.$sortType.'&findUserName='.$findUserName
				."&findkeyword=".$findkeyword."&startDate=".$startDate
				."&endDate=".$endDate."&photoExist=".$photo."&distanceRangeStart="
				.$distanceRangeStart."&distanceRangeEnd=".$distanceRangeEnd."&timeRange=".$timeRange
        ."&lat=".$lat."&lng=".$lng."&slope_diff=".$slope_diff;
			break;
		case 3:
  
			$requestPageURL="./lib/GetShareActivityByFilter.php?runType="
				.$sportType."&findUserName=".$findUserName."&findkeyword="
				.$findkeyword."&startDate=".$startDate.'&endDate='.$endDate.'&photoExist='
				.$photo."&distanceRangeStart=".$distanceRangeStart."&distanceRangeEnd="
				.$distanceRangeEnd."&timeRange=".$timeRange
        ."&lat=$lat&lng=$lng"."&slope_diff=".$slope_diff;
   
			break;
	 	 default:
			$requestPageURL='./lib/GetShareActivity.php?runType='.$sportType;
		break;
	}
?>
<html>
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8">
		<title></title>
		<link rel="stylesheet" href="css/basic.css" type="text/css" />
		<link rel="stylesheet" href="css/galleriffic-5.css" type="text/css" />
		<link rel="stylesheet" href="css/black.css" type="text/css" />
    <style>
         img{ display: inline;} 
         #down_table{
            background-image:url(../../../pic/share_map/down_background_1.png);
            -moz-background-size:148px 130px;
            -webkit-background-size:148px 130px;
            -o-background-size:148px 130px;
            background-size:148px 130px;
            margin-top:-15px;color:white;width:148px;height:130px;position:relative
          }
    </style>
    <!-- 這邊版本被我修正過 -->   
		<script type="text/javascript" src="js/jquery-1.8.3.js"></script>
		<script type="text/javascript" src="js/jquery.history.js"></script>
		<script type="text/javascript" src="js/jquery.galleriffic.js"></script>
		<script type="text/javascript" src="js/jquery.opacityrollover.js"></script>
		<script type="text/javascript" src="js/datetime.js"></script>
		<script type="text/javascript">
			var titleSectionsDifficulty='<?php echo $SectionsDifficulty ?>';
      var portHistory_errer_2='<?php echo $lang['portHistory_errer_2'] ?>';
		</script>
		<script type="text/javascript">
			document.write('<style>.noscript { display: none; }</style>');
			var urlPage='<?php echo $requestPageURL ?>';
			function getShareActivity(){
				$.ajax({
					url:urlPage,
					type:"GET",
					contentType:"application/json;charset=utf-8",
					success: function(Jdata){       
						jsonArray=eval('('+Jdata+')');
						parent.result=jsonArray;
						var response='';
						var dataLength=jsonArray.length;
						parent.putActivityOnMap();
						if(dataLength>0){
							for(var i=0;i<jsonArray.length;i++){
								response+=buildSingleUser(jsonArray[i],i);		// 這邊			
							}
							$('#DisplayTable').html(response);
							startRun();
						}else{        
               alert (portHistory_errer_2);						
						}
					},
					error: function() {				
						$('#Startloading').hide();
					}			
				});
			}
			
			function getSportTypeImgURL(id){
				switch(parseInt(id)){
					case 1:
						return 'run.png'; 
						break;
					case 2:
						return 'bike.png'; 
						break;
				}
			}
			// 進來的時候，下面那個頭像輪播
			function buildSingleUser(singleData,index){
				var strHtml='';
				var sportTypeImg=getSportTypeImgURL(singleData.SportType);
				var pdate=singleData.StartTime.split(" ");
				var dateArray=pdate[0].split("-");
				var dateStr=dateArray[0]+"/"+dateArray[1]+"/"+dateArray[2];
				var kmValue=parseFloat(singleData.lTotalDistance)/1000;
				kmValue=Math.round(kmValue*100)/100;
				var sportTime=calHrAndMinWithSecond(parseFloat(singleData.lTotalTime)/10);
        var slope_pic=singleData.slope_pic;
		    var innerHTML="<div id='down_table' onclick='selectUser("+index+")'>"+
        "<div style='position:absolute;left:10px;top:0px;z-index:100;'>"+ singleData.fullname+"</div>"+
        "<br>"+
        "<img style='position:absolute;left:10px;top:20px;z-index:100;max-height:40px;' src='"+singleData.image+"'>"+        
        "<img style='position:absolute;left:100px;top:20px;z-index:100;width:40px;height:40px' src='./images/"+sportTypeImg+"'>"+
        "<div style='position:absolute;left:10px;top:65px;z-index:100; '>"+dateStr+"</div>"+
        "<div style='position:absolute;left:10px;top:80px;z-index:100;'>"+kmValue+" km in "+sportTime+"</div>"+       
        "<div style='position:absolute;left:10px;top:100px;z-index:100;'>"+slope_pic+"</div>"+                    
			  "</div>";
        // 下面這段不能動，會出錯，理由不明。他需要放一張奇怪的圖片
				strHtml+='<li>';
				strHtml+='<a class="thumb" href="http://farm4.static.flickr.com/3261/2538183196_8baf9a8015.jpg" title="Title #0">';
				strHtml+=innerHTML;
				strHtml+='</a>';
				strHtml+='</li>';
				return strHtml;
			}
			
			function selectUser(index){
				parent.selectRecord(index);
			}
			
			function selectActivity(index){
        //console.log (index);
				gallery.gotoIndex(index)
			}
			
			function startRun(){
				// We only want these styles applied when javascript is enabled
				$('div.content').css('display', 'block');

				// Initially set opacity on thumbs and add
				// additional styling for hover effect on thumbs
				var onMouseOutOpacity = 0.67;
				$('#thumbs ul.thumbs li, div.navigation a.pageLink').opacityrollover({
					mouseOutOpacity:   onMouseOutOpacity,
					mouseOverOpacity:  1.0,
					fadeSpeed:         'fast',
					exemptionSelector: '.selected'
				});
				var viewWidth=$("#container").css('width').replace("px","");
				//var numThumbCount=parseInt(viewWidth/90);
				// Initialize Advanced Galleriffic Gallery
				var gallery = $('#thumbs').galleriffic({
					delay:                     12000,                  // 調大
					numThumbs:                 5,
					preloadAhead:              5,
					enableTopPager:            false,
					enableBottomPager:         false,
					imageContainerSel:         '#slideshow',
					controlsContainerSel:      '#controls',
					captionContainerSel:       '#caption',
					loadingContainerSel:       '#loading',
					renderSSControls:          true,
					renderNavControls:         true,
					playLinkText:              'Play Slideshow',
					pauseLinkText:             'Pause Slideshow',
					prevLinkText:              '&lsaquo; Previous Photo',
					nextLinkText:              'Next Photo &rsaquo;',
					nextPageLinkText:          'Next &rsaquo;',
					prevPageLinkText:          '&lsaquo; Prev',
					enableHistory:             true,
					autoStart:                 false,
					syncTransitions:           true,
					defaultTransitionDuration: 900,
					onSlideChange:             function(prevIndex, nextIndex) {
						// 'this' refers to the gallery, which is an extension of $('#thumbs')
						this.find('ul.thumbs').children()
							.eq(prevIndex).fadeTo('fast', onMouseOutOpacity).end()
							.eq(nextIndex).fadeTo('fast', 1.0);
						// Update the photo index display
						this.$captionContainer.find('div.photo-index')
							.html('Photo '+ (nextIndex+1) +' of '+ this.data.length);
					},
					onPageTransitionOut:       function(callback) {
						this.fadeTo('fast', 0.0, callback);
					},
					onPageTransitionIn:        function() {
						var prevPageLink = this.find('a.prev').css('visibility', 'hidden');
						var nextPageLink = this.find('a.next').css('visibility', 'hidden');
						
						// Show appropriate next / prev page links
						if (this.displayedPage > 0)
							prevPageLink.css('visibility', 'visible');

						var lastPage = this.getNumPages() - 1;
						if (this.displayedPage < lastPage)
							nextPageLink.css('visibility', 'visible');

						this.fadeTo('fast', 1.0);
					}
				});

				/**************** Event handlers for custom next / prev page links **********************/

				gallery.find('a.prev').click(function(e) {
					gallery.previousPage();
					e.preventDefault();
				});

				gallery.find('a.next').click(function(e) {
					gallery.nextPage();
					e.preventDefault();
				});

				/****************************************************************************************/

				/**** Functions to support integration of galleriffic with the jquery.history plugin ****/

				// PageLoad function
				// This function is called when:
				// 1. after calling $.historyInit();
				// 2. after calling $.historyLoad();
				// 3. after pushing "Go Back" button of a browser
				function pageload(hash) {
					// alert("pageload: " + hash);
					// hash doesn't contain the first # character.
					if(hash) {
						$.galleriffic.gotoImage(hash);
					} else {
						gallery.gotoIndex(0);
					}
				}

				// Initialize history plugin.
				// The callback is called at once by present location.hash. 
				$.historyInit(pageload, "advanced.html");

				// set onlick event for buttons using the jQuery 1.3 live method
				$("a[rel='history']").live('click', function(e) {
					if (e.button != 0) return true;

					var hash = this.href;
					hash = hash.replace(/^.*#/, '');

					// moves to a new page. 
					// pageload is called at once. 
					// hash don't contain "#", "?"
					$.historyLoad(hash);

					return false;
				});
				$('#StartPlay').trigger('click');
				/****************************************************************************************/
			}
			getShareActivity();

		</script>
	</head>
	<body>
		<div style="position:absolute;left:10px;top:20px">
			<div  style="cursor:pointer"><img style='height:51px' id='deep_button' src="../../../pic/social_map/ICON_Search_1.png" onclick="parent.switchDeepSearch()" /></div>
			<p></p>
			<div style="cursor:pointer"><img style='height:51px' src="../../../pic/social_map/ICON_Sort_1.png" onclick="parent.switchSort()" /></div>
		</div>
		<div id="page" style='background:#c9caca'>
		    <div id="container">
				<!-- Start Advanced Gallery Html Containers -->				
				<div class="navigation-container">
					<div id="thumbs" class="navigation">
						<a class="pageLink prev" style="visibility: hidden; " href="#" title="Previous Page"></a>
						<ul class="thumbs noscript" id="DisplayTable"></ul>
						<a class="pageLink next" style="visibility: hidden;   " href="#" title="Next Page"></a>
					</div>
				</div>
				<div class="content">
					<div class="slideshow-container">
						<div id="controls" class="controls" style="display:none"></div>
						<div id="loading" class="loader"></div>
						<div id="slideshow" class="slideshow" style="display:none"></div>
					</div>
					<div id="caption" class="caption-container" style="display:none">
						<div class="photo-index"></div>
					</div>
				</div>
				<!-- End Gallery Html Containers -->
				<div style="clear: both;"></div>
			</div>
		</div>
	</body>
</html>
