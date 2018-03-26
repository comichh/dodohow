for (var i = 0; i <beaches.length; i++) {  
     var beach = beaches_obj[i];     
     myLatLng1[i] = new google.maps.LatLng(beach.latitude ,beach.longitude);  
} 
delete beaches_obj;


$(document).ready(function(){ 
 // google map 放大縮小
   $('#map_right1').click(function() {
      $('#map-canvas').css("height","600px"); 
      google.maps.event.trigger(map, 'resize');
      $('#map_right1').hide();
      $('#map_right2').show();
   });
   $('#map_right2').click(function() {
      $('#map-canvas').css("height","400px");  
      $('#map_right1').show();
      $('#map_right2').hide();   
   });



});  




function initialize() {
  var myLatlng = new google.maps.LatLng(beaches_obj[0].latitude, beaches_obj[0].longitude );
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(beaches_obj[0].latitude, beaches_obj[0].longitude),
    zoomControl: true,
    zoomControlOptions: {
        style: google.maps.ZoomControlStyle.LARGE,
        position: google.maps.ControlPosition.RIGHT_CENTER
    },
  }   
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);  
  set_path();
  if ( beaches_pic !=null){
    set_pic_markers(beaches_pic);
  }
  //var market_play=window.setInterval("setMarkers();",10000);       // 自動播放
}


 
function set_path() { 
    create_path = new google.maps.Polyline({
      path: myLatLng1,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
     });
   create_path.setMap(map); 
}

// 放上圖片的 marker , 
function set_pic_markers(beaches_pic)     
{ 
 var beaches_pic_obj= eval(beaches_pic);         
  for (var i = 0; i <beaches_pic.length; i++) {  
     beach_pic = beaches_pic_obj[i];
     myLatLng_pic = new google.maps.LatLng(beach_pic.pic_lat ,beach_pic.pic_lng);   
        marker_pic = new google.maps.Marker({
           position: myLatLng_pic,                 
           icon:"../pic/train_detail/camera.png"                         // 照相機圖片       
    });   
    contentString="<a target='_black' href='show.php?user_id="+train_own_id+"&train_id="+train_id+"'><img style='height:50px;width:50px;' class='map_small_pic' src='../upload/trip_photo/"+train_own_id+"/"+train_id+"/"+beach_pic.pic_name+"'/></a>";  
    setinfowindow(marker_pic,contentString);                                // 地圖上的 info window 
    markers_pic.push(marker_pic);
  }       
  for (var i = 0; i <beaches_pic.length; i++) {  
      markers_pic[i].setMap(map);    
  }
}

// 播放用
function setMarkers() {           // 播放用的 key 第一點是 0 
for(i in markers){
  markers[i].setMap(null);      // 這個是清除播放產生的點
}
// 清除自己點擊的點，
for(i in markers_1){
  markers_1[i].setMap(null);                     
}   
  key++;    
    if (key > play_final_point_key){  
       //key=key- beaches.length;               // 這樣會無限重播
       window.clearInterval(market_play );      // 一循環停止
    }   
    beach_now = beaches_obj[key];         // 這個是出發點，但是判斷是用 key     
    var myLatLng = new google.maps.LatLng(beach_now.latitude, beach_now.longitude);
    var marker = new google.maps.Marker({
        position: myLatLng,             
    });   
    //markers.push(marker);
    markers[key]=marker;
    markers[key].setMap(map);    
     //map.setCenter(myLatLng);                    // 地圖重新置中,用了 marker 好像來不急產生
     add_highchart_line(key);                     // 連動 high chart   , 是用 key 控制，所以也好了
     
}




// 點地圖上小圖，秀小圖資訊
function setinfowindow(marker_pic,contentString)
{     
    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker_pic, 'click', function() {
    infowindow.setContent(contentString);
    infowindow.open(map,marker_pic);  
  });
}











google.maps.event.addDomListener(window, 'load', initialize);
