var map;
var line = [];
function initialize() {
  var mapOptions = {
	zoom: 11,
	center: new google.maps.LatLng(24.5122, 121.3344),
	mapTypeId:google.maps.MapTypeId.TERRAIN
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
  //maploaded=true;
 
}

function getHistory(url){
	url=url+"?tripID="+$('#tripID').val();
	for (i=0; i<line.length; i++){                           
		line[i].setMap(null); 
	}
	line=[];
	$.ajax({
		url:url,
		type:"GET",
		success: function(Jdata) {
		    var jsonArray=eval(Jdata);
			if(jsonArray.length>0){
				var flightPlanCoordinates=[];
				var bounds = new google.maps.LatLngBounds();
				for(var index=0;index<jsonArray.length;index++){
					flightPlanCoordinates.push(new google.maps.LatLng(jsonArray[index].latitude, jsonArray[index].longitude));
					bounds.extend(flightPlanCoordinates[index]);
				}
				flightPath = new google.maps.Polyline({
					path: flightPlanCoordinates,
					geodesic: true,
					strokeColor: '#FF0000',
					strokeOpacity: 1.0,
					strokeWeight: 2
				});
				flightPath.setMap(map);
				line.push(flightPath);
				map.fitBounds(bounds);
			}else{
				alert('no data in this trip');
			}
		},
		error: function() {
			alert("ERROR!!! by getDataByJSON()");
		}
	});
}
/*
var SportHistory = {
	drawPath : function(){
	  
	}
};
*/
