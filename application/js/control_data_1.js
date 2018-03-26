var displayData;
var show_status;

if (show_status ==0){  
  var PublishTime_hide=true;
  var displayname_hide=true;
  var Detail_hide=true;
  var edit1_hide=false;
  var Public_access_hide=false;
  var multiselect=true;
  var del_if=true;
}else{
  var Detail_hide=false;
  var PublishTime_hide=false;
  var displayname_hide=false;
  var edit1_hide=true;
  var Public_access_hide=true;
  var multiselect=false;
  var del_if=false;
}

$(function(){

  $("#list").jqGrid({
		datatype: "local",
    editurl:"ajax/control_del.php",               // 刪除用的，navGrid都是往這邊
		width: 1280,
		height: 615,
		rowNum:5,
		hidegrid: false,
		colNames:['id',titleFilterDetail,titleFilterPublishTime,titleFilterActivityStartTime,share,
					titleSectionsDifficulty,titleFilterUser, titleFilterActivityName,titleFilterPhotos,
					titleFilterActivityDurtion,titleFilterActivityDistance,titleFilterActivityDesc,title_machine_type, 
					titleFilterMessage,titleFilterPraise,titleFilterCollect,edit_1,detail_info],

	colModel:[
      {name:'trainid',index:'trainid',width:5,align:"center",search:false,hidden:true,key:true}, 
			{name:'Detail',index:'Detail',width:80,align:"center",search:false,hidden:Detail_hide},
			{name:'PublishTime',index:'PublishTime', width:60, align:"center",sorttype:"date",search:false,hidden:PublishTime_hide},
			{name:'StartTime',index:'StartTime', width:60, align:"center",sorttype:"date",search:false},
      {name:'public_access',index:'public_access', width:17, align:"center",search:false,hidden:Public_access_hide},      
			{name:'slope_pic',index:'slope_pic', width:60, align:"center",search:false},
			{name:'displayname',index:'displayname', width:40,align:"center",search:false,hidden:displayname_hide},
			{name:'Trainname',index:'Trainname', width:90,align:"left",search:false},
			{name:'Photo',index:'Photo', width:22,align:"center",search:false,sorttype:'integer',formatter:'interger'},
			{name:'TotalTime',index:'TotalTime', width:70, align:"center",search:false},
			{name:'TotalDistance',index:'TotalDistance', width:50,align:"center",search:false},
			{name:'Description',index:'Description', width:70,align:"left",search:false},
      {name:'device_name',index:'device_name', width:40,align:"center",search:false},
			{name:'CommentCount',index:'CommentCount', width:30,align:"center",search:false,sorttype:'integer'},
			{name:'PraiseCount',index:'PraiseCount', width:15,align:"center",search:false,sorttype:'integer'},
			{name:'CollectCount',index:'CollectCount', width:15,align:"center",search:false,sorttype:'integer'},
	    {name:'edit1',index:'edit1', width:30,align:"center",search:false,hidden:edit1_hide},
      {name:'detail',index:'detail', width:35,align:"center",search:false} 
		], 

		pager: '#pager',
		viewrecords: true,
    srecordpos: 'right',
		hidegrid: false,
    sortname: 'id',
    sortorder: "desc", 
    multiselect: multiselect,              
		rowList : [5,10,20,30,50,100],
		//caption: titleListOfActivitiesByFilter,
		loadComplete: function () {
			$(this).find(">tbody>tr.jqgrow:visible:odd").addClass("myAltRowClass");
		},
    /*
		onSelectRow: function(id){
			if(id>0){
				showDetail(id-1);
			}
		}
    */
	});
	//$("#list").jqGrid('filterToolbar',{autosearch:true,searchOperators:true,searchOnEnter:false});
	setTimeout(function(){
		getDataFromDistance();
	},500);
  $("#list").jqGrid('navGrid','#pager',{add:false,del:del_if,edit:false,search:false,view:false,position:'left'},
                  {},
                  {},
                  {},
/*
                  {},
                  {delData: {
                             train_id: function() {
                                       var value_total=[];
                                        var sel_id = $("#list").jqGrid('getGridParam', 'selarrrow');
                                        for(var i=0; i<sel_id.length; i++){                                            
                                           var value = $("#list").jqGrid('getCell', sel_id[i], 'trainid');
                                              value_total.push(value);
                                        }                                                                     
                                        return value_total;                                        
                                   }
                            }
                   },
*/
                  {},
                  {}
       );

});




function getDataFromDistance(){
	startLoading();
	clearGridData();
	var fullUrl=requestPageURL;
	setTimeout(function(){
		$.ajax({
			url:fullUrl,
			type:"GET",
			contentType:"application/json;charset=utf-8",
			success: function(Jdata) {
        //console.log (Jdata);
				var objectData=eval(Jdata);
				var dataLength=objectData.length;
				var newJsonStr='';
				var contentStr='';
				var serialIndex=0;
        var public_access='';
				for(var index=0;index<dataLength;index++){
					serialIndex+=1;
					contentStr+="{";
					contentStr+="trainid:'"+objectData[index].id+"',";
					contentStr+="deviceid:'"+objectData[index].deviceID+"',";
          if ( objectData[index].public_access ==1)
             {public_access='Yes';}else{public_access='No';}
          contentStr+="public_access:'"+public_access+"',";					
          contentStr+="StartTime:'"+objectData[index].StartTime+"',";
					contentStr+="displayname:'<img src=\""+objectData[index].image+"\" width=\"36\" alt=\""+objectData[index].fullname+"\" /><p>"+objectData[index].fullname+"</p>',";
					contentStr+="name:'"+objectData[index].fullname+"',";
					contentStr+="UserImage:'"+objectData[index].image+"',";
					contentStr+="Trainname:'"+objectData[index].train_name+"',";
				  if (show_status ==1){ 	
             contentStr+="Detail:'<img src=\"../upload/point_thumbnail/"+objectData[index].trainid+".jpg\" style=\"width:120px;border:1px #cecece solid\"/>',";
					}
         contentStr+="Description:'"+objectData[index].train_description+"',";
					if(parseInt(objectData[index].PictureCount)>0){
						contentStr+="Photo:'<div align=\"center\"><img src=\"./images/photocollect.png\" width=\"28\" /><br/>("+objectData[index].PictureCount+")</div>',";
					}else{
						contentStr+="Photo:'',";
					}
					contentStr+="TotalTime:'"+calHrAndMin(parseInt(objectData[index].lTotalTime))+"',";
					contentStr+="TotalDistance:'"+(parseFloat(objectData[index].lTotalDistance)/1000).toFixed(2)+"',";
					contentStr+="PublishTime:'"+objectData[index].PostDatetime+"',";				
          contentStr+='slope_pic:"'+ objectData[index].slope_pic+'",';
          contentStr+='device_name:"'+ objectData[index].DeviceName+'",';
					contentStr+="StartLatitude:"+objectData[index].start_lat+",";
					contentStr+="StartLongitude:"+objectData[index].start_lng+",";
					contentStr+="CommentCount:"+objectData[index].comment_count+",";
					contentStr+="PraiseCount:"+objectData[index].PraiseCount+",";
					contentStr+="CollectCount:"+objectData[index].FavSportList+",";
          contentStr+="edit1:'<a target=\\\'_blank\\\' href=\\\'../person/edit.php?train_id="+objectData[index].trainid+"\\\'>"+edit_1+"</a>'"+",";		  
          contentStr+="detail:'<a target=\\\'_blank\\\' href=\\\'../train/train_detail.php?train_id="+objectData[index].trainid+"\\\'>"+detail_info+"</a>'";     
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
				
			}
		});
	
	},500);
}

function clearGridData(){
	$("#list").clearGridData(true).trigger("reloadGrid");
}

/*
function showDetail(index){
	window.parent.getHistoryByAjax(displayData[index].trainid,displayData[index].deviceid);
}
*/
function startLoading(){
	window.parent.showLoadingItem();
}

function LoadingComplete(){
	window.parent.LoadingItemComplete();
}
