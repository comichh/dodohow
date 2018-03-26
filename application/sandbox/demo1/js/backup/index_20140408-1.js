var map;
var result;
var previousID=-1;
var moveMarker;
var jumpMarker;
var ActiveMapMarker=[];
var ib = new InfoBox();
var sites=[]
var geocoder;

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
	
	geocoder = new google.maps.Geocoder();
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
		targethtml+='<table border=0 width="98%" cellspacing=0 cellpadding=0>';
		targethtml+='	<tr><td width="30%"><div style="height:60px;position:relative;left:5px"><img style="max-height:60px" src="'+result[i].image+'" width="60"></div></td><td><div style="font-size:14px;color:#262626;font-weight:900">累積時間:783:15:36</div><div style="color:#262626;font-size:14px;font-weight:900">累積距離:265km</div><div style="color:#262626;font-size:14px;font-weight:900">最高海拔:323m</div><div style="color:#262626;font-size:14px;font-weight:900;">累積上升:156km</div><div style="position:absolute;left:200px;top:80px"><img src="./images/'+sportTypeImage+'" width="40"></div></td></tr>';
		targethtml+='	<tr><td colspan=2 height=20><div style="float:right"><img src="./images/Medals.png" /></div><div style="float:right"><img src="./images/Medals.png" /></div><div style="float:right"><img src="./images/Medals.png" /></div></td></tr>'
		targethtml+='</table>';
		targethtml+='<div style="width:94%;position:relative;left:4px;top:-8px"><table width="100%">'
		targethtml+='	<tr><td colspan="2" style="font-size:16px;color:#ffffff;font-weight:900;">'+trainName+'</td></tr>'
		targethtml+='	<tr><td valign="top"><div style="font-size:14px;color:#ffffff;height:20px">時間：'+getSportTime(result[i].lTotalTime)+'</div><div style="font-size:14px;color:#ffffff;height:20px">距離：'+getDistanceKmValue(result[i].lTotalDistance)+' km</div><div style="font-size:14px;color:#ffffff;height:20px">卡路里：'+result[i].Calory+' cal</div><div style="font-size:14px;color:#ffffff;height:20px">路段難度：★★★★★</div></td><td align="right"><img src="'+routeImageBaseUrl+'/'+result[i].id+'.jpg" style="border:1px #cecece solid" width="80"></td></tr>'
		targethtml+='</table></div>';		
		//targethtml='<div><img src="'+result[i].image+'" width=60 style="position:relative;top:20px;left:15px"></div>';
		singleData.push(targethtml);
		createMarker(singleData, map);
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
	boxText.style.cssText = "border-radius:10px; width:250px;height:300px;margin-top: 8px; background: yellow; padding: 5px;background:url(./images/big.jpg)";
	boxText.innerHTML = marker.html;

	var myOptions = {
		 content: boxText
		,disableAutoPan: false
		,maxWidth: 0
		,pixelOffset: new google.maps.Size(-140, 0)
		,zIndex: null
		,boxStyle: { 
		   background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/tags/infobox/1.1.12/examples/tipbox.gif') no-repeat"
		  //background: "url(./images/MsgboxArrow.png') no-repeat"
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
	if(typeof(ActiveMapMarker)!='undefined'){
		if(previousID!==-1){
			ActiveMapMarker[previousID].setIcon('./images/info.gif');
			ActiveMapMarker[previousID].setZIndex(0);
		}
		ActiveMapMarker[index].setIcon('./images/Active_Marker.png');
		ActiveMapMarker[index].setZIndex(1000);
		previousID=index;
	}
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
	previousID=-1;
	ib.close();
}

window.onload=function(){
	initialize();
	$('#ScrollFrame').attr('src','scrollframe.php?SearchMode=0&type=0');
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
			alert('location');
			map.setCenter(new google.maps.LatLng(parseFloat(LatlngArray[0]),parseFloat(LatlngArray[1])));
			setTimeout(function(){
				refreshScroll();
			},1000);
		}
	}else{
		geocoder.geocode( {'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
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
	var requestUrl="./scrollframe.php"
		+"?SearchMode=1"
		+"&type="+runType
		+"&NE_Lat="+NorthEastLat
		+"&NE_Lng="+NorthEastLng
		+"&SW_Lat="+SouthWestLat
		+"&SW_Lng="+SouthWestLng;
	$('#ScrollFrame').attr('src',requestUrl);
}
