var map;
var serachMap;
var maploaded=false;
var mapForSearchloaded=false;
$(function() {
	$('#myTab a').click(function (e) {
		switch($(e.target).attr("href")){
			case "#profile":
				if(!maploaded){
					setTimeout(function(){
						initialize();
					},500);
				}
				break;
			case "#SearchNearBy":
				
				if(!mapForSearchloaded){
					setTimeout(function(){
						MapForsearch();
					},500);
				}
				
				break;
			default:
				break;
		}
	});
	
	$("#TypeChar").msgPlay({
		speed: 10 
	});
	
	$('#container').highcharts({
			chart: {
				zoomType: 'xy'
			},
			title: {
				text: '年平均體質狀況表'
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
					text: '血壓值',
					style: {
						color: '#89A54E'
					}
				},
				opposite: true
	
			}, { // Secondary yAxis
				gridLineWidth: 0,
				title: {
					text: '體重',
					style: {
						color: '#4572A7'
					}
				},
				labels: {
					formatter: function() {
						return this.value +' kg';
					},
					style: {
						color: '#4572A7'
					}
				}
	
			}, { // Tertiary yAxis
				gridLineWidth: 0,
				title: {
					text: 'Sea-Level Pressure',
					style: {
						color: '#AA4643'
					}
				},
				labels: {
					formatter: function() {
						return this.value +' mm';
					},
					style: {
						color: '#AA4643'
					}
				},
				opposite: true
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
				name: '體重',
				color: '#4572A7',
				type: 'column',
				yAxis: 1,
				data: [82, 83.5, 87, 88, 85.3, 84.3, 85.3, 82.3, 79.5, 81.3, 80.2, 78.5],
				tooltip: {
					valueSuffix: ' kg'
				}
	
			}, {
				name: '收縮壓',
				type: 'spline',
				color: '#AA4643',
				yAxis: 2,
				data: [142, 143, 141, 145, 153, 168, 156, 154, 160, 176, 163, 153],
				marker: {
					enabled: false
				},
				dashStyle: 'shortdot',
				tooltip: {
					valueSuffix: ' mm'
				}
	
			}, {
				name: '舒張壓',
				color: '#89A54E',
				type: 'spline',
				data: [100, 95, 92, 110, 90, 85, 88, 87, 91, 100, 105, 111],
				tooltip: {
					valueSuffix: ' mm'
				}
			}]
		});
	
	
});

function initialize() {
  var mapOptions = {
	zoom: 11,
	center: new google.maps.LatLng(24.5122, 121.3344),
	mapTypeId:google.maps.MapTypeId.HYBRID
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
	  mapOptions);
  maploaded=true;	  
}

function getMap(){
	initialize();
}

function MapForsearch() {
  var mapOptions = {
	zoom: 13,
	center: new google.maps.LatLng(24.4122, 121.2344),
  };
  serachMap = new google.maps.Map(document.getElementById('map_canvas_nearby'),mapOptions);
  mapForSearchloaded=true; 	  
}

