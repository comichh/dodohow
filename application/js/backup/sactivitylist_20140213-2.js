$(function(){
  $("#list").jqGrid({
		datatype: "local",
		autowidth: true,
		height: 640,
		rowNum:5,
		colNames:['序號','運動時間','使用者', '運動名稱', '詳細資訊','旅程敘述','活動照片','總時間(hh:mm:ss)','總距離(m)'],
		colModel:[ 
			{name:'id',index:'id', width:60, align:"center",sorttype:"int",searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
			{name:'StartTime',index:'StartTime', width:90, align:"center",sorttype:"date",searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
			{name:'displayname',index:'displayname', width:90,align:"left",searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
			{name:'Trainname',index:'Trainname', width:100,align:"left",searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
			{name:'Detail',index:'Detail', width:80, align:"center",searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
			{name:'Description',index:'Description', width:80,align:"left",sorttype:"float",searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
			{name:'Photo',index:'Photo', width:80, align:"center",searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
			{name:'TotalTime',index:'TotalTime', width:80, align:"center",searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
			{name:'TotalDistance',index:'TotalDistance', width:150,align:"center",sorttype:"float",searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}}
		], 
		pager: '#pager',
		viewrecords: true,
		rowList : [5,10,20,30,50,100],
		caption: "Manipulating Array Data"
	});
	$("#list").jqGrid('filterToolbar',{searchOperators : true});
	loadDataToGrid();
});

function getDataFromService(){
	var mydata = [
		{id:"1",StartTime:"2007-10-01",displayname:"test",Trainname:"note",Detail:"200.00",Description:"10.00",Photo:"210",TotalTime:"01:00:00",TotalDistance:"25321"},
		{id:"2",StartTime:"2007-10-02",displayname:"test",Trainname:"note",Detail:"200.00",Description:"10.00",Photo:"211",TotalTime:"01:00:00",TotalDistance:"25322"},
		{id:"3",StartTime:"2007-10-03",displayname:"test",Trainname:"note",Detail:"200.00",Description:"10.00",Photo:"212",TotalTime:"01:00:00",TotalDistance:"25323"},
		{id:"4",StartTime:"2007-10-04",displayname:"test",Trainname:"note",Detail:"200.00",Description:"10.00",Photo:"213",TotalTime:"01:00:00",TotalDistance:"25324"}
	];
	return mydata;
}

function loadDataToGrid(){
	
	var data=getDataFromService();
	for(var i=0;i<=data.length;i++){
		$("#list").jqGrid('addRowData',i+1,data[i]);
	}
	$('#list').trigger('reloadGrid');
}

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
				contentStr+="displayname:'<img src=\"./upload/upload/"+objectData[index].UserImage+"\" width=\"72\" /><br>"+objectData[index].displayname+"',";
				//contentStr+="displayname:'<img src=\"./upload/upload/"+objectData[index].UserImage+"\" width=\"72\" />',";
				contentStr+="Trainname:'"+objectData[index].Trainname+"',";
				contentStr+="Detail:'<div align=\"center\" style=\"cursor:pointer\" onclick=\"showDetail("+index+")\"><img src=\"./images/detail.png\" /></div>',";
				contentStr+="StartTime:'"+objectData[index].StartTime+"',"
				contentStr+="Description:'"+objectData[index].Description+"',";
				if(parseInt(objectData[index].PictureCount)>0){
					contentStr+="Photo:'<div align=\"center\"><a href=\"galleryAblum.php?tripID="+objectData[index].trainid+"\" target=\"_blank\"><img src=\"./images/photocollect.png\" /></a></div>',";
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
			loadDataToGrid(displayData);
		},
		error: function() {
			alert("ERROR!!! by getDataByJSON()");
		}
	});
	
}