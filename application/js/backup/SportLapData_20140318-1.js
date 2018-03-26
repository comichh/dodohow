var displayData;
$(function(){
  $("#list").jqGrid({
		datatype: "local",
		//autowidth: true,
		width:500,
		height:270,
		rowNum:10,
		shrinkToFit: false,
		hidegrid: false,
		colNames:['圈別','開始時間','時間', '距離', '卡路里','最大速度','最大心跳','平均心跳','最大踏頻','平均踏頻','最大功率','平均功率'],
		colModel:[ 
			{name:'lap_no',index:'lap_no', width:50,align:"center",sorttype:"float",frozen: true},
			{name:'start_time',index:'start_time', width:120, align:"center"},
			{name:'total_time',index:'total_time', width:70,align:"center"},
			{name:'total_distance',index:'total_distance', width:50,align:"center",sorttype:"float"},
			{name:'calory',index:'calory', width:50,align:"center",sorttype:"float"},
			{name:'maxspeed',index:'maxspeed', width:50,align:"center",sorttype:"float"},
			{name:'max_heart',index:'max_heart', width:50,align:"center",sorttype:"float"},
			{name:'avg_heart',index:'avg_heart', width:50,align:"center",sorttype:"float"},
			{name:'avg_cadns',index:'avg_cadns', width:50,align:"center",sorttype:"float"},
			{name:'best_cadns',index:'best_cadns', width:50,align:"center",sorttype:"float"},
			{name:'avg_power',index:'avg_power', width:50,align:"center",sorttype:"float"},
			{name:'max_power',index:'max_power', width:50,align:"center",sorttype:"float"}
		], 
		pager:'#pager',
		multiselect:true,
		viewrecords:true,
		hidegrid:false,
		sortname:'lap_no',
		sortorder:'asc',
		rowList : [5,10,20,30,50,100,100000000000000],
		caption: "圈數各項數值數值",
		loadComplete: function () {
			$(this).find(">tbody>tr.jqgrow:visible:odd").addClass("myAltRowClass");
			$("option[value=100000000000000]").text('All');
		}
	});
	
	$('#container').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: 'Source: Sport For you'
            },
            xAxis: {
                categories: [],
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: '',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                valueSuffix: ' '
            },
			plotOptions: {
				bar: {
                    dataLabels: {
                        enabled: false
                    }
                },
				series: {
					cursor: 'pointer',
					point: {
						events: {
							click: function() {
								var catArray=this.category.split(" ");
								var indexVar=parseInt(catArray[1]);
								getEachLapData(displayData[indexVar-1].start_pt,displayData[indexVar-1].end_pt);
							}
						}
					}
				}
			},
            credits: {
                enabled: false
            },
            series: [{
                name: '--',
                data: []
            }]
        });
	
	
	setTimeout(function(){
		getDataFromService(tripID,deviceID);
	},1000);
});

function getDataFromService(tripID,deviceID){
	
	var fullUrl='./common/lib/php/GetLapData.php?train_data_key='+tripID+'&deviceID='+deviceID;
	$.ajax({
		url:fullUrl,
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {
			var objectData=eval(Jdata);
			var dataLength=objectData.length;
			var newJsonStr='';
			var contentStr='';
			for(var index=0;index<dataLength;index++){
				contentStr+="{";
				contentStr+="start_time:'"+objectData[index].start_time+"',";
				contentStr+="lap_no:"+objectData[index].lap_no+",";
				contentStr+="total_time:'"+calHrAndMin(objectData[index].total_time)+"',";
				contentStr+="total_distance:"+objectData[index].total_distance+",";
				contentStr+="calory:"+objectData[index].calory+",";
				contentStr+="maxspeed:"+formatFloat(objectData[index].maxspeed/100,0)+",";
				contentStr+="max_heart:"+objectData[index].max_heart+",";
				contentStr+="avg_heart:"+objectData[index].avg_heart+",";
				contentStr+="avg_cadns:"+objectData[index].avg_cadns+",";
				contentStr+="best_cadns:"+objectData[index].best_cadns+",";
				contentStr+="avg_power:"+objectData[index].avg_power+",";
				contentStr+="max_power:"+objectData[index].max_power+",";
				contentStr+="start_pt:"+objectData[index].start_pt+",";
				contentStr+="end_pt:"+objectData[index].end_pt;
				contentStr+="},";
			}
			contentStr = contentStr.substr(0,contentStr.length-1);
			newJsonStr="["+contentStr+"]";
			displayData=eval(newJsonStr);
			for(var i=0;i<=displayData.length;i++){
				
				$("#list").jqGrid('addRowData',i+1,displayData[i]);
			}
			$('#list').trigger('reloadGrid');
			$("#list").jqGrid('setFrozenColumns');			
		},
		error: function() {
			return eval('[{}]');
			alert("ERROR!!! by getDataByJSON()");
		}
	});
}

function showSelectID(valID){
	var selRow = $("#list").jqGrid('getGridParam','selarrrow').sort(function(a,b){return a-b;});
	var serialLapArray=[];
	var dataArray=[];
	var sortDataArray=[];
	var titleArray=[];
	var sortTitleArray=[];
	var selvalue=selRow.length;
	var titleName='';

	for(var i=0;i<selvalue;i++){
		var ret = jQuery("#list").jqGrid('getRowData',selRow[i]);   //get the selected row
		titleArray.push("The "+ret.lap_no+" lap");
		switch(valID){
			case 1:
				titleName="卡路里";
				dataArray.push(parseInt(ret.calory));
				break;
			case 2:
				titleName="最大速度";
				dataArray.push(parseInt(ret.maxspeed));
				break;
			case 3:
				titleName="平均心跳";
				dataArray.push(parseInt(ret.avg_heart));
				break;
			case 4:
				titleName="最大心跳";
				dataArray.push(parseInt(ret.max_heart));
				break;
			case 5:
				titleName="平均踏頻";
				dataArray.push(parseInt(ret.avg_cadns));
				break;
			case 6:
				titleName="最佳踏頻";
				dataArray.push(parseInt(ret.best_cadns));
				break;
			case 7:
				titleName="平均功率";
				dataArray.push(parseInt(ret.avg_power));
				break;
			case 8:
				titleName="最大功率";
				dataArray.push(parseInt(ret.max_power));
				break;
		}		
		
	}
	if(dataArray.length>0){
		chart = $('#container').highcharts();
		chart.options.series[0].name=titleName;
		chart.options.xAxis[0].categories=titleArray;
		chart = new Highcharts.Chart(chart.options);
		chart.render();
		chart.series[0].setData(dataArray,false);
		chart.redraw();
	}else{
		alert("請先勾選要一起比較的圈數別");
	}

}

function getEachLapData(startPt,endPt){
	$('#LapDataLoading').show();
	var fullUrl='./common/lib/php/GetLapEachData.php?train_data_key='+tripID+'&deviceID='+deviceID+'&startPt='+startPt+'&endPt='+endPt;
	$.ajax({
		url:fullUrl,
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {
			var objectData=eval(Jdata);
			var lapFlightPlanCoordinates=[];
			for(var index=0;index<objectData.length;index++){
				lapFlightPlanCoordinates.push(objectData[index].latitude+","+parseFloat(objectData[index].longitude));
			}
			window.parent.drawLapPathLine(lapFlightPlanCoordinates);
			$('#LapDataLoading').hide();
		},
		error: function() {
			return eval('[{}]');
			alert("ERROR!!! by getDataByJSON()");
			$('#LapDataLoading').hide();
		}
	});
}


