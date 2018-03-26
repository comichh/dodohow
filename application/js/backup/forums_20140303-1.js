window.onload=function(){
	getTotalCarolyAndRanking();
	$('#SelectRanking').html('累積消耗卡路里');
}

$(function() {
	$('#GetCarolyRanking').click(function(){
		getTotalCarolyAndRanking();
		$('#SelectRanking').html('累積消耗卡路里');
	});
	
	$('#GetDistanceRanking').click(function(){
		getTotalDistanceAndRanking();
		$('#SelectRanking').html('累積運動里程');
	});
	
	$('#GetEffectRanking').click(function(){
		alert('施工中');
	});
	
	$('#GetTripRanking').click(function(){
		alert('施工中');
	});
	
	$('#container').highcharts({
		chart: {
			type: 'bar',
		},
		title: {
			text: 'Stacked bar chart'
		},
		xAxis: {
			categories: []
		},
		yAxis: {
			min: 0,
			title: {
				text: ''
			}
		},
		legend: {
			backgroundColor: '#FFFFFF',
			reversed: true
		},
		plotOptions: {
			series: {
				stacking: 'normal'
			}
		},
		series: [{
			name: '',
			data: []
		}]
	});
});

function getTotalCarolyAndRanking(){
	url="./common/lib/php/GetHonorCaroly.php";
	$.ajax({
		url:url,
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {        	
			jsonArray=eval('('+Jdata+')');
			var str='';
			var dataArray1=[];
			var dataArray2=[];
			if(jsonArray.length>0){
				for(var i=0;i<jsonArray.length;i++){
					
					str+='<tr>';												
					str+='	<td>';
					if(i==0){
						str+='		<div class="muted"><img src="./images/win.png" /></div>';
					}else{
						str+='		<div class="muted"><h6>'+(i+1)+'</h6></div>';
					}
					str+='	</td>';
					str+='	<td>';
					if(i==0){
						str+='		<div class="muted"><div class="muted"><h4><div><img src="./upload/upload/'+jsonArray[i].UserImage+'" style="width:72px" /><div>'+jsonArray[i].UserName+'</div></h4></div></div>';
					}else{
						str+='		<div class="muted"><div class="muted"><h6><div><img src="./upload/upload/'+jsonArray[i].UserImage+'" style="width:36px" /><div>'+jsonArray[i].UserName+'</div></h6></div></div>';
					}
					str+='	</td>';
					str+='	<td>';
					str+='		<div><h4><div><h4>'+jsonArray[i].TotalCalory+'</h4></div></h4></div>';
					str+='	</td>';
					str+='</tr>';
					dataArray1.push(jsonArray[i].UserName);
					dataArray2.push(parseInt(jsonArray[i].TotalCalory));
				}
				drawData(dataArray1,dataArray2,'燃燒卡路里','累積消耗卡路里統計');
				$('#RankingContent').html(str);
			}else{
				alert('no data in this trip');
			}
						
		},
		error: function() {
			alert("ERROR!!! by getDataByJSON()");
			$('#Startloading').hide();
		}
	});
}

function getTotalDistanceAndRanking(){
	url="./common/lib/php/GetHonorDistance.php";
	$.ajax({
		url:url,
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {
			jsonArray=eval('('+Jdata+')');
			var str='';
			var dataArray1=[];
			var dataArray2=[];
			if(jsonArray.length>0){
				for(var i=0;i<jsonArray.length;i++){
					
					str+='<tr>';												
					str+='	<td>';
					if(i==0){
						str+='		<img src="./images/win.png" style="width:54px"/>';
					}else{
						str+='		<div class="muted"><h6>'+(i+1)+'</h6></div>';
					}
					str+='	</td>';
					str+='	<td>';
					if(i==0){
						str+='		<div class="muted"><div class="muted"><h4><div><img src="./upload/upload/'+jsonArray[i].UserImage+'" style="width:72px" /><div>'+jsonArray[i].UserName+'</div></h4></div></div>';
					}else{
						str+='		<div class="muted"><div class="muted"><h6><div><img src="./upload/upload/'+jsonArray[i].UserImage+'" style="width:36px" /><div>'+jsonArray[i].UserName+'</div></h6></div></div>';
					}
					str+='	</td>';
					str+='	<td>';
					str+='		<div><h4><div><h4>'+jsonArray[i].TotalDistance+'</h4></div></h4></div>';
					str+='	</td>';
					str+='</tr>';
					dataArray1.push(jsonArray[i].UserName);
					dataArray2.push(parseInt(jsonArray[i].TotalDistance));
				}
				drawData(dataArray1,dataArray2,'運動里程','累積運動里程統計');
				$('#RankingContent').html(str);
			}else{
				alert('no data in this trip');
			}
						
		},
		error: function() {
			alert("ERROR!!! by getDataByJSON()");
			$('#Startloading').hide();
		}
	});
}

function drawData(dataArray1,dataArray2,title,itemName){
	chart = $('#container').highcharts();
	chart.options.xAxis[0].categories=dataArray1;
	chart.options.title.text=itemName;
	chart.options.yAxis[0].title.text=itemName;
	chart = new Highcharts.Chart(chart.options);
	chart.render();
	chart.series[0].name=title;
    chart.series[0].setData(dataArray2,false);
	chart.redraw();
}
