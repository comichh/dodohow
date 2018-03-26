var map;
var line = [];

$(function() {	
	$( "#datetimepicker1,#datetimepicker2" )
		.datetimepicker( "setDate", new Date )
		.on( "changeDate", function(ev) {
			$( "#datetimepicker1,#datetimepicker2" ).datetimepicker( "hide" );
	});
});

function initialize() {
  var mapOptions = {
	zoom: 11,
	center: new google.maps.LatLng(24.5122, 121.3344),
	mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions); 
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
			var jsonArray=eval('('+Jdata+')');
			if(jsonArray.length>0){
				var flightPlanCoordinates=[];
				var detailObj=eval(jsonArray[0].Detail);
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
				drawData();
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

function drawData(){

	$('#container').highcharts({
		chart: {
			zoomType: 'xy'
		},
		title: {
			text: ''
		},
		subtitle: {
			text: 'Source: www.runsport.com.tw'
		},
		xAxis: [{
			categories: ['1月', '2月', '3月', '4月', '5月', '6月',
				'7月', '8月', '9月', '10月', '11月', '12月']
		}],
		yAxis: [{ // Primary yAxis
			labels: {
				formatter: function() {
					return this.value +' mm';
				},
				style: {
					color: '#89A54E'
				}
			},
			title: {
				text: '高度',
				style: {
					color: '#89A54E'
				}
			},
			opposite: true

		},{ // Secondary yAxis
			gridLineWidth: 0,
			title: {
				text: '心跳',
				style: {
					color: '#4572A7'
				}
			},
			labels: {
				formatter: function() {
					return this.value;
				},
				style: {
					color: '#4572A7'
				}
			}

		}],
		tooltip: {
			shared: true
		},
		legend: {
			layout: 'vertical',
			align: 'left',
			x: 120,
			verticalAlign: 'top',
			y: 40,
			floating: true,
			backgroundColor: '#FFFFFF'
		},
		series: [{
			name: '心跳',
			type: 'spline',
			color: '#AA4643',
			yAxis: 0,
			data: [142, 143, 141, 145, 153, 168, 156, 154, 160, 176, 163, 153],
			marker: {
				enabled: false
			},
			dashStyle: 'shortdot',
			tooltip: {
				valueSuffix: ' mm'
			}

		},{
			name: '踏頻',
			color: '#89A54E',
			type: 'spline',
			yAxis: 1,
			data: [100, 95, 92, 110, 90, 85, 88, 87, 91, 100, 105, 111],
			tooltip: {
				valueSuffix: ' mm'
			}
		}]
	});

}


/*
var SportHistory = {
	drawPath : function(){
	  
	}
};
*/
