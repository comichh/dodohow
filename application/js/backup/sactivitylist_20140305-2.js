var displayData;
$(function(){
  $("#list").jqGrid({
		datatype: "local",
		autowidth: true,
		height: 640,
		rowNum:5,
		hidegrid: false,
		colNames:['詳細資訊','發佈時間','運動時間','機型','使用者', '運動名稱', '活動照片','總時間(hh:mm:ss)','總距離(km)','旅程敘述','留言數','按讚','收藏數'],
		colModel:[ 
			{name:'Detail',index:'Detail', width:120,align:"center",search:false},
			{name:'PublishTime',index:'PublishTime', width:60, align:"center",sorttype:"date",search:false},
			{name:'StartTime',index:'StartTime', width:60, align:"center",sorttype:"date",search:false},
			{name:'DeviceName',index:'DeviceName', width:60, align:"center",search:false},
			{name:'displayname',index:'displayname', width:60,align:"center",search:false},
			{name:'Trainname',index:'Trainname', width:120,align:"left",search:false},
			{name:'Photo',index:'Photo', width:60,align:"center",search:false},
			{name:'TotalTime',index:'TotalTime', width:80, align:"center",search:false},
			{name:'TotalDistance',index:'TotalDistance', width:60,align:"center",sorttype:"float",search:false},
			{name:'Description',index:'Description', width:150,align:"left",search:false},
			{name:'CommentCount',index:'CommentCount', width:60,align:"center",sorttype:"float",search:false},
			{name:'PraiseCount',index:'PraiseCount', width:60,align:"center",sorttype:"float",search:false},
			{name:'CollectCount',index:'CollectCount', width:60,align:"center",sorttype:"float",search:false}
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
            /*
			setMapRoutePath(displayData[indexID].StartLatitude,
							displayData[indexID].StartLongitude,
							displayData[indexID].trainid,
							displayData[indexID].deviceid,
							displayData[indexID].Trainname,
							displayData[indexID].UserImage,
							displayData[indexID].TotalDistance,
							displayData[indexID].TotalTime);
			*/
        }
	});
	//$("#list").jqGrid('filterToolbar',{autosearch:true,searchOperators:true,searchOnEnter:false});
	//jQuery("#list").jqGrid('filterToolbar',{searchOnEnter:false});
	//getDataFromService();
	$('#RouteDetail_0').click(function(event){
		alert('1');
		event.stopPropagation();
	});
	
	alert($('#MyFavSport').size());
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
				contentStr+="displayname:'<img src=\"../upload/user/"+objectData[index].UserImage+"\" width=\"72\" alt=\""+objectData[index].displayname+"\" />',";
				contentStr+="name:'"+objectData[index].displayname+"',";
				contentStr+="Trainname:'"+objectData[index].Trainname+"',";
				//contentStr+="Detail:'<div align=\"center\" style=\"cursor:pointer\" onclick=\"showDetail("+index+")\"><img src=\"./images/record/"+objectData[index].trainid+"/RoutePath.jpg\" /></div>',";
				contentStr+="Detail:'<div align=\"center\" style=\"cursor:pointer\" onclick=\"showDetail("+index+")\"><img src=\"../upload/point_thumbnail/"+objectData[index].trainid+".jpg\" width=\"120\" height=\"120\"/></div>',";
				contentStr+="Description:'"+objectData[index].Description+"',";
				if(parseInt(objectData[index].PictureCount)>0){
					contentStr+="Photo:'<div align=\"center\"><a href=\"galleryAblum.php?tripID="+objectData[index].trainid+"\" target=\"_blank\"><img src=\"./images/photocollect.png\" /></a></div>',";
				}else{
					contentStr+="Photo:'',";
				}
				contentStr+="TotalTime:'"+calHrAndMin(parseInt(objectData[index].TotalTime))+"',";
				contentStr+="TotalDistance:'"+parseFloat(objectData[index].TotalDistance)/1000+"',";
				contentStr+="PublishTime:'"+objectData[index].PublishTime+"',";
				contentStr+="DeviceName:'"+objectData[index].DeviceName+"',";
				contentStr+="StartLatitude:"+objectData[index].StartLatitude+",";
				contentStr+="StartLongitude:"+objectData[index].StartLongitude+",";
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

var objectData;
function getDataFromDistance(maxlat,minlat,maxlng,minlng){
	clearGridData();
	setTimeout(function(){
		var fullUrl='./common/lib/php/GetAllTraindataInDistance.php?maxlat='+maxlat+'&minlat='+minlat+'&maxlng='+maxlng+'&minlng='+minlng;
		$.ajax({
			url:fullUrl,
			type:"GET",
			contentType:"application/json;charset=utf-8",
			success: function(Jdata) {
				objectData=eval(Jdata);
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
					contentStr+="displayname:'<img src=\"../upload/user/"+objectData[index].UserImage+"\" width=\"72\" alt=\""+objectData[index].displayname+"\" />"+objectData[index].displayname+"',";
					contentStr+="name:'"+objectData[index].displayname+"',";
					contentStr+="UserImage:'"+objectData[index].UserImage+"',";
					contentStr+="Trainname:'<div style=\"cursor:pointer;color:#0000FF\" onclick=\"showDetail("+index+")\">"+objectData[index].Trainname+"</div>',";
					//contentStr+="Detail:'<div align=\"center\" style=\"cursor:pointer\" onclick=\"showDetail("+index+")\"><img src=\"./images/record/"+objectData[index].trainid+"/RoutePath.jpg\" /></div>',";
					contentStr+="Detail:'<div id=\"RouteDetail_"+index+"\" align=\"center\" style=\"cursor:pointer\" onclick=\"showDetail("+index+")\"><img src=\"../upload/point_thumbnail/"+objectData[index].trainid+".jpg\" style=\"width:200px;border:1px #cecece solid\"/></div>',";
					contentStr+="Description:'<div style=\"cursor:pointer;color:#0000FF\" onclick=\"showDetail("+index+")\">"+objectData[index].Description+"</div>',";
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
					contentStr+="CommentCount:"+objectData[index].CommentCount+",";
					contentStr+="PraiseCount:'<img src=\"./images/good.png\" width=24 height=24 onclick=\"giveSportPraise("+urd+","+index+")\"/ style=\"cursor:pointer\"><div id=\"Praise_"+index+"\">"+objectData[index].PraiseCount+"</div>',";
					contentStr+="CollectCount:'<img src=\"./images/plus.png\" width=24 height=24 onclick=\"addMySportList("+urd+","+index+")\"/ style=\"cursor:pointer\"><div id=\"FavCount_"+index+"\">"+objectData[index].FavSportList+"</div>'";
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

function addMySportList(uid,index){
	if(confirm('您確定要加入此運動路徑到自己的運動清單?')){
		$.ajax({
			url:'./common/lib/php/UpdateSportPlan.php',
			type:'POST',
			data:'user='+uid+'&trip='+objectData[index].trainid+'&tripname='+encodeURIComponent(objectData[index].Trainname),
			success: function(response) {
				var objectData=eval(response);
				switch(objectData[0].ModifyStatu){
					case 1:
						alert('新增完成');
						refreshMyFavSport();
						break;
					case 2:
						alert('您的最愛清單已經有此路徑');
						break;
				}
				$('#FavCount_'+index).html(objectData[0].count);
			},
			error: function() {
				alert("ERROR!!! by addMySportList click()");
			}
		});
	}
}

function giveSportPraise(uid,index){
	$.ajax({
		url:'./common/lib/php/UpdateSportPraise.php',
		type:'POST',
		data:'user='+uid+'&trip='+objectData[index].trainid,
		success: function(response) {
			var objectData=eval(response);
			switch(objectData[0].ModifyStatu){
				case 1:
					alert('評論完成');
					break;
				case 2:
					alert('您已經對此運動已經有評論');
					break;
			}
			$('#Praise_'+index).html(objectData[0].count);
		},
		error: function() {
			alert("ERROR!!! by addMySportList click()");
		}
	});

}

function refreshMyFavSport(){
	$.ajax({
			url:'./common/lib/php/GetSportPlan.php',
			type:"GET",
			contentType:"application/json;charset=utf-8",
			success: function(Jdata) {
				objectData=eval(Jdata);
				var contentStr="";
				var dataLength=objectData.length;
				for(var index=0;index<dataLength;index++){
					contentStr+="<li><a tabindex='-1' href='#'>"+objectData[index].TrainName+"</a></li>"
				}
				alert(contentStr);
				alert($('#MyFavSport').size());
				$('#MyFavSport').html(contentStr);			
			},
			error: function() {
				return eval('[{}]');
				alert("ERROR!!! by getDataByJSON()");
			}
		});
}
