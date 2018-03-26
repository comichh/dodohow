var map;
var map2;
var markers = [];
var tripID="";

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
	
	$("#show_comment").click(function(){ 	
		commentByAjax(tripID);
	});
	
	//getActivityByAjax();
	getHistoryByAjax(id1,id2);
});

var searchMarker;
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
	var shareName='';
	for(var i=0;i<markers.length;i++){
		shareName='';
		if(((markers[i].getPosition().lat()>=SWLatlng.lat())&&(markers[i].getPosition().lat()<=NELatlng.lat()))
			&&((markers[i].getPosition().lng()>=SWLatlng.lng())&&(markers[i].getPosition().lng()<=NELatlng.lng()))){
			shareName=jsonTripArray[i].train_name;
			if(shareName.length>14){
				shareName=shareName.substr(0,14)+'...';		
			}
			str+='<div style="padding:2px;"><div style="padding:5px;background:#ffffff;border:1px solid #CD661D;border-radius: 0.5em 0.5em 0.5em 0.5em;"><span><img src="./images/play.jpg" onclick="setMarkerCenetr('+i+')" style="cursor:pointer;width:54px" /></span><span style="position:relative;top:-20px;left:10px"><span id="choose" class="label label-info" onclick="getHistoryByAjax('+jsonTripArray[i].id+',\''+jsonTripArray[i].deviceID+'\')" style="cursor:pointer">Detail</span>&nbsp<span style="cursor:pointer">'+shareName+'</span></span></div></div>';
		}
	}
	
	if(str==''){
		$('#activitys').html('<div style="padding:5px;background:#ffffff;height:390px"><div align="center" style="position:relative;top:20px;"><img src="./images/blueloading.gif" /></div></div>');
	}else{
		$('#activitys').html('<div id="ShareContainer" style="display:none">'+str+'</div>');
		$('#ShareContainer').fadeIn("slow");	
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

function infoDailog(index,deviceID){
	getHistoryByAjax(index,deviceID);
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
	url="./common/lib/php/GetShareTraindata.php";
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
			height=[];
			eachDistance=[];
			jsonArray=eval('('+Jdata+')');
			if(jsonArray.length>0){
				var flightPlanCoordinates=[];
				if(jsonArray[0].Detail!=''){
					//$("#myModal").modal('show');
					commentByAjax(id); 
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
					google.maps.event.addListener(marker, 'click', (function(marker, tripID, deviceID) {            
						 return function() {  
							getHistoryByAjax(tripID,deviceID);           
						 }
					})(marker, tripID, deviceID));
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

function getMetersValue(startPosition,endPosition){
	
	return google.maps.geometry.spherical.computeDistanceBetween(startPosition, endPosition);

}

function commentByAjax(tripID){  
   //$("#comment").hide();
   //$("#show_comment").click(function(){       // 顯示留言 , 會重複觸發？
     
   //$("#show_comment").bind('click',function(){       // 顯示留言 , 會重複觸發？
   //  alert (tripID);
   $("#comment").html("");                   
   $("#new_comment").hide(); 
   
   $.post('ajax/comment1.php', {tripID:tripID}, function(data){
    $("#comment").html(data);
    $("#comment").show();
	  $("[id^=reply]").click(function(){
	   content=$(".input-block-level").val();
	   id=$(this).attr("id");    
	   $.post('ajax/comment_write.php', {content:content,id:id}, function(data){
        alert (data);
        window.location.reload();
       $("#new_comment").html(data);
       $("#new_comment").show();
       $("#comment").hide();
     });
	  });

	// 巢狀回覆
	$("[id^=content_new_reply]").hide();
	$("[id^=new_reply]").click(function(){
	  id=$(this).attr("id");  
	  $("#content_"+id).show();
	  $("#"+id).hide();   
	   $("[id^=submit_new_reply]").click(function(){
			submit_id=$(this).attr("id");
			content=$("#content_"+id+" .input-block-level" ).val();  
			$.post('ajax/comment_nested_write.php', {content:content,submit_id:submit_id}, function(data){
        alert (data);
			  window.location.reload();
        $("#new_comment").html(data);
        $("#new_comment").show(data); 
        $("#comment").hide();
			});
	   });
  	});
   });
    $("#comment").show();

  //});
}
