var map;
var result;
var previousID=-1;
var moveMarker;
var jumpMarker;
var ActiveMapMarker=[];
var ib = new InfoBox();
var sites=[]
var geocoder;
var disEvVal;
var initLat=25.132397;
var initLng=121.644;
var shareMarker;
var thisTripID;

$(function(){
	if(showAlert===1){
		alert("建議最佳效果，請使用IE最新版本(IE Ver.11以上");
	}
	
	$('#reSort').click(function(){
		var selectSortValue=$('input[name=SortType]:checked').val();
		var getDistanceRange=[];
		getDistanceRange[0]=0;
		getDistanceRange[1]=$('#TotalDistanceSlider').val();
		var getTimeRange=$('#TotalTimeSlider').val();
		var userName=$('#SearchByName').val().trim();
		var searchRunType=$('#SportType').val().trim();
		var searchByKeywordVal=$('#SearchByKeyword').val().trim();
		var selectPhotoExistValue=$('input[name=PhotoExist]:checked').val();
		var startDate=$('#date_start').val();
		var endDate=$('#date_end').val();
		var NorthEastLat=map.getBounds().getNorthEast().lat();
		var NorthEastLng=map.getBounds().getNorthEast().lng();
		var SouthWestLat=map.getBounds().getSouthWest().lat();
		var SouthWestLng=map.getBounds().getSouthWest().lng();
		$('#ScrollFrame').attr('src',"scrollframe.php?SearchMode=2&type="+searchRunType+"&sortType="+selectSortValue
				+"&findUserName="+userName+"&timeRange="+getTimeRange+"&distanceRangeStart="+getDistanceRange[0]
				+"&distanceRangeEnd="+getDistanceRange[1]+"&keyword="+searchByKeywordVal+"&startDate="+startDate
				+"&endDate="+endDate+"&photo="+selectPhotoExistValue
				+"&NE_Lat="+NorthEastLat+"&NE_Lng="+NorthEastLng+"&SW_Lat="+SouthWestLat+"&SW_Lng="+SouthWestLng);
		$('#SortCollection').hide();
	});
	
	$('#FindByFilter').click(function(){
		var getDistanceRange=[];
		getDistanceRange[0]=0;
		getDistanceRange[1]=$('#TotalDistanceSlider').val();
		var getTimeRange=$('#TotalTimeSlider').val();
		var userName=$('#SearchByName').val().trim();
		var searchRunType=$('#SportType').val().trim();
		var searchByKeywordVal=$('#SearchByKeyword').val().trim();
		var startDate=$('#date_start').val();
		var endDate=$('#date_end').val();
		var selectPhotoExistValue=$('input[name=PhotoExist]:checked').val();
		var NorthEastLat=map.getBounds().getNorthEast().lat();
		var NorthEastLng=map.getBounds().getNorthEast().lng();
		var SouthWestLat=map.getBounds().getSouthWest().lat();
		var SouthWestLng=map.getBounds().getSouthWest().lng();
		$('#ScrollFrame').attr('src',"scrollframe.php?SearchMode=3&type="
				+searchRunType+"&findUserName="+userName+"&timeRange="+getTimeRange+"&distanceRangeStart="
				+getDistanceRange[0]+"&distanceRangeEnd="+getDistanceRange[1]+"&keyword="+searchByKeywordVal
				+"&startDate="+startDate+"&endDate="+endDate+"&photo="+selectPhotoExistValue
				+"&NE_Lat="+NorthEastLat+"&NE_Lng="+NorthEastLng+"&SW_Lat="+SouthWestLat+"&SW_Lng="+SouthWestLng);
		$('#DeepSearch').hide();
		advenceSearch();
		runType=searchRunType;
	});
	
	var leftStart=parseInt((getBrowserWidth()-1280)/2)+96;
	$('#DeepSearch').css('left',leftStart+"px");
	$('#SortCollection').css('left',leftStart+"px");
	$('#WrapperTableContet').css('height',getBrowserHeight()+"px");
		
	$("#show_comment").click(function(){ 	
		commentByAjax(thisTripID);
	});
	
	//$('#ScrollFrame').attr('src',"scrollframe.php?type=0");

});
//重新設定圖片為全部未選取
function resetButtonBackground(){
	$('#showRunningRecord').attr('src',"./images/tab_Running_out.png");
	$('#showCycleRecord').attr('src',"./images/tab_Cycling_out.png");
}
//取得瀏覽器視窗寬度
function getBrowserWidth() {
	if ($.browser.msie) {
		return document.compatMode =="CSS1Compat"?document.documentElement.clientWidth:document.body.clientWidth;
	} else {
		return self.innerWidth;
	}
} 
//取得瀏覽器視窗高度
function getBrowserHeight() {
	if ($.browser.msie) {
		return document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight :
				 document.body.clientHeight;
	} else {
		return self.innerHeight;
	}
}
//點選跑步時的置換圖片與參數設定
function resetButtonBackgroundRunning(){
	resetButtonBackground()
	$('#showRunningRecord').attr('src',"./images/tab_Running_over.png");
	$('#ScrollFrame').attr('src',"scrollframe.php?SearchMode=0&type=1");
	$('#SportType').val("1");
	runType="1";
}
//點選騎車時的置換圖片與參數設定
function resetButtonBackgroundCycle(){
	resetButtonBackground();
	$('#showCycleRecord').attr('src',"./images/tab_Cycling_over.png");
	$('#ScrollFrame').attr('src',"scrollframe.php?SearchMode=0&type=2");
	$('#SportType').val("2");
	runType="2";
}
//切換成條件查詢模式
function switchDeepSearch(){
	if($('#DeepSearch').is(':visible')){
		$('#DeepSearch').hide();
	}else{
		if($('#SortCollection').is(':visible')){
			$('#SortCollection').hide();
		}
		$('#DeepSearch').show();
	}
}
//切換成排序模式
function switchSort(){
	if($('#SortCollection').is(':visible')){
		$('#SortCollection').hide();
	}else{
		if($('#DeepSearch').is(':visible')){
			$('#DeepSearch').hide();
		}
		$('#SortCollection').show();
	}
}
//切換使用者點選運動類別後，圖示更換
function advenceSearch(){
	switch($('#SportType').val().trim()){
		case "0":
			resetButtonBackground();
			break;
		case "1":
			resetButtonBackground();
			$('#showRunningRecord').attr('src',"./images/tab_Running_over.png");
			break;
		case "2":
			resetButtonBackground();
			$('#showCycleRecord').attr('src',"./images/tab_Cycling_over.png");
			break;
	}
}
//頁面初始化
function initialize(lat,lng) {
	var mapOptions = {
		zoom: 8,
		center: new google.maps.LatLng(parseFloat(lat),parseFloat(lng)),
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
	map.setCenter(new google.maps.LatLng(parseFloat(lat),parseFloat(lng)));
	google.maps.event.addListener(map, "click", function() {
		ib.close();
	});
	
	google.maps.event.addListener(map, "dragend", function() {
		refreshScroll();
	});
	
	infowindow = new google.maps.InfoWindow({
		content: "loading..."
	});
	
	geocoder = new google.maps.Geocoder();
}
//將由條件或地圖範圍取得的所有活動，透過圖示險是在地圖上
function putActivityOnMap(){
	var len=result.length;
	var singleData=[];
	var zIndex=0;
	clearAllMarker();
	var targethtml="";
	var sportTypeImage="";

	
	for(var i=0;i<len;i++){
		singleData=[];
		sportTypeImage=getSportTypeImgURL(result[i].SportType);
		singleData.push(result[i].fullname);
		singleData.push(parseFloat(result[i].start_lat));
		singleData.push(parseFloat(result[i].start_lng));
		singleData.push(0);
		if(result[i].train_name!=""){
			if(result[i].train_name.length>13){
				trainName=result[i].train_name.substr(1,12)+'...';	
			}else{
				trainName=result[i].train_name;
			}
		}else{
			trainName="&nbsp;"
		}
		targethtml='<font style="position:relative;left:10px;font-style:italic;font-size:18px;color:#CD6600;font-weight:900;">'+result[i].fullname+'</font>';
		targethtml+='<div style="position:relative;top:-6px">';
		targethtml+='<table border=0 width="98%" cellspacing=0 cellpadding=0>';
		targethtml+='	<tr><td width="30%"><div style="height:60px;position:relative;left:5px"><img style="max-height:60px" src="'+result[i].image+'" width="60"></div></td><td><div style="font-size:12px;color:#262626;font-weight:900">'+ titleCumulativeTime+':'+getSportTime(result[i].AccTime)+'</div><div style="color:#262626;font-size:12px;font-weight:900">'+titleCumulativeDistance+':'+getDistanceKmValue(result[i].AccDistance)+' km</div><div style="color:#262626;font-size:12px;font-weight:900">'+titleHighestElevation+':'+result[i].MaxhighestEle+'m</div><div style="color:#262626;font-size:12px;font-weight:900;">'+titleCumulativeAscent+':'+result[i].AccRise+'m</div><div style="position:absolute;left:200px;top:30px"><img src="./images/'+sportTypeImage+'" width="40"></div></td></tr>';
		targethtml+='	<tr><td colspan=2 height=20><div style="float:right"><img src="./images/Medals.png" style="height:30px" /></div><div style="float:right"><img src="./images/Medals.png" style="height:30px" /></div><div style="float:right"><img src="./images/Medals.png" style="height:30px" /></div></td></tr>';
		targethtml+='</table>';
		targethtml+='</div>';
		targethtml+='<div style="width:94%;position:relative;left:4px;top:8px"><table width="100%">'
		targethtml+='	<tr><td colspan="2" style="font-size:14px;color:#ffffff;font-weight:900;">'+trainName+'</td></tr>'
		targethtml+='	<tr><td valign="top"><div style="font-size:12px;color:#ffffff;height:20px">'+titleTotalTime+'：'+getSportTime(result[i].lTotalTime)+'</div><div style="font-size:12px;color:#ffffff;height:20px">'+titleTotalDistance+'：'+getDistanceKmValue(result[i].lTotalDistance)+' km</div><div style="font-size:12px;color:#ffffff;height:20px">'+titleTotalCalory+'：'+result[i].Calory+' cal</div><div style="font-size:12px;color:#ffffff;height:20px">'+titleSectionsDifficulty+'：★★★★★</div></td><td align="right" onclick="getHistoryByAjax('+result[i].id+',\''+result[i].deviceID+'\',\''+result[i].image+'\','+i+')"><img src="'+routeImageBaseUrl+'/'+result[i].id+'.jpg" style="cursor:pointer;border:1px #cecece solid" width="80"></td></tr>'
		targethtml+='	<tr><td valign="top" colspan=2><div style="position:relative;top:10px;color:#ffffff"><table><tr><td><img src="./images/like.png" /></td><td width="20">'+result[i].PraiseCount+'</td><td><img src="./images/message.png" /></td><td width="20">'+result[i].comment_count+'</td><td><img src="./images/Watch.png" /></td><td width="20" id="ViewCnt_'+i+'">'+result[i].ViewCount+'</td><td><img src="./images/Download.png" /></td><td width="16">'+result[i].FavSportList+'</td></tr></table></div></tr>'
		targethtml+='</table></div>';
		targethtml+='<div style="position:absolute;top:288px;left:224px;cursor:pointer;width:30px;height:26px" onclick="getHistoryByAjax('+result[i].id+',\''+result[i].deviceID+'\',\''+result[i].image+'\','+i+')"></div>';
		
		singleData.push(targethtml);
		createMarker(singleData, map,result[i].SportType);
	}
}
//換算成公里小數一位
function getDistanceKmValue(distanceValue){

	var kmValue=parseFloat(distanceValue)/1000;
	return Math.round(kmValue*100)/100;
	
}
//換算活動時間為hh:mm:rr格式
function getSportTime(sportTime){
	return calHrAndMinWithSecond(parseFloat(sportTime)/10);
}
//取得點選的圖示
function getSportTypeImgURL(id){
	switch(parseInt(id)){
		case 1:
			return 'run.png'; 
			break;
		case 2:
			return 'bike.png'; 
			break;
	}
}
//替換點選的圖示
function getImageIconUrl(index){
	switch(parseInt(index)){
		case 1:
			return './images/info.gif';
			break;
		case 2:
			return './images/Green.gif';
			break;
		default:
			return './images/info.gif';
			break;
	}
}
//新增活動，並標示圖標在地圖上
function createMarker(site, map,sportTypeID){
	var siteLatLng = new google.maps.LatLng(site[1], site[2]);
	var sportTypeImageUrl=getImageIconUrl(sportTypeID);
	var marker = new google.maps.Marker({
		position: siteLatLng,
		map: map,
		icon:sportTypeImageUrl,
		title: site[0],
		zIndex: site[3],
		html: site[4] /* ,
		icon: "http://visualartscambridge.org/wp-content/uploads/2013/03/map-pin.png" this icon no longer available */
	});
	var boxText = document.createElement("div");
	boxText.style.cssText = "border-radius:10px;width:250px;height:330px;margin-top: 8px;padding:5px;background:url(./images/big.jpg);background-repeat:no-repeat;";
	boxText.innerHTML = marker.html;

	var myOptions = {
		 content: boxText
		,disableAutoPan: false
		,maxWidth: 0
		,pixelOffset: new google.maps.Size(-140, 0)
		,zIndex: null
		,boxStyle: { 
		  //background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/tags/infobox/1.1.12/examples/tipbox.gif') no-repeat"
		  background: "url(./images/arraw.gif) no-repeat"
		  ,opacity: 0.9
		  ,width: "224px"
		 }
		,closeBoxMargin: "20px -20px 10px 20px"
		,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
		,infoBoxClearance: new google.maps.Size(1, 1)
		,isHidden: false
		,pane: "floatPane"
		,enableEventPropagation: false
	};
	ActiveMapMarker.push(marker);
	google.maps.event.addListener(marker, "click", function (e) {
		 ib.close();
		 ib.setOptions(myOptions);
		 ib.open(map, this);
	});
	return marker;
}
//由系統定時呼叫並移動活動的定焦
function locateMarker(index){
var train_id=result[index].id;
var train_userid=result[index].userid;
$("#show_vscroll_div").html("<iframe src='Vscrollframe.php?id="+train_id+"&train_userid="+train_userid+"' scrolling='no' allowtransparency='true' style='background-color:#efefef;border:none;height:100%;width:100%;text-align:center;vertical-align:center'></iframe>");


	if(typeof(ActiveMapMarker)!='undefined'){
		if(previousID!==-1){
			ActiveMapMarker[previousID].setIcon(getImageIconUrl(result[previousID].SportType));
			ActiveMapMarker[previousID].setZIndex(0);
		}
		ActiveMapMarker[index].setIcon('./images/Active_Marker_1.png');
		ActiveMapMarker[index].setZIndex(1000);
		previousID=index;
	}
}
//使用者點選某一個活動後產生的動作
function selectRecord(index){
	var train_id=result[index].id;
	thisTripID=result[index].id;
	var train_userid=result[index].userid;
	$("#show_vscroll_div").html("<iframe src='Vscrollframe.php?id="+train_id+"&train_userid="+train_userid+"' scrolling='no' allowtransparency='true' style='background-color:#efefef;border:none;height:100%;width:100%;text-align:center;vertical-align:center'></iframe>");
	//console.log(result[index]);
	locateMarker(index);
	if(map.getZoom()<13){
		map.setZoom(13);
	}
	map.setCenter(new google.maps.LatLng(parseFloat(result[index].start_lat),parseFloat(result[index].start_lng)));
	google.maps.event.trigger(ActiveMapMarker[index], 'click');
	setTimeout(function(){
		$.ajax({
			url:'../../common/lib/php/UpdateViewCnt.php',
			type:'POST',
			data:'tripID='+train_id,
			success: function(response){
				var jsonArray=eval('('+response+')');
				if(jsonArray[0].result==="1"){
					$('#ViewCnt_'+index).html(jsonArray[0].returnVal+'');
				}else{
					$('#ViewCnt_'+index).html('--');
				}
				
			},
			error: function() {
				//alert("ERROR!!! by UpdateSettings click()");
			}
		});
	},500);
	
}
//清空所有的活動圖標
function clearAllMarker(){
	var ActiveMapMarkerLength=ActiveMapMarker.length;
	for(var i=0;i<ActiveMapMarkerLength;i++){
		ActiveMapMarker[i].setMap(null);
	}
	ActiveMapMarker=[];
	previousID=-1;
	ib.close();
}
//頁面完成後，執行的動作
window.onload=function(){
	setLastPosition();
}
//依據查詢的地址名稱，查詢後更新活動資料列
function codeAddress(addressFieldName) {
	var address = $('#addressFieldName').val();
	var LatlngArray=[];
	if(address.indexOf(',')>0){
		LatlngArray=address.split(',');
		var latValType=!isNaN(LatlngArray[0]);
		var lngValType=!isNaN(LatlngArray[1]);
		if((latValType)&&(lngValType)){
			map.setCenter(new google.maps.LatLng(parseFloat(LatlngArray[0]),parseFloat(LatlngArray[1])));
			setTimeout(function(){
				refreshScroll();
			},1000);
		}
	}else{
		geocoder.geocode( {'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				updatePosition(results[0].geometry.location.lat(),results[0].geometry.location.lng(),$('#addressFieldName').val())
				setTimeout(function(){
					refreshScroll();
				},1000);
			} else {
				 alert('Geocode was not successful for the following reason: ' + status);
			}
		});
	}
}
//依據條件或地圖方框範圍，更新活動列的資料
function refreshScroll(){
	var NorthEastLat=map.getBounds().getNorthEast().lat();
	var NorthEastLng=map.getBounds().getNorthEast().lng();
	var SouthWestLat=map.getBounds().getSouthWest().lat();
	var SouthWestLng=map.getBounds().getSouthWest().lng();
	var getDistanceRange=[];
	getDistanceRange[0]=0;
	getDistanceRange[1]=$('#TotalDistanceSlider').val();
	var getTimeRange=$('#TotalTimeSlider').val();
	var userName=$('#SearchByName').val().trim();
	var searchRunType=$('#SportType').val().trim();
	var searchByKeywordVal=$('#SearchByKeyword').val().trim();
	var startDate=$('#date_start').val();
	var endDate=$('#date_end').val();
	var selectPhotoExistValue=$('input[name=PhotoExist]:checked').val();
	$('#ScrollFrame').attr('src',"scrollframe.php?SearchMode=3&type="
		+searchRunType+"&findUserName="+userName+"&timeRange="+getTimeRange+"&distanceRangeStart="
		+getDistanceRange[0]+"&distanceRangeEnd="+getDistanceRange[1]+"&keyword="+searchByKeywordVal
		+"&startDate="+startDate+"&endDate="+endDate+"&photo="+selectPhotoExistValue
		+"&NE_Lat="+NorthEastLat+"&NE_Lng="+NorthEastLng+"&SW_Lat="+SouthWestLat+"&SW_Lng="+SouthWestLng);
	
}
//更新資料表內最近查詢的地址
function updatePosition(lat,lng,address){
	$.ajax({
		url:'../../common/lib/php/UpdateLastPosition.php',
		type:'POST',
		data:'lastlat='+lat+'&lastlng='+lng+'&address='+address,
		success: function(response) {
			if(response!=1){
			}
		},
		error: function() {
			
		}
	});
}
//取得資料表內最近查詢的經緯度，初始化地圖
function setLastPosition(){
	$.ajax({
		url:'../../common/lib/php/GetLastPosition.php',
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {
			var jsonArray=eval('('+Jdata+')');
			if(jsonArray.length>0){
				$('#addressFieldName').val(jsonArray[0].LastLddress);
				if(($.isNumeric(jsonArray[0].latitude))&&($.isNumeric(jsonArray[0].longitude))){
					initialize(parseFloat(jsonArray[0].latitude),parseFloat(jsonArray[0].longitude));
				}else{
					initialize(initLat,initLng);	
				}
			}else{
				initialize(initLat,initLng);
			}
			//$('#ScrollFrame').attr('src','scrollframe.php?SearchMode=0&type=0');
			codeAddress('addressFieldName');
		},
		error: function() {
			
		}
	});
}
//取得活動明細
function getHistoryByAjax(id,deviceID,imgUrl,index){
	//do do something
}
function commentByAjax(tripID){  
   $("#comment").html("");                   
   $("#new_comment").hide();    
   $.post('ajax/comment1.php', {tripID:tripID}, function(data){
    $("#comment").html(data);
    $("#comment").show();
	  $("[id^=reply]").click(function(){
	   content=$(".input-block-level").val();
	   id=$(this).attr("id");    
	   $.post('ajax/comment_write.php', {content:content,id:id}, function(data){
       $("#new_comment").html(data);
       $("#new_comment").show();
       $("#comment").hide();
     });
	  });
	// 巢狀回覆 
	$("[id^=content_new_reply]").hide();
	$("[id^=new_reply]").click(function(){
	  id=$(this).attr("id");  
	  $("#content_"+id).show();
	  $("#"+id).hide();   
	   $("[id^=submit_new_reply]").click(function(){
			submit_id=$(this).attr("id");
			content=$("#content_"+id+" .input-block-level" ).val();  
			$.post('ajax/comment_nested_write.php', {content:content,submit_id:submit_id}, function(data){
        $("#new_comment").html(data);
        $("#new_comment").show(data); 
        $("#comment").hide();
			});
	   });
  	});
 // 刪除
	 $("[id^=kill]").click(function(){
      submit_id=$(this).attr("id");
     	$.post('ajax/comment_kill.php', {submit_id:submit_id}, function(data){
        $("#new_comment").html(data);
        $("#new_comment").show(data); 
        $("#comment").hide(); 
      }); 
    });
   });
     $("#comment").show();
}
