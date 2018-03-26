var map;
var detailObj;
var line = [];
var chart;
var heartbit=[];
var speed=[];
var height=[];
var eachDistance=[];
var totalBound;
var maploaded=false;
var TrendTriggered=false;
var activityID;
var itemRowIndex=-1;
var mapSize=1;
$(function() {	
	$( "#datetimepicker1,#datetimepicker2" )
		.datetimepicker( "setDate", new Date )
		.on( "changeDate", function(ev) {
			$( "#datetimepicker1,#datetimepicker2" ).datetimepicker( "hide" );
	});
	
	$("#ResizeMap").click(function( event ) {
	   resizeMapHeight();
	   event.stopPropagation();
	});
	
	$("#UpdatePhoto").click(function( event ) {
	   event.stopPropagation();
	});
	
	$("#UploadPhoto").click(function( event ) {
	   event.stopPropagation();
	});
	
	$("#deviceID" ).change(function() {
	   getTrainRecord('./common/lib/php/GetTrain.php',false);
	});
	// 訓練紀錄，詳細資料更新



	$('#UpdateSettings').click(function(){
		var statu;
		var societies=$('#ShareGroupList').val();   
		if ($("#ShareMyRouteToGroup").prop('checked') && societies=='0' ){
  			statu=1;        
		}else{
			statu=0;
		}
		var getRouteImgLink=getenc();
		var lastIndex=detailObj.length-1;
		$.ajax({
			url:'./common/lib/php/UpdateSportSettings.php',
			type:'POST',
			data:'TrainID='+activityID+'&SportName='+encodeURIComponent($('#ActivityName').val())
					+'&statu='+statu+'&societies='+societies+'&slat='+detailObj[0].latitude+'&slng='+detailObj[0].longitude
					+'&elat='+detailObj[lastIndex].latitude+'&elng='+detailObj[lastIndex].longitude+'&desc='+$('#Description').val()
					//+"&sporttype="+$('#SelectSportType').val(),
					+"&sporttype="+$('#SelectSportType').val()+"&imgsrc="+encodeURIComponent(getRouteImgLink),
			success: function(response) {
				$('#Activity_'+activityID).html(response);
				if(statu==0){
					$('#shareImage_'+activityID).html('');
				}else{
					$('#shareImage_'+activityID).html('<img src="./images/share.png" width=24 />');
				}
				$('#SportDescription').html($('#Description').val());
				trainItem[itemRowIndex].train_name=$('#ActivityName').val();
				trainItem[itemRowIndex].train_description=$('#Description').val();
				trainItem[itemRowIndex].sport_type=parseInt($('#SelectSportType').val());
				trainItem[itemRowIndex].train_public_access=statu;
			
			},
			error: function() {
				alert("ERROR!!! by UpdateSettings click()");
			}
		});
		
	});
	
	$('#DeleteActivity').click(function(){
		deleteThisActivity();
	});
	
	
	$('.ActivityImg').click(function(){
		 alert('1');
		 event.stopPropagation();
	});
	/*
	 $('#container').highcharts({
            chart: {
                type: 'spline'
            },
			title: {
                text: '',
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
				title: {
                    text: '(bits)'
                },
				labels: {
					format: '{value} bits'
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
					return this.y;
					//return '<font size="1">里程:'+Math.round(this.x)/1000+' 公里</font><br><font size="1">海拔:'+parseInt(this.y)+' 公尺</font>';
				}
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: '心跳',
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
								mouseOver: function() {
									var latLng=new google.maps.LatLng(parseFloat(detailObj[this.x].latitude), parseFloat(detailObj[this.x].longitude));
									marker.setPosition(latLng)
								},
								select: function() {
									
								},
								unselect:function(){
									
								}
							}
						}
				}
			}
        });
		*/
		
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
            //subtitle: {
            //    text: 'Source: sport4u sport for you'
            //},
			 xAxis: {
				categories: [],
				labels: {
					format: '{value} '
				},
				tickInterval: 200,
            },
            yAxis: [{ // Primary yAxis
				//min:0,
				labels: {
                    format: '{value} bits',
                    style: {
                        color: '#FF6347'
                    }
                },
                title: {
                    text: '',
                    style: {
                        color: '#FF6347'
                    }
                }
            }, { // Secondary yAxis
				//min:0,
				title: {
                    text: '',
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
				//max:2000,
				title: {
                    text: '',
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
            },{
                name: '橫軸(距離Km)',
                color: '#548B54',
                type: '',          
            },{
                name: '橫軸(時間 hour)，示意，未完成',
                color: '#548B54',
                type: '',          
            }  
],
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
									marker.setPosition(latLng);
									checkBounds(latLng);
								},
								select: function() {
									var latLng=new google.maps.LatLng(parseFloat(detailObj[this.x].latitude), parseFloat(detailObj[this.x].longitude));
									map.setCenter(latLng);
									map.setZoom(17);
								},
								unselect:function(){
									
								}
							}
						}
				}
			}
        });

				
		getUserDevice();
		
});
var marker;
var infowindow;
function initialize() {
  var mapOptions = {
	zoom: 11,
	center: new google.maps.LatLng(24.5122, 121.3344),
	mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
  
  marker = new google.maps.Marker({
	map:map,
	icon:'./images/activity.png'
  });

  infowindow = new google.maps.InfoWindow({});
  
}

function getHistory(url,getID,index){
	$('#Startloading').show();
	setSpecActivityOnSelect(getID,index);
	setTimeout(function(){
		getHistoryByAjax(url,getID);
	},1000);
}

function formatFloat(num, pos)
{
  var size = Math.pow(10, pos);
  return Math.round(num * size) / size;
}

function getHistoryByAjax(url,getID){
	var fullUrl=url+"?tripID="+getID+"&deviceID="+$('#deviceID').val();
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
			if(jsonArray.length>0){
				var flightPlanCoordinates=[];
			 	if(jsonArray[0].Detail!=''){
					$('#UploadPhoto').attr('href','./sandbox/FileUpload/index.php?tripID='+getID);
					$('#UpdateArea').show();
					detailObj=eval(jsonArray[0].Detail);
					if(parseInt(jsonArray[0].PhotoCount)>0){
						$('#SportGallery').attr('src','gallery.php?tripID='+getID+'&startlat='+detailObj[0].latitude+'&startlng='+detailObj[0].longitude);
					}else{
						$('#SportGallery').attr('src','');
					}
					$('#SportLapData').attr('src','SportLapData.php?train_data_key='+getID+'&deviceID='+$('#deviceID').val());
					$('#PhotoManagement').attr('href','./sandbox/FileUpload/index.php?tripID='+getID);
					
					var bounds = new google.maps.LatLngBounds();
					$('#TotalDistance').html(jsonArray[0].TotalDistance/1000);
					$('#Totaltime').html(calHrAndMin(jsonArray[0].TotalTime));
					$('#Calory').html(jsonArray[0].Calory);
					var ave_speed=jsonArray[0].TotalDistance*36000/1000/jsonArray[0].TotalTime;
					ave_speed= formatFloat(ave_speed,2);              
					$('#Speed').html( formatFloat (jsonArray[0].MaxSpeed/100,2)   +" / "+ave_speed);
					$('#MaxHeart').html(jsonArray[0].MaxHeart+" / "+jsonArray[0].AvgHeart);
					$('#LapCnts').html(jsonArray[0].LapCnts);
					$('#Height').html(jsonArray[0].MaxAlti+"/"+jsonArray[0].MinAlti);
					$('#CadnsValue').html(jsonArray[0].BestCadns+" / "+jsonArray[0].AvgCadns);
					$('#PowerValue').html(jsonArray[0].MaxPower+" / "+jsonArray[0].AvgPower);
					$('#Ascent').html(jsonArray[0].Ascent);
					$('#Descent').html(jsonArray[0].Descent);
					$("#SportDescription").html(jsonArray[0].Description);
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
					flightPath.setMap(map);
					line.push(flightPath);
					map.fitBounds(bounds);
					totalBound=bounds;
					marker.setPosition(new google.maps.LatLng(parseFloat(detailObj[0].latitude), parseFloat(detailObj[0].longitude)))
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

function getTrainRecord(url,withDate){
	$('#LoadTripItems').show();
	setTimeout(function(){
		getHistoryItemByAjax(url,withDate);
	},1000);
}
var trainItem;
function getHistoryItemByAjax(url,withDate){
	if(withDate){
		var fullUrl=url+"?deviceid="+$('#deviceID').val()+"&starttime="+$('#date_start').val()+"&endtime="+$('#date_end').val();
	}else{
		var fullUrl=url+"?deviceid="+$('#deviceID').val();
	}
	$.ajax({
		url:fullUrl,
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {
			var jsonArray=eval('('+Jdata+')');
			trainItem=jsonArray;
			var str='';
			if(jsonArray.length>0){
				var lengthval=jsonArray.length;
				//var showstr=jsonArray[index].train_name;
				//if(showstr.length>6){
				//	showstr=jsonArray[index].train_name.substr(0,6)+'...';
				//}
				str+='<div style="width:99%;max-height:320px;overflow:scroll;overflow-x:hidden;">';
				str+='<ul id="TrainList" class="nav nav-list" style="width:100%;max-height:240px;">';
				//str+='<li class="nav-header"></li>';
				var shareRoute;
				var shareMyRecord;
				var sharePhoto;
				var shareImage;
				for(var index=0;index<lengthval;index++){
					shareRoute=false;
					shareMyRecord=false;
					sharePhoto=false;
					shareImage='';
					train_names=jsonArray[index].train_name;
					if(jsonArray[index].train_public_access=='1'){
						shareRoute=true;
						shareImage='<img src="./images/share.png" width=24>';
					}	
					str+='<li style="width:100%;border-top:1px solid #ccc;cursor:pointer" id="list_'+index+'" onclick="getHistory(\'./common/lib/php/getdata.php\','+jsonArray[index].id+','+index+')">'
						+'<table style="width:100%;height:60px" cellapdding=0 cellspacing=0><tr><td><img id="img_"'+index+'" src="./images/activity.png" onclick="openDialog('+jsonArray[index].id+','+index+','+shareRoute+','+shareMyRecord+','+sharePhoto+')"></td></td><td width="92%" style="font-size:12px;font-family: verdana;font-weight:bold;" width="80%"><div id="Activity_'+jsonArray[index].id+'_Time" style="padding:1px">'+jsonArray[index].Start_time+'</div><div id="Activity_'+jsonArray[index].id+'">'+train_names+'</div><span id="shareImage_'+jsonArray[index].id+'" style="padding:1px">'+shareImage+'</span></td></tr></table></li>';
						
				}
				str+='</ul>';
				str+='</div>';
				$('#TransContent').html(str);
			}else{
				alert('no data in this trip');
			}
			$('#LoadTripItems').hide();
		},
		error: function() {
			alert("ERROR!!! by getDataByJSON()");
			$('#LoadTripItems').hide();
		}
	});
}

function drawData(dataArray1,dataArray2,dataArray3,dataArray4){

	chart = $('#container').highcharts();
	chart.options.xAxis[0].categories=dataArray4;
	var chareWidth=parseInt($('#accordion').css('width').replace("px",""));
	chart.options.chart.width=chareWidth;
	chart = new Highcharts.Chart(chart.options);
	chart.render();
    chart.series[0].setData(dataArray1,false);
	chart.series[1].setData(dataArray2,false);
	chart.series[2].setData(dataArray3,false);
	chart.redraw();
}

function mapFitBound(){
	map.fitBounds(totalBound);
}

function checkBounds(latlng) {    
    var latitude=latlng.lat();
	var longitude=latlng.lng();
	var mapBound=map.getBounds();
	var latDiff=0.0001;
	var lngDiff=0.0003;
	var AmaxX = mapBound.getNorthEast().lng()-lngDiff;
	var AmaxY = mapBound.getNorthEast().lat()-lngDiff;
	var AminX = mapBound.getSouthWest().lng()+latDiff;
	var AminY = mapBound.getSouthWest().lat()+latDiff;

	if((latitude<AminY)||(latitude>AmaxY)||(longitude<AminX)||(longitude>AmaxX)){
		map.panTo(new google.maps.LatLng(latitude,longitude));
	} 
}

// 運動紀錄詳細設定，拋回 html。sql 來源資料 GetTrain.php
function openDialog(ID,index,routeShare,recordShare,photoShare){
	activityID=ID;
	$("#ActivityDatetime").html($("#Activity_"+ID+"_Time").html());
	$("#ActivityName").val(trainItem[index].train_name);
	$("#Description").val(trainItem[index].train_description);
	$("#SelectSportType").val(parseInt(trainItem[index].sport_type));
		
	if(trainItem[index].train_public_access==1){
		$("#ShareMyRouteToGroup").prop('checked', true);
	}else{
		$("#ShareMyRouteToGroup").prop('checked', false);
	}

	$("#myModal").modal('show');
	setSpecActivityOnSelect(ID,index);
}

function setSpecActivityOnSelect(ID,index){
	if(itemRowIndex!=-1){
		$('#list_'+itemRowIndex).css("background",'');
	}
	activityID=ID;
	itemRowIndex=index;
	$('#list_'+index).css("background","#E0EEE0");
}

function deleteThisActivity(){
	if(itemRowIndex==-1){
		alert('請先點選要刪除的活動');
	}else{
		if(confirm("確定要刪除 "+$('#Activity_'+activityID).html()+" 活動記錄?" )){ 
			$.ajax({
				url:'./common/lib/php/DeleteTrain.php',
				type:'POST',
				data:'trainID='+activityID,
				success: function(response){
					if(response=='1'){
						$('#list_'+itemRowIndex).html('');
						itemRowIndex=-1;
					}
				},
				error: function() {
					alert("ERROR!!! by UpdateSettings click()");
				}
			});
		}
	}	
}

function getUserDevice(){
	$.ajax({
		url:'./common/lib/php/GetDeviceList.php',
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {
			var jsonArray=eval('('+Jdata+')');
			var totalcount=jsonArray.length;
			var str='';
			var deviceName='';
			if(totalcount>0){
				for(var index=0;index<totalcount;index++){
					if(jsonArray[index].displayname==''){
						deviceName=jsonArray[index].deviceid;
					}else{
						deviceName=jsonArray[index].displayname;
					}
					str+='<option value="'+jsonArray[index].deviceid+'">'+deviceName+'</option>';
				}
				$("#deviceID").html(str);
				setTimeout(function(){
					getTrainRecord('./common/lib/php/GetTrain.php',false);
				},500);	
			}
		},
		error: function() {
			alert("ERROR!!! by getDataByJSON()");
			$('#Startloading').hide();
		}
	});
}

function resizeMapHeight(){
	switch(mapSize){
		case 0:
			$('#map-canvas').css('height','640px');
			mapSize=1;
			break;
		case 1:
			$('#map-canvas').css('height','320px');
			mapSize=0;
			break;
	}
	google.maps.event.trigger(map,"resize");
}

function setMapCenterByImage(lat,lng,imageUrl){
	var latlng=new google.maps.LatLng(parseFloat(lat),parseFloat(lng))
	map.setCenter(latlng);
	infowindow.setContent("<img src='"+imageUrl+"' width=72 />");
	infowindow.setPosition(latlng);
	infowindow.open(map);
}

function closeInfoWindow(){
	infowindow.close();
}

function getenc(){
	var countLimit=400;
	var detailCount=detailObj.length;
	//--- 算出的除數四捨五入進位，而除數不可為零 -----
	var divValue=Math.round(detailCount/400);
	if(divValue==0)	divValue=1	
	//------------------------------------------------
	var pointIndex=0;
	var modValue=0;
	var points = new Array();
	for(var index=0;index<detailObj.length;index++){
		modValue=index%divValue;
		if(modValue==0){
			points[pointIndex]=new google.maps.LatLng(parseFloat(detailObj[index].latitude), parseFloat(detailObj[index].longitude));
			pointIndex+=1;
		}
	}
	return GoogleMapSrv.StaticMap.getStaticMapImageUrl(points);
}

/*
var SportHistory = {
	drawPath : function(){
	  
	}
};
*/
