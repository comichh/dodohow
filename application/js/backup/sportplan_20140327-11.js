var streetViewHeading=0;
var lockMoveOver=false;
var directionsDisplay;
var directionsService;
var map;
var stepDisplay;
var markerArray = [];
var elevator;
var australia;
var infowindow;
var chart;
var moveStepmarker;
var panorama;
var sv;
var kmMarker=[];
var chartMarker=[];
var routePolyline;
var routeResult;
var outSourceMarker=[];
var pointLocationArray=[];
var pointsArray=[];
var path = [];
var dataType=0;

$(function () {
	$('#WalkMode,#BicycleMode').click(function(){
		if(markers.length>1){
			reGetElevationPath();
		}
	});
	
	var options = {
		url:'./common/lib/php/UploadRoutefile.php',
		beforeSend: function()
		{
			$("#progress").show();
			$("#bar").width('0%');
			$("#message").html("");
			$("#percent").html("0%");
		},
		uploadProgress: function(event, position, total, percentComplete)
		{
			$("#bar").width(percentComplete+'%');
			$("#percent").html(percentComplete+'%');
	 
		},
		success: function()
		{
			$("#bar").width('100%');
			$("#percent").html('100%');
	 
		},
		complete: function(response)
		{
			//$("#message").html("<font color='green'>"+response.responseText+"</font>");
			//var userImg='./upload/'+response.responseText
			//$('#UserPhoto', window.parent.document).attr('src',userImg);
			/*
			$('#UserPhoto', window.parent.document).attr('src',userImg);
			$('#UserPhotoSmall', window.parent.document).attr('src',userImg);
			$('#UserPhoto', window.parent.document).fadeIn(500);
			*/
			$('#UploadRouteModal').hide();
			if(typeof(routePolyline)!=="undefined"){
				routePolyline.setMap(null)
			}
			setTimeout(function(){
				loadGPXFileIntoGoogleMap(response.responseText);
			},1000);
			/*
			$('#map').show();
			setTimeout(function(){
				google.maps.event.trigger(map, "resize");
				loadGPXFileIntoGoogleMap(response.responseText);
			},1000);
			*/
			//window.parent.changeUserPhoto(userImg);
			//parent.$('body').trigger( 'changeUserPhoto("'+userImg+'")' );
			//$(parent.document).trigger('changeUserPhoto("'+userImg+'")');
			//alert('2');
		},
		error: function()
		{
			$("#message").html("<font color='red'> ERROR: unable to upload files</font>"); 
		}
	 
	};
	$("#myForm").ajaxForm(options);	
	
	
	$('#container').highcharts({
		chart: {
			type: 'areaspline',
			backgroundColor:'rgba(255, 255, 255, 1)'
		},
		title: {
			text: titleSportPlanTerrainHeight,
			x: -20 //center
		},
		subtitle: {
			text: 'Source: sport4u.com',
			x: -20
		},
		xAxis: {
			labels: {
				format: '{value} '
			},
			tickInterval: 100
		},
		yAxis: {
			min:0,
			max:1500,
			title: {
				text: '(m)'
			},
			labels: {
				format: '{value} m'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			crosshairs: true,
			shared: true,
			valueSuffix: titleSportPlanMeter,
			formatter: function() {
				return '<font size="1">'+titleSportPlanMiles+':'+this.x+' '+titleSportPlanKilometer+'</font><br>'+
						'<font size="1">'+titleSportPlanElevation+':'+parseInt(this.y)+' '+titleSportPlanMeter+'</font>';
			}
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle',
			borderWidth: 0
		},
		series: [{
			name: titleSportPlanElevation,
			data: []
		}],
		plotOptions: {
			areaspline:{
				lineWidth: 1,
				states: {
					hover: {
						lineWidth: 1,
						enable:true
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
					type: 'area',
					allowPointSelect: true,
					animation: {
						duration:2000
					},
					point: {
						events: {
							mouseOut: function() {
								deleteMarkerRunner();
								indexop=this.x;
								moveStepmarker.setPosition(new google.maps.LatLng(parseFloat(routeResult[this.x].location.lat()), parseFloat(routeResult[this.x].location.lng())));
								map.panTo(new google.maps.LatLng(parseFloat(routeResult[this.x].location.lat()), parseFloat(routeResult[this.x].location.lng())));
							},
							mouseOver: function() {
								deleteMarkerRunner();
								indexop=this.x;
								moveStepmarker.setPosition(new google.maps.LatLng(parseFloat(routeResult[this.x].location.lat()), parseFloat(routeResult[this.x].location.lng())));
								map.panTo(new google.maps.LatLng(parseFloat(routeResult[this.x].location.lat()), parseFloat(routeResult[this.x].location.lng())));
							},
							select: function() {
								deleteMarkerRunner();
								indexop=this.x;
								var pointLat=parseFloat(routeResult[this.x].location.lat());
								var pointLng=parseFloat(routeResult[this.x].location.lng());
								var pointNextLat=parseFloat(routeResult[this.x+1].location.lat());
								var pointNextLng=parseFloat(routeResult[this.x+1].location.lng());
								
								var thisLatLng=new google.maps.LatLng(pointLat, pointLng);
								var thisNextLatLng=new google.maps.LatLng(pointNextLat, pointNextLng);
								var heading = parseInt(google.maps.geometry.spherical.computeHeading(thisLatLng,thisNextLatLng));
								if(heading<0){
									streetViewHeading=360+heading;
								}else{
									streetViewHeading=heading;
								}								
								moveStepmarker.setPosition(thisLatLng);
								map.setCenter(thisLatLng);
								map.setZoom(16);
								sv.getPanoramaByLocation(thisLatLng, 50, processSVData);
							},
							unselect:function(){
								
							}
						}
					}
			}
		}

	});
	$('#SaveMyPlanning').click(function(){
		$('#PlanningName,#MachineName,#SelectSportType').css('background','#ffffff');
		var PlanningName=$('#PlanningName').val().trim();
		var MachineName=$('#MachineName').val().trim();
		var SelectSportType=$('#SelectSportType').val().trim();
		if(PlanningName===""){
			$('#PlanningName').css('background','#FFFF00');
			alert(titleSavePlanNameEmpty);
			return;
		}
		if(!checkChar(MachineName)){
			$('#MachineName').css('background','#FFFF00');
			alert(titleSaveMachineIDError);
			return;
		}
		if(confirm(titleConfirmSavePlan)){
			machiningRoutePosition(routeResult,PlanningName,MachineName,SelectSportType);
		}
	});
});
var indexop=0;
var timerUser;
var routeResultLength;
var runStatu=false;

function deleteMarkerRunner(){
	runStatu=false;
	clearInterval(timerUser);
	$('#playBtnImage').attr('src','./images/play.png');
}

function playRoute(){
	if(runStatu){
		deleteMarkerRunner();
		return;
	}
	routeResultLength=routeResult.length;
	$('#playBtnImage').attr('src','./images/pause.png');
	runStatu=true;
	timerUser=setInterval(function(){
		if(indexop<routeResultLength){
			switch(dataType){
				case 1:
					chart.tooltip.refresh([chart.series[0].points[indexop]]);
					moveStepmarker.setPosition(routeResult[indexop].location);
					map.setCenter(routeResult[indexop].location);
					break;
				case 2:
					var runLat=parseFloat(routeResult[indexop].location.lat());
					var runLng=parseFloat(routeResult[indexop].location.lng());
					var latLng=new google.maps.LatLng(runLat,runLng);
					chart.tooltip.refresh([chart.series[0].points[indexop]]);
					moveStepmarker.setPosition(latLng);
					map.setCenter(latLng);
					break;
			}
			
			indexop++;
		}else{
			clearInterval(timerUser);
		}
	},500);
}

function checkChar(str) {
    var regExp = /^[\d|a-zA-Z]+$/;
    if (regExp.test(str))
        return true;
    else
        return false;
}

function loadGPXFileIntoGoogleMap(filename) {
	$.ajax({url: filename,
		dataType: "xml",
		success: function(data) {
			var parser = new GPXParser(data,map);
			parser.setTrackColour("#ff0000");     // Set the track line colour
			parser.setTrackWidth(5);          // Set the track line width
			parser.setMinTrackPointDelta(0.001);      // Set the minimum distance between track points
			parser.centerAndZoom(data);
			parser.addTrackpointsToMap();         // Add the trackpoints
			//parser.addWaypointsToMap();           // Add the waypoints
			//routeResult=parser.getPointArray();
			routeResult=pointLocationArray;
			var getDistanceCollection=getActivityRoutePathKM();
			var resultlen=routeResult.length;
			var elevationArray=[];
			chart.options.xAxis[0].categories=getDistanceCollection;
			if(resultlen>0){
				moveStepmarker.setPosition(new google.maps.LatLng(parseFloat(routeResult[0].location.lat()),parseFloat(routeResult[0].location.lng())));
				moveStepmarker.setVisible(true);
			}
			for(var i=0;i<resultlen;i++){
				elevationArray.push(routeResult[i].location.elevation());
			}
			chart = $('#container').highcharts();
			chart = new Highcharts.Chart(chart.options);
			chart.render();
			chart.series[0].setData(elevationArray);
			chart.redraw();
			dataType=2;
		}
	});
}

function initialize(lat,lng) {
  
  var rendererOptions = {
	  markerOptions:{
		icon:'./images/Active_Marker.png'
	  },
	  draggable: true
  };
  directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
  directionsService = new google.maps.DirectionsService();
  australia = new google.maps.LatLng(lat,lng);
  infowindow = new google.maps.InfoWindow();
  sv = new google.maps.StreetViewService();
  var mapOptions = {
	zoom: 14,
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	center: australia
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
  var image = {
    url: './images/circle.png',
    // This marker is 20 pixels wide by 32 pixels tall.
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(10,24)
  };
  
  moveStepmarker = new google.maps.Marker({
	  position: australia,
	  map: map,
	  visible:false,
	  icon:image
	  //icon:'./images/circle.png',
  });
  stepDisplay = new google.maps.InfoWindow();	

  outSourceMarker[0] = new google.maps.Marker({
	  map: map,
	  icon:'./images/start.png',
	  visible:false
  });	
  outSourceMarker[1] = new google.maps.Marker({
	  map: map,
	  icon:'./images/end.png',
	  visible:false
  });
  
  directionsDisplay.setMap(map);
  
  routePolyline=new google.maps.Polyline({
    strokeColor: '#0000FF',
    strokeOpacity: 0.5,
    strokeWeight: 5
  });  

  var panoramaOptions = {
	position: australia,
	pov: {
	  heading: 34,
	  pitch: -5
	}
  };
  panorama = new  google.maps.StreetViewPanorama(document.getElementById('pano'),panoramaOptions);
  map.setStreetView(panorama);
  
  google.maps.event.addListener(map, 'click', function(event) {
		addMarker(event.latLng);
		
	  //sv.getPanoramaByLocation(event.latLng, 50, processSVData);
  });
    
  google.maps.event.addListener(map, 'dragend', function(){ 
		setTimeout(function(){
			updateMyLastPosition(map.getCenter().lat(),map.getCenter().lng());
		},100);	
  });	
	
  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
		reGetElevationPath();
  });
  
  directionsDisplay.setPanel(document.getElementById('directionsPanel'));
  elevator = new google.maps.ElevationService();
}

function processSVData(data, status) {
  if (status == google.maps.StreetViewStatus.OK) {
	panorama.setPosition(data.location.latLng);
	panorama.setPov({heading: streetViewHeading, pitch:-5, zoom: 1});
	panorama.setVisible(true);
  }
}

function refreshMarkerPosition(){
	
	/*	
	var markerLength=markers.length;
	var tempMarkerArray=[];
	for(var index=0;index<markerLength;index++){
		var marker = new google.maps.Marker({
			position: markers[index].getPosition(),
			map:map,
			icon:'./images/Active_Marker.png',
			draggable: true
		});
		tempMarkerArray.push(marker);
	}
	markers=tempMarkerArray;
	*/
}

function reGetElevationPath(){
	path=[];
	var pointsArray=directionsDisplay.directions.routes[0].overview_path;
	if(pointsArray.length>0){
		moveStepmarker.setPosition(new google.maps.LatLng(parseFloat(pointsArray[0].lat()),parseFloat(pointsArray[0].lng())));
		moveStepmarker.setVisible(true);
	}
	for (var i=0;i<pointsArray.length;i++){
		path.push(new google.maps.LatLng(parseFloat(pointsArray[i].lat()),parseFloat(pointsArray[i].lng())));
	}
	var pathRequest = {
		'path': path,
		'samples': 512
	}
	elevator.getElevationAlongPath(pathRequest, plotElevation);	
}

var canBuildMarker=true;
var markers = [];

function addMarker(latlng, doQuery) {
	var marker = new google.maps.Marker({
		position: latlng,
		map:map,
		icon:'./images/Active_Marker.png',
		draggable: true
	});

	markers.push(marker);
	if(markers.length>1){
		calcRoute();
	}
}

function deleteAllKMMarker(){
	for(var i=0;i<kmMarker.length;i++){
		kmMarker[i].setMap(null);
	}
	kmMarker=[];
	totalMiles=0;
	elevations=[];
}

function reDrawKmStop(){
	var id=1;
	switch(true){
		case map.getZoom()<6:
			id=100;
			break;
		case map.getZoom()<8:
			id=50;
			break;
		case map.getZoom()<9:
			id=30;
			break;
		case map.getZoom()<10:
			id=20;
			break;	
		case map.getZoom()<11:	
			id=6;
			break;
		case map.getZoom()<13:
			id=4;
			break;
		case map.getZoom()<15:
			id=2;
			break;	
		default:
			id=1;
			break;
	}
	
	var totalCalMiles=id*1000*512;
	
	var pointIndex=parseInt(totalCalMiles/totalMiles);
		if(totalCalMiles%totalMiles>0){
			var round=parseInt(512/(totalCalMiles/totalMiles));
		}else{
			var round=parseInt(512/(totalCalMiles/totalMiles))+1;
		}
				
		for(var indexKm=1;indexKm<=round;indexKm++){
			var markerKM = new MarkerWithLabel({
			   position: elevations[pointIndex*indexKm].location,
			   map:map,
			   visible:false,
			   draggable: false,
			   raiseOnDrag: true,
			   labelContent: indexKm*id,
			   labelAnchor: new google.maps.Point(6,47),
			   labelClass: "labels", // the CSS class for the label
			   labelInBackground: false,
			   icon:"./images/stop.png"
			 });
			 kmMarker.push(markerKM); 
		}
}
var totalMiles=0;
var elevations;

function plotElevation(results, status) {
	if (status == google.maps.ElevationStatus.OK) {
		deleteAllKMMarker();
		elevations = results;
		totalMiles=computeTotalDistance(directionsDisplay.directions);
		reDrawKmStop();
		var indkm=totalMiles/512;
		var indkmArray=[];				
		var elevationPath = [];
		var elevationValArray=new Array();
		var maxElevationValue=0;
		var currentElevationValue=0;
		for (var i = 0; i < results.length; i++) {
			currentElevationValue=parseFloat(elevations[i].elevation);
			if(maxElevationValue<currentElevationValue){
				maxElevationValue=currentElevationValue;
			}
			elevationValArray.push(parseInt(elevations[i].elevation));
			elevationPath.push(elevations[i].location);
			indkmArray.push(parseInt(indkm*i));
		}
		
		routeResult=results;
		
		var thisDistanceArray=getActivityRoutePathKM();
		
		chart = $('#container').highcharts();
		//------------------ 更新chart內容 ----------------------//
		if(maxElevationValue<1500){
			maxElevationValue=1500;
		}
		chart.options.xAxis[0].categories=thisDistanceArray;
		//chart.options.xAxis[0].max=parseInt(totalMiles/1000)+1;
		//chart.options.xAxis[0].categories=indkmArray;
		chart.options.yAxis[0].max=parseInt(maxElevationValue);
		chart.options.yAxis[0].title.text = 'new title';
		chart = new Highcharts.Chart(chart.options);
		chart.render();
		//-------------------------------------------------------//
		//chart.options.yAxis.max=maxElevationValue;
		//chart.series[0].yAxis.max=maxElevationValue;
		chart.series[0].setData(elevationValArray);
		chart.redraw();
		markers[markers.length-1].setPosition(elevations[results.length-1].location);
		dataType=1;
		//alert(distanceArray[0]);
				
		//sv.getPanoramaByLocation(elevationPath[results.length-1], 50, processSVData);
	}
}

function getActivityRoutePathKM(){
	var routeResultLength=routeResult.length;
	var latLngA;
	var latLngB;
	var distanceadd=0.0;
	var distanceArray=[];
	for(var i=0;i<routeResultLength-1;i++){
		latLngA=new google.maps.LatLng(parseFloat(routeResult[i].location.lat()),parseFloat(routeResult[i].location.lng()));
		latLngB=new google.maps.LatLng(parseFloat(routeResult[i+1].location.lat()),parseFloat(routeResult[i+1].location.lng()));
		distanceadd+=parseInt(google.maps.geometry.spherical.computeDistanceBetween(latLngA,latLngB))/1000;
		distanceArray.push(Math.floor(distanceadd*10)/10);
	}
	//最後一點補上最後一段距離的值
	distanceArray.push(Math.floor(distanceadd*10)/10);
	return distanceArray;
}

function calcRoute() {
 
	var markerLastIndex=markers.length-1;
	var tempRoutePoint=[];
	if(markerLastIndex>=0){
		for(var index=1;index<markerLastIndex;index++){
			tempRoutePoint.push({
			  location:markers[index].getPosition(),
			  stopover:true
			});
		}
		
		switch($("#SportTypeGroup .active").attr('value')){
			case "a":	//WALKING Model
				var request = {
					origin: markers[0].position,
					destination: markers[markerLastIndex].position,
					waypoints:tempRoutePoint,
					travelMode: google.maps.DirectionsTravelMode.WALKING
				};
				break;
			case "b":	//BICYCLING Model
				var request = {
					origin: markers[0].position,
					destination: markers[markerLastIndex].position,
					waypoints:tempRoutePoint,
					travelMode: google.maps.TravelMode.BICYCLING
				};
				break;
		}
		for(var i=0;i<markers.length;i++){
			markers[i].setMap(null);
		}
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				directionsDisplay.setMap(map);
			}
			
		});
	}
}

function showRouteSteps(directionResult) {
  var myRoute = directionResult.routes[0].legs[0];
  var myStepArray=[];
  for (var i = 0; i < myRoute.steps.length; i++) {
	var marker = new google.maps.Marker({
	  position: myRoute.steps[i].start_point,
	  map: map
	});
	attachInstructionText(marker, myRoute.steps[i].instructions);
	markerArray[i] = marker;
  }
}

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
	total += myroute.legs[i].distance.value;
  }
  $('#total').html(total/1000 + ' km');
  return total;
}
		
function attachInstructionText(marker, text) {
  google.maps.event.addListener(marker, 'click', function() {
	stepDisplay.setContent(text);
	stepDisplay.open(map, marker);
  });
}

function showPathName(){
	$('#map-canvas').css('width','75%');
	$('#RouthPathName').css('width','24%');
	$('#RouthPathName').css('display','block');
	$('#ShowPathBtn').hide();
	$('#HidePathBtn').show();
}

function hidePathName(){
	$('#map-canvas').css('width','99%');
	$('#RouthPathName').css('width','0%');
	$('#RouthPathName').css('display','none');
	$('#ShowPathBtn').show();
	$('#HidePathBtn').hide();
}

function redrawRoutePath(){
	deleteline();
	deleteAllKMMarker();
	directionsDisplay.setMap(null);
	markers = [];
	moveStepmarker.setVisible(false);
	chart = $('#container').highcharts();
	chart.series[0].setData([]);
	chart.redraw();
	$('#directionsPanel').html('');

}

function updateMyLastPosition(lat,lng){
	
	$.ajax({
		url:'./common/lib/php/UpdateLastPosition.php',
		type:'POST',
		data:'lastlat='+lat+'&lastlng='+lng,
		success: function(response) {
					
		},
		error: function() {
			
		}
	});
}

function RemoveLastMarker(){
	var markerIndex;
	if(markers.length<=1){
		directionsDisplay.setMap(null);
		for(var i=0;i<markers.length;i++){
			markers[i].setMap(null);
			markers.splice(i);
		}
		deleteAllKMMarker();
		chart.series[0].setData([]);
		$('#directionsPanel').html('');
		moveStepmarker.setVisible(false);
		return;
	}
	if(markers.length>0){
		markerIndex=markers.length-1;
		markers[markerIndex].setMap(null);
		markers.splice(markerIndex);
		if(markers.length>0){
			calcRoute();
			if(markers.length<=1){
				chart.series[0].setData([]);
				moveStepmarker.setVisible(false);
			}
		}
	}
}

function saveResultToDeviceBase(){
	if(routeResult.length>1){
		$("#myModal").modal('show');
	}else{
		alert(titlePredrawPath);
	}
}

function RouteFileUpload(){
	redrawRoutePath();
	$("#UploadRouteModal").modal('show');
}

function deleteline(){
	if(typeof(routePolyline)!=="undefined"){
		routePolyline.setMap(null)
	}
}

//-------------------------------------------------//
//For 執行縮點
//result:回傳的所有經緯度陣列
//-------------------------------------------------// 
function machiningRoutePosition(result,planName,machineID,planType){
	var temp="";
	for(i in result){ 
	  temp+=result[i].location.lat()+","+result[i].location.lng()+";";          // 沒辦法直接傳 array ，只好組成字串
	}
	//alert(temp);
	//return;
	$.ajax({                                    
		  url: "js/ajax/reduce.php",
		  type: "POST",
		  //dataType: "json",
		  data:{temp:temp,planName:planName,machineID:machineID,planType:planType},
		  success:function(data) { 
			console.log(data);          
			if (data =="成功")     // 正常寫入資料庫
			{    
			  alert ("儲存成功");
			}else {
			  alert ("儲存失敗");
			}                  
		  },
		  error:function(){
			console.log("error ajax return");
		  } 
	});   


	//console.log (data);
	//	alert(result[0].location.lat());
		//alert(result[0].location.lng());

}


//-------------------------------------------------//
