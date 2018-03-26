var map;
var result;
var previousID=-1;
var moveMarker;
var jumpMarker;
var ActiveMapMarker=[];
var ib = new InfoBox();
var sites=[]
var geocoder;
var disEvVal;
var initLat=25.132397;
var initLng=121.644;
var map2;
var shareMarker;

$(function(){
	if(showAlert===1){
		alert("建議最佳效果，請使用IE最新版本(IE Ver.11以上");
	}
	
	$( "#datetimepicker1" ).datetimepicker( "setDate",'').on( "changeDate", function(ev) {
		$( "#datetimepicker1" ).datetimepicker( "hide" );
	});
	
	$('#TotalDistanceSlider').slider({
		min:0,
		max:200,
		value:[0,200]
	});
	$('#DistanceValue').html('0km<->200km');
	$('#TotalDistanceSlider').slider().on('slideStop', function(ev){
		
	});
	$('#TotalDistanceSlider').slider().on('slide', function(ev){
		var valArray=(ev.value+'').split(',');
		disEvVal=ev.value;
		$('#DistanceValue').html(valArray[0]+'km<->'+valArray[1]+'km');
	});
	
	$( "#datetimepicker2" ).datetimepicker( "setDate",'').on( "changeDate", function(ev) {
		$( "#datetimepicker2" ).datetimepicker( "hide" );
	});
	
	$('#TotalTimeSlider').slider({
		min:0,
		max:86400,
		value:86400
	});
	$('#TimeValue').html(fillzerowithValue(24)+":"+fillzerowithValue(0)+":"+fillzerowithValue(0));	
	$('#TotalTimeSlider').slider().on('slideStop', function(ev){
		
	});
	$('#TotalTimeSlider').slider().on('slide', function(ev){
		var hrMins=parseFloat(parseInt(ev.value)/3600);
		var hr=parseInt(hrMins);
		var trueMinute=(hrMins-hr)*60;
		var minute=parseInt(trueMinute);
		var second=parseInt((trueMinute-minute)*60);	
		$('#TimeValue').html(fillzerowithValue(hr)+":"+fillzerowithValue(minute)+":"+fillzerowithValue(second));
	});
	
	$('#reSort').click(function(){
		var selectSortValue=$('input[name=SortType]:checked').val();
		var getDistanceRange=$('#TotalDistanceSlider').data('slider').getValue();
		var getTimeRange=$('#TotalTimeSlider').data('slider').getValue();
		var userName=$('#SearchByName').val().trim();
		var searchRunType=$('#SportType').val().trim();
		var searchByKeywordVal=$('#SearchByKeyword').val().trim();
		var selectPhotoExistValue=$('input[name=PhotoExist]:checked').val();
		var startDate=$('#date_start').val();
		var endDate=$('#date_end').val();
		var NorthEastLat=map.getBounds().getNorthEast().lat();
		var NorthEastLng=map.getBounds().getNorthEast().lng();
		var SouthWestLat=map.getBounds().getSouthWest().lat();
		var SouthWestLng=map.getBounds().getSouthWest().lng();
		$('#ScrollFrame').attr('src',"scrollframe.php?SearchMode=2&type="+searchRunType+"&sortType="+selectSortValue
				+"&findUserName="+userName+"&timeRange="+getTimeRange+"&distanceRangeStart="+getDistanceRange[0]
				+"&distanceRangeEnd="+getDistanceRange[1]+"&keyword="+searchByKeywordVal+"&startDate="+startDate
				+"&endDate="+endDate+"&photo="+selectPhotoExistValue
				+"&NE_Lat="+NorthEastLat+"&NE_Lng="+NorthEastLng+"&SW_Lat="+SouthWestLat+"&SW_Lng="+SouthWestLng);
		$('#SortCollection').hide();
	});
	
	$('#FindByFilter').click(function(){
		var getDistanceRange=$('#TotalDistanceSlider').data('slider').getValue();
		var getTimeRange=$('#TotalTimeSlider').data('slider').getValue();
		var userName=$('#SearchByName').val().trim();
		var searchRunType=$('#SportType').val().trim();
		var searchByKeywordVal=$('#SearchByKeyword').val().trim();
		var startDate=$('#date_start').val();
		var endDate=$('#date_end').val();
		var selectPhotoExistValue=$('input[name=PhotoExist]:checked').val();
		var NorthEastLat=map.getBounds().getNorthEast().lat();
		var NorthEastLng=map.getBounds().getNorthEast().lng();
		var SouthWestLat=map.getBounds().getSouthWest().lat();
		var SouthWestLng=map.getBounds().getSouthWest().lng();
		$('#ScrollFrame').attr('src',"scrollframe.php?SearchMode=3&type="
				+searchRunType+"&findUserName="+userName+"&timeRange="+getTimeRange+"&distanceRangeStart="
				+getDistanceRange[0]+"&distanceRangeEnd="+getDistanceRange[1]+"&keyword="+searchByKeywordVal
				+"&startDate="+startDate+"&endDate="+endDate+"&photo="+selectPhotoExistValue
				+"&NE_Lat="+NorthEastLat+"&NE_Lng="+NorthEastLng+"&SW_Lat="+SouthWestLat+"&SW_Lng="+SouthWestLng);
		$('#DeepSearch').hide();
		advenceSearch();
		runType=searchRunType;
	});
	
	var leftStart=parseInt((getBrowserWidth()-1280)/2)+96;
	$('#DeepSearch').css('left',leftStart+"px");
	$('#SortCollection').css('left',leftStart+"px");
	$('#WrapperTableContet').css('height',getBrowserHeight()+"px");
	
	$('#container').highcharts({
		chart: {
			zoomType: 'xy',
			events: {
			selection: function(event) {
					if (event.xAxis) {
						/*
						var flightPlanCoordinates=[];
						var bounds = new google.maps.LatLngBounds();
						var minPoint=parseInt(event.xAxis[0].min);
						var maxPoint=parseInt(event.xAxis[0].max);
						for(var index=minPoint;minPoint<maxPoint;minPoint++){
							//flightPlanCoordinates.push(new google.maps.LatLng(parseFloat(detailObj[index].latitude), parseFloat(detailObj[index].longitude)));
							bounds.extend(new google.maps.LatLng(parseFloat(detailObj[index].latitude), parseFloat(detailObj[index].longitude)));
							map.fitBounds(bounds);
						}
						*/
					} else {
						//map.fitBounds(totalBound);
					}
				}
			}
		},
		title: {
			text: 'sport4u.pro'
		},
		subtitle: {
			text: 'Source: sport4u sport for you'
		},
		 xAxis: {
			categories: [],
			labels: {
				format: '{value} km'
			},
			tickInterval: 200,
		},
		yAxis: [{ // Primary yAxis
			min:0,
			labels: {
				format: '{value} bits',
				style: {
					color: '#FF6347'
				}
			},
			title: {
				text: titleChartTitleHeartbit,
				style: {
					color: '#FF6347'
				}
			}
		}, { // Secondary yAxis
			min:0,
			title: {
				text: titleChartTitleSpeed,
				style: {
					color: '#4572A7'
				}
			},
			labels: {
				format: '{value} km/hr',
				style: {
					color: '#4572A7'
				}
			},
			opposite: true
		},{ // Secondary yAxis
			min:0,
			max:1000,
			title: {
				text: titleChartTitleHeight,
				style: {
					color: '#548B54'
				}
			},
			labels: {
				format: '{value} m',
				style: {
					color: '#548B54'
				}
			},
			opposite: true
		}],
		tooltip: {
			crosshairs: true,
			shared: true,
			
			
			formatter: function() {
				var xAxisindex=this.points[0].point.x;
				var tipstr='<font size="1">'+detailObj[xAxisindex].start_time+'</font><br>';
				tipstr+='<font size="1" style="color:#FF6347">'+titleChartTitleHeartbit+':'+detailObj[xAxisindex].heart_rate+'</font><br>';
				tipstr+='<font size="1" style="color:#4572A7">'+titleChartTitleSpeed+':'+detailObj[xAxisindex].speed+' '+detailObj[xAxisindex].speedMeter+'</font><br>';
				tipstr+='<font size="1" style="color:#548B54">'+titleChartTitleHeight+':'+detailObj[xAxisindex].altitude+' m</font><br>';
				tipstr+='<font size="1">'+titleChartTitleCadnst+':'+detailObj[xAxisindex].cadence+'</font><br>';
				return tipstr;
				/*
				alert();
				$.each(this.points, function(i, point) {
					alert(point.series.name +':'+i);
				});
				*/
				
			}
			
		},series: [{
			name: titleChartTitleHeartbit,
			color: '#FF6347',
			type: 'spline',
			marker: {
				enabled: false
			},
			data: [],
			tooltip: {
				valueSuffix: '°C'
			}
		},{
			name: titleChartTitleSpeed,
			color: '#4572A7',
			type: 'spline',
			marker: {
				enabled: false
			},
			yAxis: 1,
			data: [],
			tooltip: {
				valueSuffix: ' bits'
			}

		},{
			name: titleChartTitleHeight,
			color: '#548B54',
			type: 'spline',
			marker: {
				enabled: false
			},
			yAxis: 2,
			data: [],
			tooltip: {
				valueSuffix: ' m'
			}

		}],
		plotOptions: {
			spline: {
				lineWidth: 2,
				states: {
					hover: {
						lineWidth: 2
					}
				},
				marker: {
					radius: 4,
					lineColor: '#666666',
					lineWidth: 1,
					enabled: false
				}
			
			},
			series: {
					allowPointSelect: true,
					point: {
						events: {
							mouseOver: function() {
								var latLng=new google.maps.LatLng(parseFloat(detailObj[this.x].latitude), parseFloat(detailObj[this.x].longitude));
								shareMarker.setPosition(latLng);
								checkBounds(latLng);
							},
							select: function() {
								var latLng=new google.maps.LatLng(parseFloat(detailObj[this.x].latitude), parseFloat(detailObj[this.x].longitude));
								map2.setCenter(latLng);
								map2.setZoom(17);
							},
							unselect:function(){
								
							}
						}
					}
			}
		}
    });
	
	//$('#ScrollFrame').attr('src',"scrollframe.php?type=0");

});

function formOnload(){
	var getDistanceRange=$('#TotalDistanceSlider').data('slider').getValue();
	var getTimeRange=$('#TotalTimeSlider').data('slider').getValue();
	var userName=$('#SearchByName').val().trim();
	var searchRunType=$('#SportType').val().trim();
	var searchByKeywordVal=$('#SearchByKeyword').val().trim();
	var startDate=$('#date_start').val();
	var endDate=$('#date_end').val();
	var selectPhotoExistValue=$('input[name=PhotoExist]:checked').val();
	var NorthEastLat=map.getBounds().getNorthEast().lat();
	var NorthEastLng=map.getBounds().getNorthEast().lng();
	var SouthWestLat=map.getBounds().getSouthWest().lat();
	var SouthWestLng=map.getBounds().getSouthWest().lng();
	$('#ScrollFrame').attr('src',"scrollframe.php?SearchMode=3&type="
			+searchRunType+"&findUserName="+userName+"&timeRange="+getTimeRange+"&distanceRangeStart="
			+getDistanceRange[0]+"&distanceRangeEnd="+getDistanceRange[1]+"&keyword="+searchByKeywordVal
			+"&startDate="+startDate+"&endDate="+endDate+"&photo="+selectPhotoExistValue
			+"&NE_Lat="+NorthEastLat+"&NE_Lng="+NorthEastLng+"&SW_Lat="+SouthWestLat+"&SW_Lng="+SouthWestLng);
}

function resetButtonBackground(){
	$('#showRunningRecord').attr('src',"./images/tab_Running_out.png");
	$('#showCycleRecord').attr('src',"./images/tab_Cycling_out.png");
}

//取得瀏覽器視窗寬度
function getBrowserWidth() {
	if ($.browser.msie) {
		return document.compatMode =="CSS1Compat"?document.documentElement.clientWidth:document.body.clientWidth;
	} else {
		return self.innerWidth;
	}
} 

function getBrowserHeight() {
	if ($.browser.msie) {
		return document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight :
				 document.body.clientHeight;
	} else {
		return self.innerHeight;
	}
}

function resetButtonBackgroundRunning(){
	resetButtonBackground()
	$('#showRunningRecord').attr('src',"./images/tab_Running_over.png");
	$('#ScrollFrame').attr('src',"scrollframe.php?SearchMode=0&type=1");
	$('#SportType').val("1");
	runType="1";
}

function resetButtonBackgroundCycle(){
	resetButtonBackground();
	$('#showCycleRecord').attr('src',"./images/tab_Cycling_over.png");
	$('#ScrollFrame').attr('src',"scrollframe.php?SearchMode=0&type=2");
	$('#SportType').val("2");
	runType="2";
}



function switchDeepSearch(){
	if($('#DeepSearch').is(':visible')){
		$('#DeepSearch').hide();
	}else{
		if($('#SortCollection').is(':visible')){
			$('#SortCollection').hide();
		}
		$('#DeepSearch').show();
	}
}

function switchSort(){
	if($('#SortCollection').is(':visible')){
		$('#SortCollection').hide();
	}else{
		if($('#DeepSearch').is(':visible')){
			$('#DeepSearch').hide();
		}
		$('#SortCollection').show();
	}
}

function advenceSearch(){
	switch($('#SportType').val().trim()){
		case "0":
			resetButtonBackground();
			break;
		case "1":
			resetButtonBackground();
			$('#showRunningRecord').attr('src',"./images/tab_Running_over.png");
			break;
		case "2":
			resetButtonBackground();
			$('#showCycleRecord').attr('src',"./images/tab_Cycling_over.png");
			break;
	}
}

function initialize(lat,lng) {
	var mapOptions = {
		zoom: 8,
		center: new google.maps.LatLng(parseFloat(lat),parseFloat(lng)),
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
	map2 = new google.maps.Map(document.getElementById('map-canvas2'), mapOptions);
	map.setCenter(new google.maps.LatLng(parseFloat(lat),parseFloat(lng)));
	google.maps.event.addListener(map, "click", function() {
		ib.close();
	});
	
	google.maps.event.addListener(map, "dragend", function() {
		refreshScroll();
	});
	
	infowindow = new google.maps.InfoWindow({
		content: "loading..."
	});
	
	geocoder = new google.maps.Geocoder();
	shareMarker = new google.maps.Marker({
		map:map2,
		icon:'./images/Active_Marker.png'
	}); 
}

function putActivityOnMap(){
	var len=result.length;
	var singleData=[];
	var zIndex=0;
	clearAllMarker();
	var targethtml="";
	var sportTypeImage="";

	
	for(var i=0;i<len;i++){
		singleData=[];
		sportTypeImage=getSportTypeImgURL(result[i].SportType);
		singleData.push(result[i].fullname);
		singleData.push(parseFloat(result[i].start_lat));
		singleData.push(parseFloat(result[i].start_lng));
		singleData.push(0);
		if(result[i].train_name!=""){
			if(result[i].train_name.length>13){
				trainName=result[i].train_name.substr(1,12)+'...';	
			}else{
				trainName=result[i].train_name;
			}
		}else{
			trainName="&nbsp;"
		}
		targethtml='<font style="position:relative;left:10px;font-style:italic;font-size:18px;color:#CD6600;font-weight:900;">'+result[i].fullname+'</font>';
		targethtml+='<div style="position:relative;top:-6px">';
		targethtml+='<table border=0 width="98%" cellspacing=0 cellpadding=0>';
		targethtml+='	<tr><td width="30%"><div style="height:60px;position:relative;left:5px"><img style="max-height:60px" src="'+result[i].image+'" width="60"></div></td><td><div style="font-size:12px;color:#262626;font-weight:900">'+ titleCumulativeTime+':'+getSportTime(result[i].AccTime)+'</div><div style="color:#262626;font-size:12px;font-weight:900">'+titleCumulativeDistance+':'+getDistanceKmValue(result[i].AccDistance)+' km</div><div style="color:#262626;font-size:12px;font-weight:900">'+titleHighestElevation+':'+result[i].MaxhighestEle+'m</div><div style="color:#262626;font-size:12px;font-weight:900;">'+titleCumulativeAscent+':'+result[i].AccRise+'m</div><div style="position:absolute;left:200px;top:30px"><img src="./images/'+sportTypeImage+'" width="40"></div></td></tr>';
		targethtml+='	<tr><td colspan=2 height=20><div style="float:right"><img src="./images/Medals.png" style="height:30px" /></div><div style="float:right"><img src="./images/Medals.png" style="height:30px" /></div><div style="float:right"><img src="./images/Medals.png" style="height:30px" /></div></td></tr>';
		targethtml+='</table>';
		targethtml+='</div>';
		targethtml+='<div style="width:94%;position:relative;left:4px;top:8px"><table width="100%">'
		targethtml+='	<tr><td colspan="2" style="font-size:14px;color:#ffffff;font-weight:900;">'+trainName+'</td></tr>'
		targethtml+='	<tr><td valign="top"><div style="font-size:12px;color:#ffffff;height:20px">'+titleTotalTime+'：'+getSportTime(result[i].lTotalTime)+'</div><div style="font-size:12px;color:#ffffff;height:20px">'+titleTotalDistance+'：'+getDistanceKmValue(result[i].lTotalDistance)+' km</div><div style="font-size:12px;color:#ffffff;height:20px">'+titleTotalCalory+'：'+result[i].Calory+' cal</div><div style="font-size:12px;color:#ffffff;height:20px">'+titleSectionsDifficulty+'：★★★★★</div></td><td align="right" onclick="getHistoryByAjax('+result[i].id+',\''+result[i].deviceID+'\',\''+result[i].image+'\','+i+')"><img src="'+routeImageBaseUrl+'/'+result[i].id+'.jpg" style="cursor:pointer;border:1px #cecece solid" width="80"></td></tr>'
		targethtml+='	<tr><td valign="top" colspan=2><div style="position:relative;top:10px;color:#ffffff"><table><tr><td><img src="./images/like.png" /></td><td width="20">'+result[i].PraiseCount+'</td><td><img src="./images/message.png" /></td><td width="20">'+result[i].comment_count+'</td><td><img src="./images/Watch.png" /></td><td width="20" id="ViewCnt_'+i+'">'+result[i].ViewCount+'</td><td><img src="./images/Download.png" /></td><td width="16">'+result[i].FavSportList+'</td></tr></table></div></tr>'
		targethtml+='</table></div>';
		targethtml+='<div style="position:absolute;top:288px;left:224px;cursor:pointer;width:30px;height:26px" onclick="getHistoryByAjax('+result[i].id+',\''+result[i].deviceID+'\',\''+result[i].image+'\','+i+')"></div>';
		
		singleData.push(targethtml);
		createMarker(singleData, map,result[i].SportType);
	}
}

function getDistanceKmValue(distanceValue){

	var kmValue=parseFloat(distanceValue)/1000;
	return Math.round(kmValue*100)/100;
	
}

function getSportTime(sportTime){
	return calHrAndMinWithSecond(parseFloat(sportTime)/10);
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

function getImageIconUrl(index){
	switch(parseInt(index)){
		case 1:
			return './images/info.gif';
			break;
		case 2:
			return './images/Green.gif';
			break;
		default:
			return './images/info.gif';
			break;
	}
}

function createMarker(site, map,sportTypeID){
	var siteLatLng = new google.maps.LatLng(site[1], site[2]);
	var sportTypeImageUrl=getImageIconUrl(sportTypeID);
	var marker = new google.maps.Marker({
		position: siteLatLng,
		map: map,
		icon:sportTypeImageUrl,
		title: site[0],
		zIndex: site[3],
		html: site[4] /* ,
		icon: "http://visualartscambridge.org/wp-content/uploads/2013/03/map-pin.png" this icon no longer available */
	});
	var boxText = document.createElement("div");
	boxText.style.cssText = "border-radius:10px;width:250px;height:330px;margin-top: 8px;padding:5px;background:url(./images/big.jpg);background-repeat:no-repeat;";
	boxText.innerHTML = marker.html;

	var myOptions = {
		 content: boxText
		,disableAutoPan: false
		,maxWidth: 0
		,pixelOffset: new google.maps.Size(-140, 0)
		,zIndex: null
		,boxStyle: { 
		  //background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/tags/infobox/1.1.12/examples/tipbox.gif') no-repeat"
		  background: "url(./images/arraw.gif) no-repeat"
		  ,opacity: 0.9
		  ,width: "224px"
		 }
		,closeBoxMargin: "20px -20px 10px 20px"
		,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
		,infoBoxClearance: new google.maps.Size(1, 1)
		,isHidden: false
		,pane: "floatPane"
		,enableEventPropagation: false
	};
	ActiveMapMarker.push(marker);
	google.maps.event.addListener(marker, "click", function (e) {
		 ib.close();
		 ib.setOptions(myOptions);
		 ib.open(map, this);
	});
	return marker;
}

function locateMarker(index){
var train_id=result[index].id;
var train_userid=result[index].userid;
$("#show_vscroll_div").html("<iframe src='Vscrollframe.php?id="+train_id+"&train_userid="+train_userid+"' scrolling='no' allowtransparency='true' style='background-color:#efefef;border:none;height:100%;width:100%;text-align:center;vertical-align:center'></iframe>");


	if(typeof(ActiveMapMarker)!='undefined'){
		if(previousID!==-1){
			ActiveMapMarker[previousID].setIcon(getImageIconUrl(result[previousID].SportType));
			ActiveMapMarker[previousID].setZIndex(0);
		}
		ActiveMapMarker[index].setIcon('./images/Active_Marker.png');
		ActiveMapMarker[index].setZIndex(1000);
		previousID=index;
	}
}



function selectRecord(index){
	var train_id=result[index].id;
	var train_userid=result[index].userid;
	$("#show_vscroll_div").html("<iframe src='Vscrollframe.php?id="+train_id+"&train_userid="+train_userid+"' scrolling='no' allowtransparency='true' style='background-color:#efefef;border:none;height:100%;width:100%;text-align:center;vertical-align:center'></iframe>");
	//console.log(result[index]);
	locateMarker(index);
	if(map.getZoom()<13){
		map.setZoom(13);
	}
	map.setCenter(new google.maps.LatLng(parseFloat(result[index].start_lat),parseFloat(result[index].start_lng)));
	google.maps.event.trigger(ActiveMapMarker[index], 'click');
	setTimeout(function(){
		$.ajax({
			url:'../../common/lib/php/UpdateViewCnt.php',
			type:'POST',
			data:'tripID='+train_id,
			success: function(response){
				var jsonArray=eval('('+response+')');
				if(jsonArray[0].result==="1"){
					$('#ViewCnt_'+index).html(jsonArray[0].returnVal+'');
				}else{
					$('#ViewCnt_'+index).html('--');
				}
				
			},
			error: function() {
				alert("ERROR!!! by UpdateSettings click()");
			}
		});
	},500);
	
}

function clearAllMarker(){
	var ActiveMapMarkerLength=ActiveMapMarker.length;
	for(var i=0;i<ActiveMapMarkerLength;i++){
		ActiveMapMarker[i].setMap(null);
	}
	ActiveMapMarker=[];
	previousID=-1;
	ib.close();
}

window.onload=function(){
	setLastPosition();
}

//============== 20140403 =======================//
function codeAddress(addressFieldName) {
	var address = $('#addressFieldName').val();
	var LatlngArray=[];
	if(address.indexOf(',')>0){
		LatlngArray=address.split(',');
		var latValType=!isNaN(LatlngArray[0]);
		var lngValType=!isNaN(LatlngArray[1]);
		if((latValType)&&(lngValType)){
			map.setCenter(new google.maps.LatLng(parseFloat(LatlngArray[0]),parseFloat(LatlngArray[1])));
			setTimeout(function(){
				refreshScroll();
			},1000);
		}
	}else{
		geocoder.geocode( {'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				updatePosition(results[0].geometry.location.lat(),results[0].geometry.location.lng(),$('#addressFieldName').val())
				setTimeout(function(){
					refreshScroll();
				},1000);
			} else {
				 alert('Geocode was not successful for the following reason: ' + status);
			}
		});
	}
}

function refreshScroll(){
	var NorthEastLat=map.getBounds().getNorthEast().lat();
	var NorthEastLng=map.getBounds().getNorthEast().lng();
	var SouthWestLat=map.getBounds().getSouthWest().lat();
	var SouthWestLng=map.getBounds().getSouthWest().lng();

	var getDistanceRange=$('#TotalDistanceSlider').data('slider').getValue();
	var getTimeRange=$('#TotalTimeSlider').data('slider').getValue();
	var userName=$('#SearchByName').val().trim();
	var searchRunType=$('#SportType').val().trim();
	var searchByKeywordVal=$('#SearchByKeyword').val().trim();
	var startDate=$('#date_start').val();
	var endDate=$('#date_end').val();
	var selectPhotoExistValue=$('input[name=PhotoExist]:checked').val();
	$('#ScrollFrame').attr('src',"scrollframe.php?SearchMode=3&type="
		+searchRunType+"&findUserName="+userName+"&timeRange="+getTimeRange+"&distanceRangeStart="
		+getDistanceRange[0]+"&distanceRangeEnd="+getDistanceRange[1]+"&keyword="+searchByKeywordVal
		+"&startDate="+startDate+"&endDate="+endDate+"&photo="+selectPhotoExistValue
		+"&NE_Lat="+NorthEastLat+"&NE_Lng="+NorthEastLng+"&SW_Lat="+SouthWestLat+"&SW_Lng="+SouthWestLng);
		
	setTimeout(function(){
		//updatePosition(map.getCenter().lat(),map.getCenter().lng(),'');
	},100);
	
}

function updatePosition(lat,lng,address){
	$.ajax({
		url:'../../common/lib/php/UpdateLastPosition.php',
		type:'POST',
		data:'lastlat='+lat+'&lastlng='+lng+'&address='+address,
		success: function(response) {
			if(response!=1){
			}
		},
		error: function() {
			
		}
	});
}

function setLastPosition(){
	$.ajax({
		url:'../../common/lib/php/GetLastPosition.php',
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {
			var jsonArray=eval('('+Jdata+')');
			if(jsonArray.length>0){
				$('#addressFieldName').val(jsonArray[0].LastLddress);
				if(($.isNumeric(jsonArray[0].latitude))&&($.isNumeric(jsonArray[0].longitude))){
					initialize(parseFloat(jsonArray[0].latitude),parseFloat(jsonArray[0].longitude));
				}else{
					initialize(initLat,initLng);	
				}
			}else{
				initialize(initLat,initLng);
			}
			$('#ScrollFrame').attr('src','scrollframe.php?SearchMode=0&type=0');
		},
		error: function() {
			
		}
	});
}

var detailObj=[];
var heartbit=[];
var speed=[];
var height=[];
var eachDistance=[];
var line=[];

function getHistoryByAjax(id,deviceID,imgUrl,index){
	var indexid=index;
	url="../../common/lib/php/GetShareTraindata.php";
	tripID=id;
	var fullUrl=url+"?tripID="+id+"&deviceID="+deviceID;
	for (i=0; i<line.length; i++){                           
		line[i].setMap(null); 
	}
	line=[];
	$.ajax({
		url:fullUrl,
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {
			detailObj=[];
			heartbit=[];
			speed=[];
			height=[];
			eachDistance=[];
			jsonArray=eval('('+Jdata+')');
			$("#comment").hide();
			if(jsonArray.length>0){
				var flightPlanCoordinates=[];
				if(jsonArray[0].Detail!=''){
					$("#DetailUserImage").attr('src',imgUrl);
					$("#DetailUserImage").show();
					//var targethtml='<font style="position:relative;left:10px;font-style:italic;font-size:18px;color:#CD6600;font-weight:900;">'+result[indexid].fullname+'</font>';
					var targethtml='<font style="position:relative;font-style:italic;font-size:18px;color:#CD6600;font-weight:900;">'+result[indexid].fullname+'</font>';
					targethtml+='<div style="font-size:12px;color:#262626;font-weight:900">'+ titleCumulativeTime+':'+getSportTime(result[indexid].AccTime)+'</div><div style="color:#262626;font-size:12px;font-weight:900">'+titleCumulativeDistance+':'+getDistanceKmValue(result[indexid].AccDistance)+' km</div><div style="color:#262626;font-size:12px;font-weight:900">'+titleHighestElevation+':'+result[indexid].MaxhighestEle+'m</div><div style="color:#262626;font-size:12px;font-weight:900;">'+titleCumulativeAscent+':'+result[indexid].AccRise+'m</div>';
					$("#UserDetail").html(targethtml);
					$("#myModal").modal('show');
					google.maps.event.trigger(map2, "resize");
					detailObj=eval(jsonArray[0].Detail);
					var bounds = new google.maps.LatLngBounds();
					$('#TrainName').html(jsonArray[0].Trainname);
					if(jsonArray[0].Description==''){
						desc='';
					}else{
						desc='('+jsonArray[0].Description+')';
					}
					$('#TrainDescription').html(desc);
					$('#TotalDistance').html((parseFloat(jsonArray[0].TotalDistance)/1000).toFixed(2));
					$('#Totaltime').html(calHrAndMin(jsonArray[0].TotalTime));
					$('#Calory').html(jsonArray[0].Calory);
					$('#Speed').html(parseInt(jsonArray[0].MaxSpeed/100));
					$('#MaxHeart').html(jsonArray[0].MaxHeart+"/"+jsonArray[0].AvgHeart);
					if(jsonArray[0].LapCnts==''){
						$('#LapCnts').html('--');
					}else{
						$('#LapCnts').html(jsonArray[0].LapCnts);
					}
					
					$('#Height').html(jsonArray[0].MaxAlti+"/"+jsonArray[0].MinAlti);

					var distance=0.0
					for(var index=0;index<detailObj.length;index++){
						flightPlanCoordinates.push(new google.maps.LatLng(parseFloat(detailObj[index].latitude), parseFloat(detailObj[index].longitude)));
						bounds.extend(new google.maps.LatLng(parseFloat(detailObj[index].latitude), parseFloat(detailObj[index].longitude)));
						heartbit.push(parseInt(detailObj[index].heart_rate));
						speed.push(parseFloat(detailObj[index].speed));
						height.push(parseFloat(detailObj[index].altitude));
						distance+=parseInt(detailObj[index].distance)/100000;
						eachDistance.push(Math.floor(distance*10)/10);
					}
					flightPath = new google.maps.Polyline({
						path: flightPlanCoordinates,
						geodesic: true,
						strokeColor: '#FF0000',
						strokeOpacity: 1.0,
						strokeWeight: 5
					});
					flightPath.setMap(map2);
					line.push(flightPath);
					map2.fitBounds(bounds);
					totalBound=bounds;
					shareMarker.setPosition(new google.maps.LatLng(parseFloat(detailObj[0].latitude), parseFloat(detailObj[0].longitude)))
					drawData(heartbit,speed,height,eachDistance);
					$('#ReportTitle').show();
				}else{
					alert('No Detail data in this trip');
				}
			}else{
				alert('no data in this trip');
			}
			$('#Startloading').hide();
		},
		error: function() {
			alert("ERROR!!! by getDataByJSON()");
			$('#Startloading').hide();
		}
	});
}

function drawData(dataArray1,dataArray2,dataArray3,dataArray4){
	chart = $('#container').highcharts();
	chart.options.xAxis[0].categories=dataArray4;
	chart = new Highcharts.Chart(chart.options);
	chart.render();
    chart.series[0].setData(dataArray1,false);
	chart.series[1].setData(dataArray2,false);
	chart.series[2].setData(dataArray3,false);
	chart.redraw();
}

function checkBounds(latlng) {    
  var latitude=latlng.lat();
	var longitude=latlng.lng();
	var mapBound=map2.getBounds();
	var latDiff=0.0001;
	var lngDiff=0.0003;
	var AmaxX = mapBound.getNorthEast().lng()-lngDiff;
	var AmaxY = mapBound.getNorthEast().lat()-lngDiff;
	var AminX = mapBound.getSouthWest().lng()+latDiff;
	var AminY = mapBound.getSouthWest().lat()+latDiff;

	if((latitude<AminY)||(latitude>AmaxY)||(longitude<AminX)||(longitude>AmaxX)){
		map2.panTo(new google.maps.LatLng(latitude,longitude));
	} 
}
