var map;
var detailObj;
var line = [];
var chart;
var heartbit=[];
$(function() {	
	$( "#datetimepicker1,#datetimepicker2" )
		.datetimepicker( "setDate", new Date )
		.on( "changeDate", function(ev) {
			$( "#datetimepicker1,#datetimepicker2" ).datetimepicker( "hide" );
	});
	
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
			jsonArray=eval('('+Jdata+')');
			if(jsonArray.length>0){
				var flightPlanCoordinates=[];
				detailObj=eval(jsonArray[0].Detail);
				var bounds = new google.maps.LatLngBounds();
				$('#TotalDistance').html(jsonArray[0].TotalDistance);
				$('#Speed').html(parseInt(jsonArray[0].MaxSpeed/100));
				$('#Calory').html(jsonArray[0].Calory);
				$('#MaxHeart').html(jsonArray[0].MaxHeart);
				$('#AVGHeart').html(jsonArray[0].AvgHeart);
				$('#LapCnts').html(jsonArray[0].LapCnts);
				
				/*
				for(var index=0;index<jsonArray.length;index++){
					flightPlanCoordinates.push(new google.maps.LatLng(parseFloat(jsonArray[index].latitude), parseFloat(jsonArray[index].longitude)));
					bounds.extend(flightPlanCoordinates[index]);
				}
				*/
				
				for(var index=0;index<detailObj.length;index++){
					flightPlanCoordinates.push(new google.maps.LatLng(parseFloat(detailObj[index].latitude), parseFloat(detailObj[index].longitude)));
					bounds.extend(flightPlanCoordinates[index]);
					heartbit.push(parseInt(detailObj[index].heart_rate));
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
				redrawChart();
				drawData(heartbit);
				marker.setPosition(new google.maps.LatLng(parseFloat(detailObj[0].latitude), parseFloat(detailObj[0].longitude)))
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

function getTrainRecord(url){
	var fullUrl=url+"?deviceid="+$('#deviceID').val()+"&starttime="+$('#date_start').val()+"&endtime="+$('#date_end').val();
	$.ajax({
		url:fullUrl,
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {
			var jsonArray=eval('('+Jdata+')');
			var str='';
			if(jsonArray.length>0){
				var lengthval=jsonArray.length;
				for(var index=0;index<lengthval;index++){
					str+='<li><a tabindex="-1" href="#" onclick="getHistory(\'./common/lib/php/getdata.php\','+jsonArray[index].id+')"><div>'
						+'<h5>'+jsonArray[index].train_name+'</h5><br><h6>'+jsonArray[index].Start_time+'</h6></div></a></li>';
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

function drawData(dataArray1){

	chart = $('#container').highcharts();
	chart = new Highcharts.Chart(chart.options);
	chart.render();
	chart.series[0].setData(dataArray1);
	//chart.series[1].setData(dataArray2);
	chart.redraw();

}

function redrawChart(){
	chart = $('#container').highcharts();
	chart.series[0].setData([]);
	chart.redraw();
}

/*
var SportHistory = {
	drawPath : function(){
	  
	}
};
*/
