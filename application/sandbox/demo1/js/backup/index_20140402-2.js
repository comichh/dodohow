var map;
var result;
var previousID=-1;
var moveMarker;
var jumpMarker;
var ActiveMapMarker=[];
var ib = new InfoBox();
var sites=[]

function initialize() {
	var mapOptions = {
		zoom: 8,
		center: new google.maps.LatLng(25.132397, 121.644),
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
	
	google.maps.event.addListener(map, "click", function() {
		ib.close();
	});

	infowindow = new google.maps.InfoWindow({
		content: "loading..."
	});
}

function putActivityOnMap(){
	var len=result.length;
	var singleData=[];
	var zIndex=0;
	clearAllMarker();
	for(var i=0;i<len;i++){
		singleData=[];
		singleData.push(result[i].fullname);
		singleData.push(parseFloat(result[i].start_lat));
		singleData.push(parseFloat(result[i].start_lng));
		singleData.push(0);
		singleData.push('<div><img src="'+result[i].image+'" width=60 style="position:relative;top:20px;left:15px"></div>');
		createMarker(singleData, map);
	}
}

function createMarker(site, map){
	var siteLatLng = new google.maps.LatLng(site[1], site[2]);
	var marker = new google.maps.Marker({
		position: siteLatLng,
		map: map,
		icon:'./images/info.gif',
		title: site[0],
		zIndex: site[3],
		html: site[4] /* ,
		icon: "http://visualartscambridge.org/wp-content/uploads/2013/03/map-pin.png" this icon no longer available */
	});
	var boxText = document.createElement("div");
	boxText.style.cssText = "border-radius:10px; width:224px;height:258px;margin-top: 8px; background: yellow; padding: 5px;background:url(./images/big.jpg)";
	boxText.innerHTML = marker.html;

	var myOptions = {
		 content: boxText
		,disableAutoPan: false
		,maxWidth: 0
		,pixelOffset: new google.maps.Size(-140, 0)
		,zIndex: null
		,boxStyle: { 
		   background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/tags/infobox/1.1.12/examples/tipbox.gif') no-repeat"
		  ,opacity: 0.9
		  ,width: "224px"
		 }
		,closeBoxMargin: "20px 10px 20px 20px"
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
	if(previousID!==-1){
		ActiveMapMarker[previousID].setIcon('./images/info.gif');
		ActiveMapMarker[previousID].setZIndex(0);
	}
	ActiveMapMarker[index].setIcon('./images/Active_Marker.png');
	ActiveMapMarker[index].setZIndex(1000);
	previousID=index;
	
}

function selectRecord(index){
	locateMarker(index);
	if(map.getZoom()<13){
		map.setZoom(13);
	}
	map.setCenter(new google.maps.LatLng(parseFloat(result[index].start_lat),parseFloat(result[index].start_lng)));
	google.maps.event.trigger(ActiveMapMarker[index], 'click');
}

function clearAllMarker(){
	var ActiveMapMarkerLength=ActiveMapMarker.length;
	for(var i=0;i<ActiveMapMarkerLength;i++){
		ActiveMapMarker[i].setMap(null);
	}
	ActiveMapMarker=[];
}

window.onload=function(){
	initialize();
	$('#ScrollFrame').attr('src','scrollframe.php?type=0');
}