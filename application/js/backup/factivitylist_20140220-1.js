var displayData;
$(function(){
  $("#list").jqGrid({
		datatype: "local",
		autowidth: true,
		height: 640,
		rowNum:5,
		hidegrid: false,
		colNames:['發佈時間','運動時間','機型','使用者', '運動名稱', '詳細資訊','活動照片','總時間(hh:mm:ss)','總距離(km)','旅程敘述','留言數'],
		colModel:[ 
			{name:'PublishTime',index:'PublishTime', width:60, align:"center",sorttype:"date",search:false},
			{name:'StartTime',index:'StartTime', width:60, align:"center",sorttype:"date",search:false},
			{name:'DeviceName',index:'DeviceName', width:60, align:"center",searchoptions:{sopt:['cn','eq','ne','bw','bn','nc']}},
			{name:'displayname',index:'displayname', width:60,align:"center",searchoptions:{sopt:['cn','eq','ne','bw','bn','nc']}},
			{name:'Trainname',index:'Trainname', width:120,align:"left",searchoptions:{sopt:['cn','eq','ne','bw','bn','nc']}},
			{name:'Detail',index:'Detail', width:60,align:"center",search:false},
			{name:'Photo',index:'Photo', width:60,align:"center",search:false},
			{name:'TotalTime',index:'TotalTime', width:80, align:"center",searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
			{name:'TotalDistance',index:'TotalDistance', width:60,align:"center",sorttype:"float",searchoptions:{sopt:['le','eq','lt','gt','ge']}},
			{name:'Description',index:'Description', width:150,align:"left",searchoptions:{sopt:['cn','eq','ne','bw','bn','cn','nc']}},
			{name:'CommentCount',index:'CommentCount', width:60,align:"center",sorttype:"float",searchoptions:{sopt:['eq','le','lt','gt','ge']}},
		], 
		pager: '#pager',
		viewrecords: true,
		hidegrid: false,
		rowList : [5,10,20,30,50,100],
		caption: "依條件查詢",
		loadComplete: function () {
			$(this).find(">tbody>tr.jqgrow:visible:odd").addClass("myAltRowClass");
		},
		onSelectRow: function(rowID) {
			var indexID=rowID-1;
            setMapRoutePath(displayData[indexID].StartLatitude,
							displayData[indexID].StartLongitude,
							displayData[indexID].trainid,
							displayData[indexID].deviceid,
							displayData[indexID].Trainname,
							displayData[indexID].UserImage,
							displayData[indexID].TotalDistance,
							displayData[indexID].TotalTime);
        }
	});
	$("#list").jqGrid('filterToolbar',{autosearch:true,searchOperators:true,searchOnEnter:false});
	//jQuery("#list").jqGrid('filterToolbar',{searchOnEnter:false});
	//getDataFromService();
		
});

function getDataFromDistance(centerlat,centerlng,distance){
	clearGridData();
	setTimeout(function(){
		var fullUrl='./common/lib/php/GetDistanceWithLatlng.php?centerlat='+centerlat+'&centerlng='+centerlng+'&distance='+distance;
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
					contentStr+="displayname:'<img src=\"./upload/upload/"+objectData[index].UserImage+"\" width=\"72\" alt=\""+objectData[index].displayname+"\" />"+objectData[index].displayname+"',";
					contentStr+="name:'"+objectData[index].displayname+"',";
					contentStr+="UserImage:'"+objectData[index].UserImage+"',";
					contentStr+="Trainname:'"+objectData[index].Trainname+"',";
					contentStr+="Detail:'<div align=\"center\" style=\"cursor:pointer\" onclick=\"showDetail("+index+")\"><img src=\"./images/detail.png\" /></div>',";
					contentStr+="Description:'"+objectData[index].Description+"',";
					if(parseInt(objectData[index].PictureCount)>0){
						contentStr+="Photo:'<div align=\"center\"><a href=\"galleryAblum.php?tripID="+objectData[index].trainid+"\" target=\"_blank\"><img src=\"./images/photocollect.png\" /></a></div>',";
					}else{
						contentStr+="Photo:'',";
					}
					contentStr+="TotalTime:'"+calHrAndMin(parseInt(objectData[index].TotalTime))+"',";
					contentStr+="TotalDistance:'"+(parseFloat(objectData[index].TotalDistance)/1000).toFixed(2)+"',";
					contentStr+="PublishTime:'"+objectData[index].PublishTime+"',";
					contentStr+="DeviceName:'"+objectData[index].DeviceName+"',";
					contentStr+="StartLatitude:"+objectData[index].StartLatitude+",";
					contentStr+="StartLongitude:"+objectData[index].StartLongitude+",";
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
	},100);
}

function clearGridData(){
	$("#list").clearGridData(true).trigger("reloadGrid");
}

function showDetail(index){
	window.parent.getHistoryByAjax(displayData[index].trainid,displayData[index].deviceid);
}

function setMapRoutePath(lat,lng,tripID,deviceID,TrainName,UserImage,TotalDistance,TotalTime){
	window.parent.locateMapRoutePathAndPosition(lat,lng,tripID,deviceID,TrainName,UserImage,TotalDistance,TotalTime);
}
