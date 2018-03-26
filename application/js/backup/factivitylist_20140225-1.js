var displayData;
$(function(){
  $("#list").jqGrid({
		datatype: "local",
		autowidth: true,
		height: 640,
		rowNum:5,
		hidegrid: false,
		colNames:['詳細資訊','發佈時間','運動時間','機型','使用者', '運動名稱','活動照片','總時間(hh:mm:ss)','總距離(km)','旅程敘述','留言數'],
		colModel:[ 
			{name:'Detail',index:'Detail', width:120,align:"center",search:false},
			{name:'PublishTime',index:'PublishTime', width:60, align:"center",sorttype:"date",search:false},
			{name:'StartTime',index:'StartTime', width:60, align:"center",sorttype:"date",search:false},
			{name:'DeviceName',index:'DeviceName', width:60, align:"center",search:false},
			{name:'displayname',index:'displayname', width:60,align:"center",search:false},
			{name:'Trainname',index:'Trainname', width:120,align:"left",search:false},
			{name:'Photo',index:'Photo', width:60,align:"center",search:false},
			{name:'TotalTime',index:'TotalTime', width:80, align:"center",search:false},
			{name:'TotalDistance',index:'TotalDistance', width:60,align:"center",search:false},
			{name:'Description',index:'Description', width:150,align:"left",search:false},
			{name:'CommentCount',index:'CommentCount', width:60,align:"center",search:false},
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
	//$("#list").jqGrid('filterToolbar',{autosearch:true,searchOperators:true,searchOnEnter:false});
		
});

function getDataFromDistance(centerlat,centerlng,distance,minSportDistance,maxSportDistance,UserSearch,SportNameSearch,SportDescriptionSearch,SportDurtionSearch){
	startLoading();
	clearGridData();
	setTimeout(function(){
		//var fullUrl='./common/lib/php/GetDistanceWithLatlng.php?centerlat='+centerlat+'&centerlng='+centerlng+'&distance='+distance;
		var fullUrl='./common/lib/php/GetDistanceWithLatlng.php';
		$.ajax({
			url:fullUrl,
			type:'POST',
			data:'centerlat='+centerlat
				+'&centerlng='+centerlng
				+'&minSportDistance='+minSportDistance
				+'&maxSportDistance='+maxSportDistance
				+'&distance='+distance
				+'&userSearch='+UserSearch
				+'&sportNameSearch='+SportNameSearch
				+'&sportDescriptionSearch='+SportDescriptionSearch
				+'&sportDurtionSearch='+SportDurtionSearch,
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
					contentStr+="Detail:'<div align=\"center\" style=\"cursor:pointer\" onclick=\"showDetail("+index+")\"><img src=\"./images/record/"+objectData[index].trainid+"/RoutePath.jpg\" style=\"border:1px #cecece solid\"/></div>',";
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
				LoadingComplete();				
			},
			error: function() {
				return eval('[{}]');
				alert("ERROR!!! by getDataByJSON()");
				LoadingComplete();
			}
		});
	},500);
}

function clearGridData(){
	$("#list").clearGridData(true).trigger("reloadGrid");
}

function showDetail(index){
	window.parent.getHistoryByAjax(displayData[index].trainid,displayData[index].deviceid);
}

function startLoading(){
	window.parent.showLoadingItem();
}

function LoadingComplete(){
	window.parent.LoadingItemComplete();
}
