var map;
var map2;
var markers = [];
$(function() {
	initialize();
	$('#displayswitch').click(function(){
		if( $('#trip4').is(':visible')){
			$('#trip4,#trip5').hide();
			$('#displayswitch').html('顯示更多');	
		}else{
			$('#trip4,#trip5').show();
			$('#displayswitch').html('隱藏');
		}
		
	});
});

function initialize() {
	var mapOptions = {
		zoom: 11,
		center: new google.maps.LatLng(24.5122, 121.3344),
		mapTypeId:google.maps.MapTypeId.HYBRID
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	map2 = new google.maps.Map(document.getElementById('map-canvas2'), mapOptions);
	  
	google.maps.event.addListener(map, 'dragend', function(){ 
		getActivesFromBound();
	});
	
	google.maps.event.addListener(map, 'zoom_changed', function(){ 
		getActivesFromBound();
	});
	
	var marker = new google.maps.Marker({
        position: new google.maps.LatLng(24.950430653865748, 121.44639240671061),
        map: map,
        title:'承天寺苦行之旅',
		icon:'./images/activity.png'
    });
	/*
	google.maps.event.addListener(marker, 'click', function() {
		map.setZoom(14);
		map.setCenter(marker.getPosition());
	});
	*/
	google.maps.event.addListener(marker, 'dblclick', function() {
		//map.setZoom(14);
		map.setCenter(marker.getPosition());
		//infoDailog(0);
		
	});
    markers.push(marker);

}

function getActivesFromBound(){
	var NELatlng=map.getBounds().getNorthEast();
	var SWLatlng=map.getBounds().getSouthWest();
	$('#activitys').html('');  
	for(var i=0;i<markers.length;i++){
		if(((markers[i].getPosition().lat()>=SWLatlng.lat())&&(markers[i].getPosition().lat()<=NELatlng.lat()))
			&&((markers[i].getPosition().lng()>=SWLatlng.lng())&&(markers[i].getPosition().lng()<=NELatlng.lng()))){
			$('#activitys').html('&nbsp;&nbsp;&nbsp;<span id="choose" class="label label-info" onclick="infoDailog('+i+')" style="cursor:pointer">Info</span>&nbsp<span style="cursor:pointer" onclick="setMarkerCenetr('+i+')">承天寺苦行之旅</span>');
		}
	}
}

function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function deleteMarkers() {
	clearMarkers();
	markers = [];
}

function clearMarkers() {
  setAllMap(null);
}

function showMarkers() {
	setAllMap(map);
}

function getMap(){
	initialize();
}

function infoDailog(index){
	getHistoryByAjax();
	$("#myModal").modal('show');
	map.setCenter(markers[index].getPosition());
	map2.setCenter(markers[index].getPosition());
	google.maps.event.trigger(map2, "resize");
}

function setMarkerCenetr(index){
	map.setCenter(markers[index].getPosition());
}

var line=[];
var heartbit=[];
var speed=[];
var height=[];
var distance=[];
var detailObj=[];
var detailObj;

function getHistoryByAjax(){
	
	url="./common/lib/php/GetShareTraindata.php";
	var fullUrl=url+"?tripID=101&deviceID=gsgh-625xt12W32A0000023";
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
			height=[];
			eachDistance=[];
			jsonArray=eval('('+Jdata+')');
			if(jsonArray.length>0){
				var flightPlanCoordinates=[];
				if(jsonArray[0].Detail!=''){
					detailObj=eval(jsonArray[0].Detail);
					var bounds = new google.maps.LatLngBounds();
					$('#TotalDistance').html(jsonArray[0].TotalDistance);
					$('#Totaltime').html(calHrAndMin(jsonArray[0].TotalTime));
					$('#Calory').html(jsonArray[0].Calory);
					$('#Speed').html(parseInt(jsonArray[0].MaxSpeed/100));
					$('#MaxHeart').html(jsonArray[0].MaxHeart+"/"+jsonArray[0].AvgHeart);
					$('#LapCnts').html(jsonArray[0].LapCnts);
					$('#Height').html(jsonArray[0].MaxAlti+"/"+jsonArray[0].MinAlti);
					$('#TrainName').html(jsonArray[0].Trainname);
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
					marker.setPosition(new google.maps.LatLng(parseFloat(detailObj[0].latitude), parseFloat(detailObj[0].longitude)))
					//drawData(heartbit,speed,height,eachDistance);
					
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

function calHrAndMin(val){
	var hrMins=parseFloat(parseInt(val)/36000);
	var hr=parseInt(hrMins);
	var trueMinute=(hrMins-hr)*60;
	var minute=parseInt(trueMinute);
	var second=parseInt((trueMinute-minute)*60);
	return fillzerowithValue(hr)+":"+fillzerowithValue(minute)+":"+fillzerowithValue(second);
}
function fillzerowithValue(val){
	if(val<10){
		return '0'+val;
	}else{
		return ''+val;
	}
}