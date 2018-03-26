$(function(){
	
	requirejs.config({
		config: {
			moment: {
				noGlobal: true
			}
		},
		paths: {
			jquery: 'com/datagrid/lib/jquery-1.9.1.min',
			underscore: 'com/datagrid/lib/Underscore',
			bootstrap: 'com/datagrid/lib/bootstrap/js',
			fuelux: 'com/datagrid/src',
			moment: 'com/datagrid/lib/moment' // comment out if you dont want momentjs to be default
		}
	});

	getAllPublicShareTrain();	
});
var displayData;
function getAllPublicShareTrain(){
	var fullUrl='./common/lib/php/GetAllTraindata.php';
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
				contentStr+="creator:'"+objectData[index].creator+"',";
				contentStr+="trainid:"+objectData[index].trainid+",";
				contentStr+="deviceid:'"+objectData[index].deviceid+"',";
				contentStr+="displayname:'<img src=\"./upload/upload/"+objectData[index].UserImage+"\" width=\"72\" />"+objectData[index].displayname+"',";
				contentStr+="Trainname:'"+objectData[index].Trainname+"',";
				contentStr+="Detail:'<div align=\"center\" style=\"cursor:pointer\" onclick=\"showDetail("+index+")\"><img src=\"./images/detail.png\" /></div>',";
				contentStr+="StartTime:'"+objectData[index].StartTime+"',"
				contentStr+="Description:'"+objectData[index].Description+"',";
				if(parseInt(objectData[index].PictureCount)>0){
					contentStr+="Photo:'<div align=\"center\"><a href=\"gallery.php?tripID="+objectData[index].trainid+"\" target=\"_blank\"><img src=\"./images/photocollect.png\" /></a></div>',";
				}else{
					contentStr+="Photo:'',";
				}
				contentStr+="TotalTime:'"+calHrAndMin(parseInt(objectData[index].TotalTime))+"',";
				contentStr+="TotalDistance:"+objectData[index].TotalDistance;
				contentStr+="},";
			}
			contentStr = contentStr.substr(0,contentStr.length-1); 
			newJsonStr='['+contentStr+']';
			displayData=eval(newJsonStr);
			$('#Gridview').show();
			require(['jquery', 'com/datagrid/rec/data', 'com/datagrid/rec/datasource', 'com/datagrid/rec/datasourceTree', 'fuelux/all'], function ($, sampleData, StaticDataSource, DataSourceTree) {
				var dataSource = new StaticDataSource({
					columns: [
						{
							property: 'StartTime',
							label: '運動時間',
							sortable: true
						},
						{
							property: 'displayname',
							label: '使用者',
							sortable: true
						},
						{
							property: 'Trainname',
							label: '運動名稱',
							sortable: true
						},
						{
							property: 'Detail',
							label: '詳細資訊',
							sortable: true
						},
						{
							property: 'Description',
							label: '旅程敘述',
							sortable: true
						},
						{
							property: 'Photo',
							label: '活動照片',
							sortable: true
						},
						{
							property: 'TotalTime',
							label: '總時間(hh:mm:ss)',
							sortable: true
						},
						{
							property: 'TotalDistance',
							label: '總距離(m)',
							sortable: true
						}
					],
					/*
					data: [
						{name:'foo', countrycode:'United States', population:423459000, fcodeName:'23434123' },
						{name:'boo', countrycode:'Canada', population:123459000, fcodeName:'552432123' },
						{name:'bar', countrycode:'United Kingdom', population:523459000, fcodeName:'54544123' },
						{name:'doo', countrycode:'France', population:323459050, fcodeName:'9848823123' },
						{name:'too', countrycode:'Scotland', population:42344300, fcodeName:'23434123' },
						{name:'woo', countrycode:'Ireland', population:12345903, fcodeName:'52432123' },
						{name:'mar', countrycode:'Austria', population:32342910, fcodeName:'4544123' },
						{name:'soo', countrycode:'Spain', population:23459900, fcodeName:'9848823123' },
						{name:"Dhaka",countrycode:"BD",population:10356500, fcodeName:'1848823123'},
						{name:"Jakarta",countrycode:"BD",population:10356500, fcodeName:'1848823123'},
						{name:"Seoul",countrycode:"ID",population:8540121, fcodeName:'4448828694'},
						{name:"Hong Kong",countrycode:"HK",population:18540121, fcodeName:'349903004'}
					],
					*/
					data:displayData,
					delay:250
				});
				$('#MyStretchGrid').datagrid({
					dataSource: dataSource,
					stretchHeight: true
				});
			});	
		},
		error: function() {
			alert("ERROR!!! by getDataByJSON()");
		}
	});
	
}

function showDetail(index){
	window.parent.getHistoryByAjax(displayData[index].trainid,displayData[index].deviceid);
}

