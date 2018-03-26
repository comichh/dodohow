var map;
var detailObj;
var line = [];
var chart;
var heartbit=[];
var speed=[];
var totalBound;
var maploaded=false;
var TrendTriggered=false;
$(function() {	
	$( "#datetimepicker1,#datetimepicker2" )
		.datetimepicker( "setDate", new Date )
		.on( "changeDate", function(ev) {
			$( "#datetimepicker1,#datetimepicker2" ).datetimepicker( "hide" );
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
            },
            },
            title: {
                text: 'sport4u.pro'
            },
            subtitle: {
                text: 'Source: sport4u sport for you'
            },
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value} bits',
                    style: {
                        color: '#FF6347'
                    }
                },
                title: {
                    text: 'Heartbits',
                    style: {
                        color: '#FF6347'
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: 'Speed',
                    style: {
                        color: '#4572A7'
                    }
                },
                labels: {
                    format: '{value} kph',
                    style: {
                        color: '#4572A7'
                    }
                },
                opposite: true
            }],
            tooltip: {
                crosshairs: true,
				shared: true,
				formatter: function() {
					var tipstr='<font size="1">'+detailObj[this.x].start_time+'</font><br>';
					tipstr+='<font size="1" style="color:#FF6347">心律:'+detailObj[this.x].heart_rate+'</font><br>';
					tipstr+='<font size="1" style="color:#4572A7">速度:'+detailObj[this.x].speed+' '+detailObj[this.x].speedMeter+'</font><br>';
					tipstr+='<font size="1">高度:'+detailObj[this.x].altitude+'</font><br>';
					tipstr+='<font size="1">踏頻:'+detailObj[this.x].cadence+'</font><br>';
					return tipstr;
				}
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: -10,
                verticalAlign: 'top',
                y: -10,
                floating: true,
                backgroundColor: '#FFFFFF'
            },
            series: [ {
                name: 'heartbits',
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
                name: 'Speed',
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
									marker.setPosition(latLng);
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
		getTrainRecord('./common/lib/php/GetTrain.php',false);
});
var marker;
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
}

function getHistory(url,getID){
	
	var fullUrl=url+"?tripID="+getID;
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
			jsonArray=eval('('+Jdata+')');
			if(jsonArray.length>0){
				var flightPlanCoordinates=[];
				detailObj=eval(jsonArray[0].Detail);
				var bounds = new google.maps.LatLngBounds();
				$('#TotalDistance').html(jsonArray[0].TotalDistance+" m");
				$('#Totaltime').html(calHrAndMin(jsonArray[0].TotalTime));
				$('#Calory').html(jsonArray[0].Calory+" cal");
				$('#Speed').html(parseInt(jsonArray[0].MaxSpeed/100)+" km/hr");
				$('#MaxHeart').html(jsonArray[0].MaxHeart+"/"+jsonArray[0].AvgHeart+" bit");
				$('#LapCnts').html(jsonArray[0].LapCnts+" lap");
				$('#Height').html(jsonArray[0].MaxAlti+"/"+jsonArray[0].MinAlti+" m");
				
				/*
				for(var index=0;index<jsonArray.length;index++){
					flightPlanCoordinates.push(new google.maps.LatLng(parseFloat(jsonArray[index].latitude), parseFloat(jsonArray[index].longitude)));
					bounds.extend(flightPlanCoordinates[index]);
				}
				*/
				
				for(var index=0;index<detailObj.length;index++){
					flightPlanCoordinates.push(new google.maps.LatLng(parseFloat(detailObj[index].latitude), parseFloat(detailObj[index].longitude)));
					bounds.extend(new google.maps.LatLng(parseFloat(detailObj[index].latitude), parseFloat(detailObj[index].longitude)));
					heartbit.push(parseInt(detailObj[index].heart_rate));
					speed.push(parseFloat(detailObj[index].speed));
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
				drawData(heartbit,speed);
				
				var popover = $('#AdversSuggest').data('popover');
				popover.options.content = "依據您的數據來分析，您一開始似乎跑得很快，接著便體力耗竭而停了下來，所以建議您剛開始跑步時，要用時間代替距離作為跑步的測量單位，一次約20分鐘，一旦你以時間作為規範，就比較容易穩定下來，不會越跑越快，這樣比較不會因為疲憊或太喘而無法持續。當你覺得20分鐘跑起來相當輕鬆，就可以5分鐘為單位慢慢往上加,如果是新手跑者，建議單次所跑的距離還是以短距離為主，但盡量讓次數增加，舉例來說，如果一個星期要跑20km，就將它分成跑四次5km。因為不習慣跑長距離的人，一下子就跑長程的話，很容易讓疲勞殘留在體內，甚至可能造成身體狀態崩盤";
				$('#ReportTitle').show();
				//setJsonObject(detailObj);
			}else{
				alert('no data in this trip');
			}
		},
		error: function() {
			alert("ERROR!!! by getDataByJSON()");
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
			var str='<li class="nav-header">我的運動記錄</li>';
			if(jsonArray.length>0){
				var lengthval=jsonArray.length;
				//var showstr=jsonArray[index].train_name;
				//if(showstr.length>6){
				//	showstr=jsonArray[index].train_name.substr(0,6)+'...';
				//}
				for(var index=0;index<lengthval;index++){
					str+='<li><a href="#" onclick="getHistory(\'./common/lib/php/getdata.php\','+jsonArray[index].id+')">'
						+'<h6>'+jsonArray[index].Start_time+' &nbsp;&nbsp;'+jsonArray[index].train_name+'</h6></a></li>';
				}
				$('#TrainList').html(str);
			}else{
				alert('no data in this trip');
			}
		},
		error: function() {
			alert("ERROR!!! by getDataByJSON()");
		}
	});
}

function drawData(dataArray1,dataArray2){

	chart = $('#container').highcharts();
	chart.series[0].setData(dataArray1,false);
	chart.series[1].setData(dataArray2,false);
	chart.redraw();

}


/*
var SportHistory = {
	drawPath : function(){
	  
	}
};
*/
