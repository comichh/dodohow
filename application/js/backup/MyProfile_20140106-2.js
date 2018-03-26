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
	
	$("#UserPhoto").attr('src','./upload/upload/'+user_id);
	$("#UserPhoto").show(500);
	$("#UserPhotoSmall").attr('src','./upload/upload/'+user_id);
	
	
	
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
	
		getDevicelistByAjax();
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
var jsonArray;
function getDevicelistByAjax(){
	var fullUrl="./common/lib/php/GetDeviceList.php?ud="+$('#test').val();
	$.ajax({
		url:fullUrl,
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {
			jsonArray=eval('('+Jdata+')');
			var str='';
			for(var i=0;i<jsonArray.length;i++){
				str+="<sapn id='deviceid' class='badge badge-info' style='height:30px'>"+jsonArray[i].modelname+"</span>&nbsp;&nbsp;<input type='text' class='input-large' style='position:relative;height:26px;top:2px' id='DisplayName_"+jsonArray[i].id+"' size=20 value='"+jsonArray[i].displayname+"' /><img src='./images/update.png' style='cursor:pointer;position:relative;top:-4px;left:2px'>";
			}
			
			$('#DeviceList').html(str);
		},
		error: function() {
			alert("ERROR!!! by getDataByJSON()");
		}
	});
}

function openMsgbox(){
	$("#myModal").modal('show');
}

function changeUserPhoto(url){
	setTimeout(function(){
		document.getElementById("UserPhoto").src=url;
		//$('#UserPhoto').attr("src",url);
		//var d=new Date();
		//alert(url+"?id="+(d.getTime()));
		//alert(url);
		//$("#UserPhotoTD").html('<img id="UserPhoto" src="'+url+'" onclick="openMsgbox()" style="border:1px solid #cecece;cursor:pointer;width:120px;display:none" alt="">');
		//$("#UserPhoto").removeAttr("src").attr("src", url);
		//$('#UserPhoto').attr("src", url+"?timestamp=" + new Date().getTime());
	    //$('#UserPhotoSmall').attr("src", url+"?timestamp=" + new Date().getTime());
		//$('#UserPhoto').attr("src", url+"?timestamp=" + new Date().getTime());
		//$('#UserPhotoSmall').attr("src", url+"?timestamp=" + new Date().getTime());
		//$('#UserPhoto').fadeIn(500);
	},500);
}