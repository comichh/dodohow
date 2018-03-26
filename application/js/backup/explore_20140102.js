var map;
var map2;
var markers = [];
var thisTripID;
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
	getActivityByAjax();
});

function initialize() {
	var mapOptions = {
		zoom: 11,
		center: new google.maps.LatLng(24.5122, 121.3344),
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	map2 = new google.maps.Map(document.getElementById('map-canvas2'), mapOptions);
	  
	google.maps.event.addListener(map, 'dragend', function(){ 
		getActivesFromBound();
	});
	
	google.maps.event.addListener(map, 'zoom_changed', function(){ 
		getActivesFromBound();
	});
	


}

function getActivesFromBound(){
	var NELatlng=map.getBounds().getNorthEast();
	var SWLatlng=map.getBounds().getSouthWest();
	var str='';
	for(var i=0;i<markers.length;i++){
		if(((markers[i].getPosition().lat()>=SWLatlng.lat())&&(markers[i].getPosition().lat()<=NELatlng.lat()))
			&&((markers[i].getPosition().lng()>=SWLatlng.lng())&&(markers[i].getPosition().lng()<=NELatlng.lng()))){
			str+='<div><span id="choose" class="label label-info" onclick="getHistoryByAjax('+jsonTripArray[i].id+',\''+jsonTripArray[i].deviceID+'\')" style="cursor:pointer">Info</span>&nbsp<span style="cursor:pointer" onclick="setMarkerCenetr('+i+')">'+jsonTripArray[i].train_name+'</span></div>';
		}
	}
	$('#activitys').html(str);
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

function infoDailog(index,deviceID){
	getHistoryByAjax(index,deviceID);
	//$("#myModal").modal('show');
	//map.setCenter(markers[index].getPosition());
	//map2.setCenter(markers[index].getPosition());
	//google.maps.event.trigger(map2, "resize");
}

function setMarkerCenetr(index){
	map.panTo(markers[index].getPosition());
	if(map.getZoom()<14){
		map.setZoom(14);
	}
}

var line=[];
var heartbit=[];
var speed=[];
var height=[];
var distance=[];
var detailObj=[];
var detailObj;

function getHistoryByAjax(id,deviceID){
  testByAjax(id);   
	url="./common/lib/php/GetShareTraindata.php";
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
			height=[];
			eachDistance=[];
			jsonArray=eval('('+Jdata+')');
			if(jsonArray.length>0){
				var flightPlanCoordinates=[];
				if(jsonArray[0].Detail!=''){
					$("#myModal").modal('show');
					google.maps.event.trigger(map2, "resize");
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
					$('#map-canvas2').show("slow");
					//marker.setPosition(new google.maps.LatLng(parseFloat(detailObj[0].latitude), parseFloat(detailObj[0].longitude)))
					//drawData(heartbit,speed,height,eachDistance);
					
					//$('#ReportTitle').show();
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
var jsonTripArray;





function getActivityByAjax(){
	
	url="./common/lib/php/GetShareActivity.php";
	var fullUrl=url;
	$.ajax({
		url:fullUrl,
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {
			jsonTripArray=eval('('+Jdata+')');
			if(jsonTripArray.length>0){
				var totalcount=jsonTripArray.length;
				var tripID='';
				var deviceID;
				for(var i=0;i<totalcount;i++){
					tripID=jsonTripArray[i].id;
					deviceID=jsonTripArray[i].deviceID;
					var marker = new google.maps.Marker({
						position: new google.maps.LatLng(parseFloat(jsonTripArray[i].start_lat), parseFloat(jsonTripArray[i].start_lng)),
						map: map,
						title:jsonTripArray[i].train_name,
						icon:'./images/map_activity.png'
					});
					google.maps.event.addListener(marker, 'click', (function(marker, tripID) {            
						 return function() {
							thisTripID=tripID;     
							getHistoryByAjax(tripID,deviceID);           
						 }
					})(marker, tripID));
					markers.push(marker);
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

function testByAjax(tripID)
{
   $.post('ajax/comment1.php', {tripID:tripID}, function(data){
     //alert (data);
    $("#comment").html(data);
   });
}
