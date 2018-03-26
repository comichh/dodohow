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

$(function () {
	$('#container').highcharts({
		chart: {
			type: 'spline'
		},
		title: {
			text: '地形水平高度',
			x: -20 //center
		},
		subtitle: {
			text: 'Source: sport4u.com',
			x: -20
		},
		xAxis: {
			//categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
			labels: {
				format: '{value} '
			},
			tickInterval: 100
		},
		yAxis: {
			min:0,
			max:1500,
			title: {
				text: '高度(m)'
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
			valueSuffix: '公尺',
			formatter: function() {
				return '<font size="1">里程:'+Math.round(this.x)/1000+' 公里</font><br><font size="1">海拔:'+parseInt(this.y)+' 公尺</font>';
			}
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle',
			borderWidth: 0
		},
		series: [{
			name: '海拔',
			data: []
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
							mouseOut: function() {
								moveStepmarker.setPosition(new google.maps.LatLng(parseFloat(elevations[this.x].location.lat()), parseFloat(elevations[this.x].location.lng())));
								map.panTo(new google.maps.LatLng(parseFloat(elevations[this.x].location.lat()), parseFloat(elevations[this.x].location.lng())));
								
							},
							mouseOver: function() {
								moveStepmarker.setPosition(new google.maps.LatLng(parseFloat(elevations[this.x].location.lat()), parseFloat(elevations[this.x].location.lng())));
								map.panTo(new google.maps.LatLng(parseFloat(elevations[this.x].location.lat()), parseFloat(elevations[this.x].location.lng())));
							},
							select: function() {
								var pointLat=parseFloat(elevations[this.x].location.lat());
								var pointLng=parseFloat(elevations[this.x].location.lng());
								var pointNextLat=parseFloat(elevations[this.x+1].location.lat());
								var pointNextLng=parseFloat(elevations[this.x+1].location.lng());
								
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
								/*
								if(!lockMoveOver){
									lockMoveOver=true;
								}else{
									lockMoveOver=false;
								}
								*/
								sv.getPanoramaByLocation(thisLatLng, 50, processSVData);
								//panorama.setPosition(thisLatLng);
								//nowRecordIndex=this.x;
								/*
								var latLng=new google.maps.LatLng(parseFloat(jsonArray[this.x].lat), parseFloat(jsonArray[this.x].lng));
								map.setCenter(latLng);
								beachMarker.setPosition(latLng);
								nowRecordIndex=this.x;
								lockMoveOver=true;
								*/
							},
							unselect:function(){
								
							}
						}
					}
			}
		}
	});
	google.maps.event.addDomListener(window, 'load', initialize);
});

function initialize() {
  
  var rendererOptions = {
	  markerOptions:{
		icon:'./images/Active_Marker.png'
	  },
	  draggable: true
  };
  directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
  directionsService = new google.maps.DirectionsService();
  australia = new google.maps.LatLng(25.046229, 121.517640);
  infowindow = new google.maps.InfoWindow();
  sv = new google.maps.StreetViewService();
  var mapOptions = {
	zoom: 7,
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	center: australia
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  moveStepmarker = new google.maps.Marker({
	  position: australia,
	  map: map,
	  visible:false
  });
  stepDisplay = new google.maps.InfoWindow();	
  
  map.setZoom(16);
  directionsDisplay.setMap(map);
  

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
  
  google.maps.event.addListener(map, 'zoom_changed', function() {
	    
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
		chart = $('#container').highcharts();
		//------------------ 更新chart內容 ----------------------//
		if(maxElevationValue<1500){
			maxElevationValue=1500;
		}
		//chart.options.xAxis[0].max=parseInt(totalMiles/1000)+1;
		chart.options.xAxis[0].categories=indkmArray;
		chart.options.yAxis[0].max=parseInt(maxElevationValue);
		chart.options.yAxis[0].title.text = 'new title';
		chart = new Highcharts.Chart(chart.options);
		chart.render();
		//-------------------------------------------------------//
		//chart.options.yAxis.max=maxElevationValue;
		//chart.series[0].yAxis.max=maxElevationValue;
		chart.series[0].setData(elevationValArray);
		chart.redraw();
		machiningRoutePosition(results);
		//sv.getPanoramaByLocation(elevationPath[results.length-1], 50, processSVData);
	}
}
var pointsArray=[];
var path = [];

function calcRoute() {
 
	var markerLastIndex=markers.length-1;
	var tempRoutePoint=[];
	if(markerLastIndex>0){
		for(var index=1;index<markerLastIndex;index++){
			tempRoutePoint.push({
			  location:markers[index].getPosition(),
			  stopover:true
			});
		}
		
		var request = {
			origin: markers[0].position,
			destination: markers[markerLastIndex].position,
			waypoints:tempRoutePoint,
			travelMode: google.maps.DirectionsTravelMode.WALKING
			//travelMode: google.maps.TravelMode.BICYCLING
		};
		
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
	deleteAllKMMarker();
	directionsDisplay.setMap(null);
	markers = [];
	moveStepmarker.setVisible(false);
	chart = $('#container').highcharts();
	chart.series[0].setData([]);
	chart.redraw();
	$('#directionsPanel').html('');
}


//-------------------------------------------------//
//For 執行縮點
//result:回傳的所有經緯度陣列
//-------------------------------------------------// 
function machiningRoutePosition(result){
var point=[];
var point1=[];

for(i in result){ 
// console.log (i);   
  point[i]=JSON.stringify(result[i].location.lat());
  point1[i]=JSON.stringify(result[i].location.lng());
}
 

$.ajax({                                     // 後台縮點 
      url: "js/ajax/reduce1.php",
      type: "POST",
      dataType: "json",
      data:{point:point},
         success: function(data) {      
           console.log ("data");                 
      },error: function() {console.log("ERROR!!!");} 
});   


//console.log (data);
//	alert(result[0].location.lat());
	//alert(result[0].location.lng());

}
//-------------------------------------------------//
