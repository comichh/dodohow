//頁面初始化

function initialize(lat,lng) {
	var mapOptions = {
		zoom: 12,
		center: new google.maps.LatLng(parseFloat(lat),parseFloat(lng))
	};

	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
	map.setCenter(new google.maps.LatLng(parseFloat(lat),parseFloat(lng)));
	
	geocoder = new google.maps.Geocoder();
}


//新增活動，並標示圖標在地圖上
function createMarker(site, map,sportTypeID,targethtml){
	var siteLatLng = new google.maps.LatLng(site[1], site[2]);                   //  這裡才去轉座標
	var sportTypeImageUrl=getImageIconUrl(sportTypeID);
	var marker = new google.maps.Marker({
		position: siteLatLng,
		map: map,
		icon:sportTypeImageUrl,
		title: site[0],
		zIndex: site[3],
		html: site[4]
	});
	ActiveMapMarker.push(marker);              
  infowindow = new google.maps.InfoWindow();                // 這邊要設定大小

	google.maps.event.addListener(marker, "click", function (e) {   
    contentString=targethtml; 
    infowindow.setContent(contentString);
    infowindow.open(map,marker); 
      
	});
	return marker;
}
//由系統定時呼叫並移動活動的定焦 ，這個有問題
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
}
/*
function singleData_set_pos(singleData,result,i)
{
    singleData.push(parseFloat(result[i].start_lat));
		singleData.push(parseFloat(result[i].start_lng));
    return 	singleData;
}
*/





function geocoder_return(address)          // 名稱取一樣
{
      geocoder.geocode( {'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
        lat=results[0].geometry.location.lat();
        lng=results[0].geometry.location.lng();
				map.setCenter(results[0].geometry.location);
        map.setZoom(14);
				updatePosition(results[0].geometry.location.lat(),results[0].geometry.location.lng(),$('#addressFieldName').val())
				setTimeout(function(){
					refreshScroll();
				},1000);
			} else {
         alert(portHistory_errer_1);
			}
 });
}


function set_map_centert()
{
   temp=new google.maps.LatLng (23.58,120.58);      // 地圖置中定位用而已
   map.setCenter(temp);
   map.setZoom(2); 
   setTimeout(function(){refreshScroll();},1000);
}




