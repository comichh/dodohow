var displayData;
$(function(){
  $("#list").jqGrid({
		datatype: "local",
		autowidth: true,
		height: 640,
		rowNum:5,
		hidegrid: false,
		colNames:['運動時間','使用者','姓名', '運動名稱', '詳細資訊','活動照片','總時間(hh:mm:ss)','總距離(m)','旅程敘述','留言數'],
		colModel:[ 
			{name:'StartTime',index:'StartTime', width:90, align:"center",sorttype:"date",search:false},
			{name:'displayname',index:'displayname', width:60,align:"center",search:false},
			{name:'name',index:'name', width:60,align:"left",searchoptions:{sopt:['cn','eq','ne','le','lt','gt','ge','bw','bn','nc']}},
			{name:'Trainname',index:'Trainname', width:120,align:"left",searchoptions:{sopt:['cn','eq','ne','le','lt','gt','ge','bw','bn','nc']}},
			{name:'Detail',index:'Detail', width:60,align:"center",search:false},
			{name:'Photo',index:'Photo', width:60,align:"center",search:false},
			{name:'TotalTime',index:'TotalTime', width:80, align:"center",searchoptions:{sopt:['cn','eq','ne','le','lt','gt','ge','bw','bn','cn','nc']}},
			{name:'TotalDistance',index:'TotalDistance', width:60,align:"center",sorttype:"float",searchoptions:{sopt:['le','eq','lt','gt','ge']}},
			{name:'Description',index:'Description', width:150,align:"left",searchoptions:{sopt:['cn','eq','ne','le','lt','gt','ge','bw','bn','cn','nc']}},
			{name:'CommentCount',index:'CommentCount', width:60,align:"center",sorttype:"float",searchoptions:{sopt:['cn','eq','ne','le','lt','gt','ge','bw','bn','cn','nc']}},
		], 
		pager: '#pager',
		viewrecords: true,
		hidegrid: false,
		rowList : [5,10,20,30,50,100],
		caption: "依條件查詢",
		loadComplete: function () {
			$(this).find(">tbody>tr.jqgrow:visible:odd").addClass("myAltRowClass");
		}
	});
	$("#list").jqGrid('filterToolbar',{autosearch:true,searchOperators:true,searchOnEnter:false});
	//jQuery("#list").jqGrid('filterToolbar',{searchOnEnter:false});
	//getDataFromService();
		
});

function getDataFromService(){
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
			var serialIndex=0;
			for(var index=0;index<dataLength;index++){
				serialIndex+=1;
				contentStr+="{";
				contentStr+="trainid:'"+objectData[index].trainid+"',";
				contentStr+="deviceid:'"+objectData[index].deviceid+"',";
				contentStr+="StartTime:'"+objectData[index].StartTime+"',";
				contentStr+="displayname:'<img src=\"./upload/upload/"+objectData[index].UserImage+"\" width=\"72\" alt=\""+objectData[index].displayname+"\" />',";
				contentStr+="name:'"+objectData[index].displayname+"',";
				contentStr+="Trainname:'"+objectData[index].Trainname+"',";
				contentStr+="Detail:'<div align=\"center\" style=\"cursor:pointer\" onclick=\"showDetail("+index+")\"><img src=\"./images/detail.png\" /></div>',";
				contentStr+="Description:'"+objectData[index].Description+"',";
				if(parseInt(objectData[index].PictureCount)>0){
					contentStr+="Photo:'<div align=\"center\"><a href=\"galleryAblum.php?tripID="+objectData[index].trainid+"\" target=\"_blank\"><img src=\"./images/photocollect.png\" /></a></div>',";
				}else{
					contentStr+="Photo:'',";
				}
				contentStr+="TotalTime:'"+calHrAndMin(parseInt(objectData[index].TotalTime))+"',";
				contentStr+="TotalDistance:'"+objectData[index].TotalDistance+"',";
				contentStr+="CommentCount:'"+objectData[index].CommentCount+"'";
				contentStr+="},";
			}
			contentStr = contentStr.substr(0,contentStr.length-1);
			newJsonStr="["+contentStr+"]";
			displayData=eval(newJsonStr);
			for(var i=0;i<=displayData.length;i++){
				$("#list").jqGrid('addRowData',i+1,displayData[i]);
			}
			$('#list').trigger('reloadGrid');			
		},
		error: function() {
			return eval('[{}]');
			alert("ERROR!!! by getDataByJSON()");
		}
	});
}

function getDataFromDistance(maxlat,minlat,maxlng,minlng){
	clearGridData();
	var fullUrl='./common/lib/php/GetAllTraindataInDistance.php?maxlat='+maxlat+'&minlat='+minlat+'&maxlng='+maxlng+'&minlng='+minlng;
	$.ajax({
		url:fullUrl,
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {
			var objectData=eval(Jdata);
			var dataLength=objectData.length;
			var newJsonStr='';
			var contentStr='';
			var serialIndex=0;
			for(var index=0;index<dataLength;index++){
				serialIndex+=1;
				contentStr+="{";
				contentStr+="trainid:'"+objectData[index].trainid+"',";
				contentStr+="deviceid:'"+objectData[index].deviceid+"',";
				contentStr+="StartTime:'"+objectData[index].StartTime+"',";
				contentStr+="displayname:'<img src=\"./upload/upload/"+objectData[index].UserImage+"\" width=\"72\" alt=\""+objectData[index].displayname+"\" />',";
				contentStr+="name:'"+objectData[index].displayname+"',";
				contentStr+="Trainname:'"+objectData[index].Trainname+"',";
				contentStr+="Detail:'<div align=\"center\" style=\"cursor:pointer\" onclick=\"showDetail("+index+")\"><img src=\"./images/detail.png\" /></div>',";
				contentStr+="Description:'"+objectData[index].Description+"',";
				if(parseInt(objectData[index].PictureCount)>0){
					contentStr+="Photo:'<div align=\"center\"><a href=\"galleryAblum.php?tripID="+objectData[index].trainid+"\" target=\"_blank\"><img src=\"./images/photocollect.png\" /></a></div>',";
				}else{
					contentStr+="Photo:'',";
				}
				contentStr+="TotalTime:'"+calHrAndMin(parseInt(objectData[index].TotalTime))+"',";
				contentStr+="TotalDistance:'"+objectData[index].TotalDistance+"',";
				contentStr+="CommentCount:"+objectData[index].CommentCount;
				contentStr+="},";
			}
			contentStr = contentStr.substr(0,contentStr.length-1);
			newJsonStr="["+contentStr+"]";
			displayData=eval(newJsonStr);
			for(var i=0;i<=displayData.length;i++){
				$("#list").jqGrid('addRowData',i+1,displayData[i]);
			}
			$('#list').trigger('reloadGrid');			
		},
		error: function() {
			return eval('[{}]');
			alert("ERROR!!! by getDataByJSON()");
		}
	});
}

function clearGridData(){
	$("#list").jqGrid("clearGridData", true).trigger("reloadGrid");
}

function showDetail(index){
	window.parent.getHistoryByAjax(displayData[index].trainid,displayData[index].deviceid);
}
