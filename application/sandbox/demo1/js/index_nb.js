var map;
var result;
var previousID=-1;
var moveMarker;
var jumpMarker;
var ActiveMapMarker=[];
var sites=[]
var geocoder;
var disEvVal;
var shareMarker;
var thisTripID;
var getDistanceRange=[];
getDistanceRange[0]=0 ;
getDistanceRange[1]=200;
var getTimeRange_1=24;
var lat;
var lng;
var infowindow;
var targethtml="";
var singleData=[]; 
var sportTypeImage="";


$(function(){
 $( "#slider-range_2" ).slider({
    range: true,
    min: 0,
    max: getDistanceRange[1],
    values: [ getDistanceRange[0], getDistanceRange[1] ],
    slide: function( event, ui ) {
    $( "#amount_2" ).html( "" + ui.values[ 0 ] + " - " + ui.values[ 1 ]+" km" );
	   getDistanceRange[0]=ui.values[0] ;
	   getDistanceRange[1]=ui.values[1];
    }
   });
  $( "#amount_2" ).html( "" + $( "#slider-range_2" ).slider( "values", 0 ) +" - " + $( "#slider-range_2" ).slider( "values", 1 )+" km" );
  
  $( "#slider-range-max" ).slider({
    range: "max",
    min: 0,
    max: 24,
    value: 24,
    slide: function( event, ui ) {
      $( "#amount_1" ).html("0 ~ "+ui.value+" hr" );
      getTimeRange_1=ui.value ;
      $("#slider-range-max").not(".ui-widget-header").css("background","blue");
      $("#slider-range-max .ui-widget-header").css("background","white");
    }
  });
  $( "#amount_1" ).html("0 ~ "+ $( "#slider-range-max" ).slider( "value" ) +" hr" );
// end


  $('#date_start,#date_end').dynDateTime({
    ifFormat:'%Y-%m-%d',
    showsTime: false
  });
  $('#date_start,#date_end').click(function(){
    $(".calendar").css("z-index","1000");
	});



	
	$('#reSort').click(function(){
		var selectSortValue=$('input[name=SortType]:checked').val();
    var getTimeRange=getTimeRange_1*60*60;
		var userName=$('#SearchByName').val().trim();
		var searchRunType=$('#SportType').val().trim();
		var searchByKeywordVal=$('#SearchByKeyword').val().trim();
		var selectPhotoExistValue=$('input[name=PhotoExist]:checked').val();
		var startDate=$('#date_start').val();
		var endDate=$('#date_end').val();
    var slope_diff = $('select[name="Difficulty[]"]').val() || [];
    if ( slope_diff =='0'){slope_diff ='';} 
		$('#ScrollFrame').attr('src',"scrollframe.php?SearchMode=2&type="+searchRunType+"&sortType="+selectSortValue
				+"&findUserName="+userName+"&timeRange="+getTimeRange+"&distanceRangeStart="+getDistanceRange[0]
				+"&distanceRangeEnd="+getDistanceRange[1]+"&keyword="+searchByKeywordVal+"&startDate="+startDate
				+"&endDate="+endDate+"&photo="+selectPhotoExistValue				
        +"&lat="+lat+"&lng="+lng+"&slope_diff="+slope_diff);
		$('#SortCollection').hide();
	});
	



	$('#FindByFilter').click(function(){
    var getTimeRange=getTimeRange_1*60*60;
		var userName=$('#SearchByName').val().trim();
		var searchRunType=$('#SportType').val().trim();
		var searchByKeywordVal=$('#SearchByKeyword').val().trim();
		var startDate=$('#date_start').val();
		var endDate=$('#date_end').val();
		var selectPhotoExistValue=$('input[name=PhotoExist]:checked').val();
    var slope_diff = $('select[name="Difficulty[]"]').val() || [];
    if ( slope_diff =='0'){slope_diff ='';}
		$('#ScrollFrame').attr('src',"scrollframe.php?SearchMode=3&type="
				+searchRunType+"&findUserName="+userName+"&timeRange="+getTimeRange+"&distanceRangeStart="
				+getDistanceRange[0]+"&distanceRangeEnd="+getDistanceRange[1]+"&keyword="+searchByKeywordVal
				+"&startDate="+startDate+"&endDate="+endDate+"&photo="+selectPhotoExistValue
			  +"&lat="+lat+"&lng="+lng+"&slope_diff="+slope_diff);
		$('#DeepSearch').hide();
		advenceSearch();
		runType=searchRunType;
	});


});
//重新設定圖片為全部未選取
function resetButtonBackground(){
  $("#showRunningRecord").css({"background-image":"url('../../../pic/train_detail/button_100x35_b.png')","height":"30px","padding":"0px 3px"});
  $("#showCycleRecord").css({"background-image":"url('../../../pic/train_detail/button_100x35_b.png')","height":"30px","padding":"0px 3px"});
}

//點選跑步時的置換圖片與參數設定
function resetButtonBackgroundRunning(){
	resetButtonBackground()
  $("#showRunningRecord").css({"background-image":"url('../../../pic/train_detail/button_100x35_u.png')","padding":"0px 3px"});
	$('#ScrollFrame').attr('src',"scrollframe.php?SearchMode=0&type=1");
	$('#SportType').val("1");
	runType="1";
}
//點選騎車時的置換圖片與參數設定
function resetButtonBackgroundCycle(){
	resetButtonBackground();
	//$('#showCycleRecord').attr('src',"./images/tab_Cycling_over.png");
  $("#showCycleRecord").css({"background-image":"url('../../../pic/train_detail/button_100x35_u.png')","height":"30px","padding":"0px 3px"});
	$('#ScrollFrame').attr('src',"scrollframe.php?SearchMode=0&type=2");
	$('#SportType').val("2");
	runType="2";
}

//切換成條件查詢模式
function switchDeepSearch(){
	if($('#DeepSearch').is(':visible')){
		$('#DeepSearch').hide();
    $('#DeepSearch').css({"z-index":"0","left":"0px"});
	}else{
		if($('#SortCollection').is(':visible')){
			$('#SortCollection').hide();
		}
    $('#DeepSearch').css({"z-index":"200","left":"0px"});
		$('#DeepSearch').show();
	}
}



//切換成排序模式
function switchSort(){
	if($('#SortCollection').is(':visible')){
		$('#SortCollection').hide();
    $('#SortCollection').css({"z-index":"0","left":"0px"});
	}else{
		if($('#DeepSearch').is(':visible')){
			$('#DeepSearch').hide();
		}
		$('#SortCollection').show();
    $('#SortCollection').css({"z-index":"200","left":"0px"});
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
          $("#ff img").css({"background-image":"url('../../../pic/train_detail/button_100x35_u.png')","height":"25px","padding":"8px 8px"});
			break;
		case "2":
			resetButtonBackground();
       $("#showCycleRecord").css({"background-image":"url('../../../pic/train_detail/button_100x35_u.png')","height":"30px","padding":"0px 3px"});
			break;
	}
}



//依據查詢的地址名稱，查詢後更新活動資料列
function codeAddress() {
	var address = $('#addressFieldName').val();
  if ( address !=''){
  	var LatlngArray=[];
	  if(address.indexOf(',')>0){                // 這個已經經過 Geocode
		  LatlngArray=address.split(',');
		  var latValType=!isNaN(LatlngArray[0]);
		  var lngValType=!isNaN(LatlngArray[1]);
		  if((latValType)&&(lngValType)){
       lat=parseFloat(LatlngArray[0]);
       lng=parseFloat(LatlngArray[1]);
		  	map.setCenter(new google.maps.LatLng(parseFloat(LatlngArray[0]),parseFloat(LatlngArray[1])));
        map.setZoom(14);    
			  setTimeout(function(){
				 refreshScroll();
			  },1000);
	  	}
	}else{
		geocoder_return(address);    //  google 和 baidu 分開
   
	}
 }else{
  // 空白，座標送 999 给他 
   lat=999;
   lng=999;
   updatePosition(lat,lng,' ');                     // 這個只是做更新資料庫
   set_map_centert();                               // google  和 baidu 不同  
 }
}




//更新資料表內最近查詢的地址
function updatePosition(lat,lng,address){
	$.ajax({
		url:'../../common/lib/php/UpdateLastPosition.php',
		type:'POST',
		data:'lastlat='+lat+'&lastlng='+lng+'&address='+address,
		success: function(response) {
			if(response!=1){
          //alert ('ok');
			}
		}
	});
}


//依據條件或地圖方框範圍，更新活動列的資料
function refreshScroll(){
  var getTimeRange=getTimeRange_1*60*60;
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
    +"&lat="+lat+"&lng="+lng);   
}

//頁面完成後，執行的動作
window.onload=function(){
//$(document).onload(function(){  
	setLastPosition();
  $(document).keydown(function(event){ 
    if(event.keyCode==13){
      codeAddress();
    }
  });

//});
}

//取得資料表內最近查詢的經緯度，初始化地圖       , 這邊還要改
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
          lat=parseFloat(jsonArray[0].latitude);
          lng=parseFloat(jsonArray[0].longitude);
				}else{
					//initialize(initLat,initLng);
				}
			}else{
				//initialize(initLat,initLng);
			}     
			  codeAddress('addressFieldName');    
		},
		error: function() {		
		}
	});
}



//將由條件或地圖範圍取得的所有活動，透過圖示險是在地圖上
function putActivityOnMap(){               //  這個要分開 google 和  baidu ，但是有許多是共用的
	clearAllMarker();
	for(var i=0;i<result.length;i++){
		singleData=[];
		sportTypeImage=getSportTypeImgURL(result[i].SportType);
		singleData.push(result[i].fullname);

    // 這邊 baidu 和 google 的要不同
    singleData.push(parseFloat(result[i].start_lat));
		singleData.push(parseFloat(result[i].start_lng));


		singleData.push(0);
		if(result[i].train_name!=""){
			if(result[i].train_name.length>13){       // 最多 13 字, 
				trainName=result[i].train_name.substr(1,12)+'...';	
			}else{
				trainName=result[i].train_name;
			}
		}else{
			trainName="&nbsp;"
		}   
    targethtml="<div id='targethtml_tatal'>";
		targethtml+="<div class='targethtml_title'>"+result[i].fullname+'</div>';
		targethtml+='<table><tr><td width="30%">';
		targethtml+='<img style="max-height:50px;max-width:60px" src="'+result[i].image+'">';
    targethtml+='<img style="margin-top:10px;width:40px" src="./images/'+sportTypeImage+'"> </td>';
    targethtml+='<td>'+ titleCumulativeTime+':'+getSportTime(result[i].AccTime)+'<br>';
    targethtml+=titleCumulativeDistance+':'+getDistanceKmValue(result[i].AccDistance)+' km<br>';
    targethtml+=titleHighestElevation+':'+result[i].MaxhighestEle+'m<br>'; 
    targethtml+=titleCumulativeAscent+':'+result[i].AccRise+'m';
    targethtml+='</td></tr>';
		targethtml+='</table>';
		targethtml+='<br>';
    targethtml+='<div class="targethtml_title">'+trainName+'</div>';
		targethtml+='<table>'
		targethtml+='<tr><td>'+titleTotalTime+'：'+getSportTime(result[i].lTotalTime)+'<br>'+titleTotalDistance+'：'+getDistanceKmValue(result[i].lTotalDistance)+' km<br>'+titleTotalCalory+'：'+result[i].Calory+' Kcal<br>';
    targethtml+=titleSectionsDifficulty+':<span style="margin-top:25px">'+result[i].slope_pic+'</span>';
    targethtml+='</td><td><img src="'+routeImageBaseUrl+'/'+result[i].id+'.jpg" width="80"></td></tr>';
    targethtml+="<tr><td id='show_info'>";
    targethtml+='<div><img src="images/message.png"/></div><div>'+result[i].comment_count+'</div>';
    targethtml+='<div><img src="images/like.png"/></div><div> '+result[i].FavSportList+'</div>';
    targethtml+='<div><img src="images/Download.png"/></div><div>'+result[i].PraiseCount+'</div>';
    targethtml+='<div><img src="images/Watch.png"/></div><div id="ViewCnt_'+i+'">'+result[i].ViewCount+'</div>';   
    targethtml+='</td></tr></table>';
    targethtml+='<div id="div_align"><a class="button_css3 detail_button" target="_blank"  href="../../../train/train_detail.php?train_id='+result[i].id+'">Detail</a></div>';    	   
    targethtml+='</div>';
		singleData.push(targethtml);
		createMarker(singleData, map,result[i].SportType,targethtml);    
	}
  if (map_config==2){
    new_baidu_pos();
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