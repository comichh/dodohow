var map;
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
		map.setZoom(14);
		map.setCenter(marker.getPosition());
		infoDailog(0);
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
	$("#myModal").modal('show');
	map.setCenter(markers[index].getPosition());
}

function setMarkerCenetr(index){
	map.setCenter(markers[index].getPosition());
}