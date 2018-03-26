/*
brain 設定的兩種走法 ，要整合這兩支 js 現在相當煩人
第一種：按下搜尋：或是第一次進入，走 control_data2.php 
第二種：進階搜尋：走 control_data1.php
*/

var userName;
var show_status;
var id;
var map;
var markers = [];
var tripID="";
var societies_select="0";
var pageLoaded=false;
var shareMarker;
var geocoder;
var activityWindow;
var activityWindow2;

var getDistanceRange=[];
getDistanceRange[0]=0 ;
getDistanceRange[1]=200;
var getTimeRange_1=24;

var next_page='control_data_2.php';


window.onload=function(){
	getLastPositionNearActivity();
}
$(function() {
	initialize();
// 	 滑動選單
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



	$('#FilterAdvSearch').click(function(){
   $('#DeepSearch').css({
          position:'absolute',
          top: $(this).offset().top  + 'px' ,
          left: $(this).offset().left +$(this).width()+ 'px',
          zIndex:1000,       
   }).toggle();
	});

	$('#addressFieldName').change(function(){
		$('#AddressSearch').val($('#addressFieldName').val());
	});
	
  //取得分享出來的活動紀錄資料
	$('#Search').click(function(){
    searchActivityByFilter();
	});
	
  $(document).keydown(function(event){ 
    if(event.keyCode==13){
      $('#SearchByTop').click(); 
    }
  });   
	$('#SearchByTop').click(function(){
		searchActivityBycodeAddress('addressFieldName');
	});

	$('#closeFilterWindow').click(function(){
		$('#FilterModal').hide();
	});
});






//透過地址取得附近的活動資料 ，第一次有住址的時候，預設也是走這支 , 只負責把資料傳給 php 而已
function searchActivityBycodeAddress(addressFieldName) {
	var address = document.getElementById(addressFieldName).value;
  if ( address !=''){
     geocoder_return(address);         // 名稱取一樣
  }else{
   var url=next_page+
				"?lat="+"999"+
				"&lng="+"999";
    $('#iframe_table').attr('src',url);
    // 空值也不更新
    if (show_status ==1){            // 自己紀錄那頁，會搜尋空值，這種情況不更新  
	    updatePosition('999','999',' ');    // 空值沒有更新
    }
  }
}

// 進階搜尋
function searchActivityByFilter(){
  if (show_status ==1){     
	   var userName=$('#SearchByName').val().trim();
  }
  var getTimeRange=getTimeRange_1*60*60;
	var searchRunType=$('#SportType').val().trim();
	var searchByKeywordVal=$('#SearchByKeyword').val().trim();
	var startDate=$('#date_start').val();
	var endDate=$('#date_end').val();
	var selectPhotoExistValue=$('input[name=PhotoExist]:checked').val();
  var slope_diff = $('select[name="Difficulty[]"]').val() || [];
  if ( slope_diff =='0'){slope_diff ='';}

	var getUrl="control_data_1.php?SearchMode=3&type="
			+searchRunType+"&findUserName="+userName+"&timeRange="+getTimeRange+"&distanceRangeStart="
			+getDistanceRange[0]+"&distanceRangeEnd="+getDistanceRange[1]+"&keyword="+searchByKeywordVal
			+"&startDate="+startDate+"&endDate="+endDate+"&photo="+selectPhotoExistValue+"&slope_diff="+slope_diff;
  // iframe 傳值過去
	$('#iframe_table').attr('src',getUrl);
	$('#DeepSearch').hide();
}

// 這個是什麼都不做，進來第一次就能夠自動搜尋一次
function getLastPositionNearActivity(){
	$.ajax({
		url:'./common/lib/php/GetLastPosition.php',
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {
			var jsonArray=eval('('+Jdata+')');
			if(jsonArray.length>0){
				$('#addressFieldName').val(jsonArray[0].LastLddress);
				$('#AddressSearch').val(jsonArray[0].LastLddress);
				setTimeout(function(){			
						$('#SearchByTop').trigger('click');          				
				},500);
			}   
		},
		error: function() {		
		}
	});
}
//顯示擷取訊息
function showLoadingItem(){
	$('#LoadTripItems').show();
}
//隱藏擷取訊息
function LoadingItemComplete(){
	$('#LoadTripItems').hide();
}

//更新資料表內最近查詢的地址
function updatePosition(lat,lng,address){
	$.ajax({
		url:'./common/lib/php/UpdateLastPosition.php',
		type:'POST',
		data:'lastlat='+lat+'&lastlng='+lng+'&address='+address,
		success: function(response) {
			if(response!=1){
			}
		}
	});
}

