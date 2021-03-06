var map;
var map2;
var markers = [];
var tripID="";
var societies_select="0";
//var jsonTripArray;
//var Jdata;

window.onload=function(){
	setTimeout(function(){
		getActivesFromBound();
	},1500);
};

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

	$("#SearchSpecPlace").click(function(){ 	
		codeAddress('pac-input');
	});
	

	$('#ex1').slider().on('slideStop', function(ev){
		reBoundActivity(ev.value*1000);
		//alert(ev.value);
	});
	
	$('#ex1').slider().on('slide', function(ev){
		$('#DistanceValue').html(ev.value+' km');
	});

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
                    text: '心律',
                    style: {
                        color: '#FF6347'
                    }
                }
            }, { // Secondary yAxis
				min:0,
				title: {
                    text: '速度',
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
                    text: '高度',
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
					tipstr+='<font size="1" style="color:#FF6347">心律:'+detailObj[xAxisindex].heart_rate+'</font><br>';
					tipstr+='<font size="1" style="color:#4572A7">速度:'+detailObj[xAxisindex].speed+' '+detailObj[xAxisindex].speedMeter+'</font><br>';
					tipstr+='<font size="1" style="color:#548B54">高度:'+detailObj[xAxisindex].altitude+' m</font><br>';
					tipstr+='<font size="1">踏頻:'+detailObj[xAxisindex].cadence+'</font><br>';
					return tipstr;
					/*
					alert();
					$.each(this.points, function(i, point) {
						alert(point.series.name +':'+i);
					});
					*/
					
				}
				
            },series: [{
                name: '心律',
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
                name: '速度',
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
                name: '高度',
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
	  // 社團 
  $("#societies_select").change(function(){ 	
    societies_select=$("#societies_select").find(":selected").val();
    getActivityByAjax(societies_select);        
  });
   getActivityByAjax(societies_select);         // 不會第一次進來就 load 全部資料吧？
 
  $('#FinderTab').click(function(){
	 setTimeout(function(){
		$('#Gridframe').attr("src","./sactivitylist.php");
	},500);
  });

});

function reBoundActivity(maxValue){
	var tripCount=jsonTripArray.length;
	var distance=0;
	var centerLatlng=map.getCenter();
	var eachLatlng;
	var bound = new google.maps.LatLngBounds();
	var count=0;
	for(var index=0;index<tripCount;index++){
	    eachLatlng=new google.maps.LatLng(parseFloat(jsonTripArray[index].start_lat), parseFloat(jsonTripArray[index].start_lng));
		distance=google.maps.geometry.spherical.computeDistanceBetween (centerLatlng, eachLatlng);
		if(distance<=maxValue){
			bound.extend(eachLatlng);
			count++;
		}
	}
	if(count>0){
		map.fitBounds(bound);
	}else{
		alert('指定的距離內已無任何活動');
	}	
}

var searchMarker;
var shareMarker;
var geocoder;
var activityWindow;
function initialize() {
	var mapOptions = {
		zoom: 11,
		center: new google.maps.LatLng(24.998618131714867, 121.48747852516739),
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	map2 = new google.maps.Map(document.getElementById('map-canvas2'), mapOptions);
	  
	google.maps.event.addListener(map, 'dragend', function(){ 
		getActivesFromBound();
	})
	
   activityWindow = new google.maps.InfoWindow({
      content: ""
   });
   geocoder = new google.maps.Geocoder();
   
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));

  var autocomplete = new google.maps.places.Autocomplete(input);
  // 這樣只能點取內部選項才能觸發？
  autocomplete.bindTo('bounds', map);

  google.maps.event.addListener(activityWindow, 'closeclick', function(){
	for (i=0; i<line.length; i++){                           
		line[i].setMap(null); 
	}
  });
  
  // 還要一個 user 搜尋功能  
  var infowindow = new google.maps.InfoWindow();
  searchMarker = new google.maps.Marker({
    map:map,
	icon:'./images/SearchPosition.png'
  });
  
  shareMarker = new google.maps.Marker({
	map:map2,
	icon:'./images/activity.png'
  });  

  google.maps.event.addListener(map, 'zoom_changed', function() {
	setTimeout(function(){
		getActivesFromBound();
	},500);
  });
  
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    infowindow.close();
    searchMarker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    searchMarker.setPosition(place.geometry.location);
    searchMarker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, searchMarker);
	getActivesFromBound();
  });

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  function setupClickListener(id, types) {
    var radioButton = document.getElementById(id);
    google.maps.event.addDomListener(radioButton, 'click', function() {
      autocomplete.setTypes(types);
    });
  }

}

function getActivesFromBound(){

	var NELatlng=map.getBounds().getNorthEast();
	var SWLatlng=map.getBounds().getSouthWest();
	var str='';
	var shareName='';
	var ic=0;
	for(var i=0;i<markers.length;i++){
		shareName='';
		if(((markers[i].getPosition().lat()>=SWLatlng.lat())&&(markers[i].getPosition().lat()<=NELatlng.lat()))
			&&((markers[i].getPosition().lng()>=SWLatlng.lng())&&(markers[i].getPosition().lng()<=NELatlng.lng()))){
			shareName=jsonTripArray[i].train_name;
			if(shareName.length>14){
				shareName=shareName.substr(0,14)+'...';		
			}
			//str+='<div style="padding:2px;"><div style="padding:5px;background:#ffffff;border:1px solid #CD661D;border-radius: 0.5em 0.5em 0.5em 0.5em;"><span><img src="./images/play.jpg" onclick="setMarkerCenetr('+i+')" style="cursor:pointer;width:54px" /></span><span style="position:relative;top:-20px;left:10px"><span id="choose" class="label label-info" onclick="getHistoryByAjax('+jsonTripArray[i].id+',\''+jsonTripArray[i].deviceID+'\')" style="cursor:pointer">Detail</span>&nbsp<span style="cursor:pointer">'+shareName+'</span></span></div></div>';	
			str+='<div style="padding:2px;">';
			str+='<span style="color:red">'+jsonTripArray[i].fullname+'</span>'; 
			str+='<div style="padding:5px;background:#ffffff;border:1px solid #CD661D;border-radius: 0.5em 0.5em 0.5em 0.5em;">';
			str+='<span> <img src="./upload/upload/'+jsonTripArray[i].image+'" onclick="setMarkerCenetr('+i+')" style="cursor:pointer;width:36px;height:42px" /></span>';  
			str+='<span style="position:relative;left:10px">';
			str+='<span id="choose" class="label label-info" onclick="getHistoryByAjax('+jsonTripArray[i].id+',\''+jsonTripArray[i].deviceID+'\')" style="cursor:pointer">Detail</span>&nbsp';
			str+='<span style="cursor:pointer">'+shareName+'</span>';
			if (jsonTripArray[i].train_description!=''){
				str+='( '+jsonTripArray[i].train_description+' )';
			}
			str+='</span><br><span style="position:relative;left:50px"><font style="font-size:12px">留言：</font><span class="badge badge-warning">'+jsonTripArray[i].comment_count+'</span></font></sapn>';
			str+=' (總距離: '+jsonTripArray[i].lTotalDistance/1000+' km ) ';
			str+=' (總時間: '+calHrAndMin(jsonTripArray[i].lTotalTime)+') ';
			str+='</div></div>';
			//	str+='<div style="padding:2px;"><div style="padding:5px;background:#ffffff;border:1px solid #CD661D;border-radius: 0.5em 0.5em 0.5em 0.5em;"><span><img src="./upload/upload/'+jsonTripArray[i].image+'" onclick="setMarkerCenetr('+i+')" style="cursor:pointer;width:36px;height:42px" /></span><span style="position:relative;left:10px"><span id="choose" class="label label-info" onclick="getHistoryByAjax('+jsonTripArray[i].id+',\''+jsonTripArray[i].deviceID+'\')" style="cursor:pointer">Detail</span>&nbsp<span style="cursor:pointer">'+shareName+'</span></span><div style="position:relative;left:50px"><font style="font-size:12px">留言：</font><span class="badge badge-warning">'+jsonTripArray[i].comment_count+'</span></font></div></div></div>';
			ic++;
		}
	}
	
	if(str==''){
		$('#activitys').html('<div style="padding:5px;background:#ffffff;height:490px"><div align="center" style="position:relative;top:20px;"><img src="./images/blueloading.gif" /></div></div>');
	}else{
		$('#activitys').html('<div id="ShareContainer" style="display:none">'+str+'</div>');
		$('#ShareContainer').fadeIn("slow");	
	}
}

/*
function getActivesFromBound_new(Jdata1){
console.log ("原來字串"+Jdata1);
var jsonTripArray1=eval('('+Jdata1+')');
console.log ("轉成物件後，物件內容取不出來？"+jsonTripArray1);
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
			//str+='<div style="padding:2px;"><div style="padding:5px;background:#ffffff;border:1px solid #CD661D;border-radius: 0.5em 0.5em 0.5em 0.5em;"><span><img src="./images/play.jpg" onclick="setMarkerCenetr('+i+')" style="cursor:pointer;width:54px" /></span><span style="position:relative;top:-20px;left:10px"><span id="choose" class="label label-info" onclick="getHistoryByAjax('+jsonTripArray[i].id+',\''+jsonTripArray[i].deviceID+'\')" style="cursor:pointer">Detail</span>&nbsp<span style="cursor:pointer">'+shareName+'</span></span></div></div>';	
	str+='<div style="padding:2px;">';
  str+='<span style="color:red">'+jsonTripArray[i].fullname+'</span>'; 
  str+='<div style="padding:5px;background:#ffffff;border:1px solid #CD661D;border-radius: 0.5em 0.5em 0.5em 0.5em;">';
  str+='<span> <img src="./upload/upload/'+jsonTripArray[i].image+'" onclick="setMarkerCenetr('+i+')" style="cursor:pointer;width:36px;height:42px" /></span>';  
  str+='<span style="position:relative;left:10px">';
  str+='<span id="choose" class="label label-info" onclick="getHistoryByAjax('+jsonTripArray[i].id+',\''+jsonTripArray[i].deviceID+'\')" style="cursor:pointer">Detail</span>&nbsp';
  str+='<span style="cursor:pointer">'+shareName+'</span>';
  str+='</span><br><span style="position:relative;left:50px"><font style="font-size:12px">留言：</font><span class="badge badge-warning">'+jsonTripArray[i].comment_count+'</span></font></sapn></div></div>';

//	str+='<div style="padding:2px;"><div style="padding:5px;background:#ffffff;border:1px solid #CD661D;border-radius: 0.5em 0.5em 0.5em 0.5em;"><span><img src="./upload/upload/'+jsonTripArray[i].image+'" onclick="setMarkerCenetr('+i+')" style="cursor:pointer;width:36px;height:42px" /></span><span style="position:relative;left:10px"><span id="choose" class="label label-info" onclick="getHistoryByAjax('+jsonTripArray[i].id+',\''+jsonTripArray[i].deviceID+'\')" style="cursor:pointer">Detail</span>&nbsp<span style="cursor:pointer">'+shareName+'</span></span><div style="position:relative;left:50px"><font style="font-size:12px">留言：</font><span class="badge badge-warning">'+jsonTripArray[i].comment_count+'</span></font></div></div></div>';

		}
	}
	
	if(str==''){
		$('#activitys').html('<div style="padding:5px;background:#ffffff;height:490px"><div align="center" style="position:relative;top:20px;"><img src="./images/blueloading.gif" /></div></div>');
	}else{
		$('#activitys').html('<div id="ShareContainer" style="display:none">'+str+'</div>');
		$('#ShareContainer').fadeIn("slow");	
	}
}
*/

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

//function getHistoryByAjax(id,deviceID){
	/*
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
					$("#myModal").modal('show');
					//commentByAjax(id); 
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
*/

var detailObj=[];
var heartbit=[];
var speed=[];
var	height=[];
var	eachDistance=[];
var	line=[];

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
			heartbit=[];
			speed=[];
			height=[];
			eachDistance=[];
			jsonArray=eval('('+Jdata+')');
			$("#comment").hide();
			activityWindow.close();
			if(jsonArray.length>0){
				var flightPlanCoordinates=[];
				if(jsonArray[0].Detail!=''){
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
					$('#TotalDistance').html(jsonArray[0].TotalDistance);
					$('#Totaltime').html(calHrAndMin(jsonArray[0].TotalTime));
					$('#Calory').html(jsonArray[0].Calory);
					$('#Speed').html(parseInt(jsonArray[0].MaxSpeed/100));
					$('#MaxHeart').html(jsonArray[0].MaxHeart+"/"+jsonArray[0].AvgHeart);
					if(jsonArray[0].LapCnts==''){
						//alert();
						$('#LapCnts').html('--');
					}else{
						$('#LapCnts').html(jsonArray[0].LapCnts);
					}
					
					$('#Height').html(jsonArray[0].MaxAlti+"/"+jsonArray[0].MinAlti);
					/*
					for(var index=0;index<jsonArray.length;index++){
						flightPlanCoordinates.push(new google.maps.LatLng(parseFloat(jsonArray[index].latitude), parseFloat(jsonArray[index].longitude)));
						bounds.extend(flightPlanCoordinates[index]);
					}
					*/
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
					
					//var popover = $('#AdversSuggest').data('popover');
					//popover.options.content = "依據您的數據來分析，您一開始似乎跑得很快，接著便體力耗竭而停了下來，所以建議您剛開始跑步時，要用時間代替距離作為跑步的測量單位，一次約20分鐘，一旦你以時間作為規範，就比較容易穩定下來，不會越跑越快，這樣比較不會因為疲憊或太喘而無法持續。當你覺得20分鐘跑起來相當輕鬆，就可以5分鐘為單位慢慢往上加,如果是新手跑者，建議單次所跑的距離還是以短距離為主，但盡量讓次數增加，舉例來說，如果一個星期要跑20km，就將它分成跑四次5km。因為不習慣跑長距離的人，一下子就跑長程的話，很容易讓疲勞殘留在體內，甚至可能造成身體狀態崩盤";
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
/*
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
*/
var jsonTripArray;
function getActivityByAjax(societies_select){
//$('#activitys').html('<div style="padding:5px;background:#ffffff;height:490px"><div align="center" style="position:relative;top:20px;"><img src="./images/blueloading.gif" /></div></div>');
//getActivesFromBound();    //  有資料的時候，無法清空數據，物件找不到。 Jdata 傳回值已經正確了
	url="./common/lib/php/GetShareActivity.php?societies_select="+societies_select;
	var fullUrl=url;
	$.ajax({
		url:fullUrl,
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {
      //console.log (Jdata);
			jsonTripArray=eval('('+Jdata+')');
      //console.log (jsonTripArray);
			if(jsonTripArray.length>0){
				var totalcount=jsonTripArray.length;
				var tripID='';
				var deviceID;
				var imageName='';
				var trainName='';
				var fullname='';
				var lTotalDistance='';
				var lTotalTime='';
				for(var i=0;i<totalcount;i++){             
					tripID=jsonTripArray[i].id;
					deviceID=jsonTripArray[i].deviceID;
					fullname=jsonTripArray[i].fullname;
					imageName=jsonTripArray[i].image;
					trainName=jsonTripArray[i].train_name;
					lTotalDistance=jsonTripArray[i].lTotalDistance;
					lTotalTime=jsonTripArray[i].lTotalTime;
					var marker = new google.maps.Marker({
						position: new google.maps.LatLng(parseFloat(jsonTripArray[i].start_lat), parseFloat(jsonTripArray[i].start_lng)),
						map: map,
						title:jsonTripArray[i].train_name,
						icon:'./images/map_activity.png'
					});
					google.maps.event.addListener(marker, 'click', (function(marker, tripID, deviceID,imageName,trainName,fullname,lTotalDistance,lTotalTime) {            
						 return function() {  
							map.setCenter(marker.getPosition());
							//activityWindow.setContent('<table width="200" height=60 border=1><tr><td colspan=2 height=10><span>'+lTotalDistance+"<p>1234</p></span><span><font style=\"font-size:10px;font-family:verdana;font-weight:900;\">"+calHrAndMin(lTotalTime)+'</font></span></td></tr><tr><td><img src="./upload/upload/'+imageName+'" width="64" height="48" style="border:1px #cecece solid"></td></tr><tr><td>'+fullname+'</td></tr><tr><td>'+trainName+'</td></tr><tr><td><span class="badge badge-success" style="cursor:pointer;" onclick="getHistoryByAjax('+tripID+',\''+deviceID+'\')">詳細資料</span></td></tr></table>');
							activityWindow.setContent('<div style=\"width:200px;height:120px\"><div style=\"width:98%;background:#cfcfcf\"><img src="./upload/upload/'+imageName+'" style="border:1px #cecece solid;width:72px;height:54px">'+trainName+'</div><div style=\"font-size:10px;font-family:verdana;font-weight:900;\">'+parseFloat(lTotalDistance/1000)+"公里</font>&nbsp;&nbsp;&nbsp;&nbsp;<font style=\"font-size:10px;font-family:verdana;font-weight:900;\">"+calHrAndMin(lTotalTime)+'</font></div><div><span class="badge badge-success" style="cursor:pointer;" onclick="getHistoryByAjax('+tripID+',\''+deviceID+'\')">詳細資料</div></div>');
							activityWindow.open(map,marker);
							getRouteByAjax(tripID,deviceID);
							//getHistoryByAjax(tripID,deviceID);           
						 }
					})(marker, tripID, deviceID,imageName,fullname,trainName,lTotalDistance,lTotalTime));
					markers.push(marker);

  //          getActivesFromBound_new(Jdata);           // 不行，會抓不到定義？
			$('#activitys').show('');     // 沒有資料的時候，先這樣處理吧

				}
			}else{
				alert('no data in this trip');
			$('#activitys').hide('');

			}
			$('#Startloading').hide();  // 沒有資料的時候，先這樣處理吧
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

function mapFitBound(){
	map.fitBounds(totalBound);
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

function codeAddress(addressFieldName) {
  var address = document.getElementById(addressFieldName).value;
  geocoder.geocode( {'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      searchMarker.setPosition(results[0].geometry.location);
      searchMarker.setVisible(true);
	  /*
	  var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
	  */
	  //getActivesFromBound();
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function getRouteByAjax(id,deviceID){
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
			jsonArray=eval('('+Jdata+')');
			$("#comment").hide();
			if(jsonArray.length>0){
				var flightPlanCoordinates=[];
				if(jsonArray[0].Detail!=''){
					detailObj=eval(jsonArray[0].Detail);
					//var bounds = new google.maps.LatLngBounds();
					for(var index=0;index<detailObj.length;index++){
						flightPlanCoordinates.push(new google.maps.LatLng(parseFloat(detailObj[index].latitude), parseFloat(detailObj[index].longitude)));
						//bounds.extend(new google.maps.LatLng(parseFloat(detailObj[index].latitude), parseFloat(detailObj[index].longitude)));
					}
					flightPath = new google.maps.Polyline({
						path: flightPlanCoordinates,
						geodesic: true,
						strokeColor: '#FF0000',
						strokeOpacity: 1.0,
						strokeWeight: 3
					});
					flightPath.setMap(map);
					line.push(flightPath);
					//var popover = $('#AdversSuggest').data('popover');
					//popover.options.content = "依據您的數據來分析，您一開始似乎跑得很快，接著便體力耗竭而停了下來，所以建議您剛開始跑步時，要用時間代替距離作為跑步的測量單位，一次約20分鐘，一旦你以時間作為規範，就比較容易穩定下來，不會越跑越快，這樣比較不會因為疲憊或太喘而無法持續。當你覺得20分鐘跑起來相當輕鬆，就可以5分鐘為單位慢慢往上加,如果是新手跑者，建議單次所跑的距離還是以短距離為主，但盡量讓次數增加，舉例來說，如果一個星期要跑20km，就將它分成跑四次5km。因為不習慣跑長距離的人，一下子就跑長程的話，很容易讓疲勞殘留在體內，甚至可能造成身體狀態崩盤";
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



function commentByAjax(tripID){  
   $("#comment").html("");                   
   $("#new_comment").hide();    
   $.post('ajax/comment1.php', {tripID:tripID}, function(data){
    $("#comment").html(data);
    $("#comment").show();
	  $("[id^=reply]").click(function(){
	   content=$(".input-block-level").val();
	   id=$(this).attr("id");    
	   $.post('ajax/comment_write.php', {content:content,id:id}, function(data){
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
        $("#new_comment").html(data);
        $("#new_comment").show(data); 
        $("#comment").hide();
			});
	   });
  	});
 // 刪除
	 $("[id^=kill]").click(function(){
      submit_id=$(this).attr("id");
     	$.post('ajax/comment_kill.php', {submit_id:submit_id}, function(data){
        $("#new_comment").html(data);
        $("#new_comment").show(data); 
        $("#comment").hide(); 
      }); 
    });
   });
     $("#comment").show();
}
