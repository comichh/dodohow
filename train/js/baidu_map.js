var beach_pic_point=[]; 
var infoWindow;
var baidu_change_status=false;
var t;

for (var i = 0; i <beaches.length; i++) {  
     var beach = beaches_obj[i];     
     myLatLng1[i] = new BMap.Point(beach.longitude,beach.latitude);
}
BMap.Convertor.transMore(myLatLng1,0,callback); 
//console.log (myLatLng1[0]); 
delete beaches_obj;

$(document).ready(function(){

  t=setInterval(function(){        // 轉換 baidu 座標
   if (baidu_change_status==true){
     baidu_init();
     baidu_create_path();
     if ( beaches_pic !=null){
       baidu_set_pic_markers(beaches_pic);
       //console.log (myLatLng1[0]); 
     }
    clearTimeout(t);
   }
  }, 1000);   
  $('#map_right1').click(function() {
      $('#map-canvas').css("height","600px"); 
      //google.maps.event.trigger(map, 'resize');         // baidu 默認自動 resize 
      $('#map_right1').hide();
      $('#map_right2').show();
   });
  $('#map_right2').click(function() {
      $('#map-canvas').css("height","400px");  
      $('#map_right1').show();
      $('#map_right2').hide();   
  });

});



function baidu_init()
{
    map = new BMap.Map("map-canvas");      
    var init_point = myLatLng1[0];
    map.centerAndZoom(init_point, 5);
    map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT} ));
    
} 



function  baidu_create_path()
{
  var polyline = new BMap.Polyline(myLatLng1,
    {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5 }    
  );
  polyline.disableMassClear();           // 不會被清空    
  map.addOverlay(polyline);
  map.centerAndZoom(myLatLng1[0], 16);
}
 
function baidu_set_pic_markers()
{
  var myIcon = new BMap.Icon("../pic/train_detail/camera.png", new BMap.Size(30, 25));
  var beaches_pic_obj= eval(beaches_pic);          
  for (var i = 0; i <beaches_pic.length; i++) 
  {  
     beach_pic = beaches_pic_obj[i];
     beach_pic_point[i] = new BMap.Point(beach_pic.pic_lng,beach_pic.pic_lat); 
     myLatLng_pic[i] = new BMap.Marker(beach_pic_point[i],{icon: myIcon});
     // 這個應該也要轉座標  ，先忽略吧！或者不要在這邊寫。
     myLatLng_pic[i].disableMassClear() ;                                    
     map.addOverlay(myLatLng_pic[i]);               
     var infowindow_content="<br><a target='_black' href='show.php?user_id="+train_own_id+"&train_id="+train_id+"'><img style='height:50px;width:50px;' class='map_small_pic' src='../upload/trip_photo/"+train_own_id+"/"+train_id+"/"+beach_pic.pic_name+"'/></a>";  // 內容完全支援 html 
     baidu_setinfowindow(myLatLng_pic[i],infowindow_content);              
  }    
}

function baidu_setinfowindow(marker_pic_temp,infowindow_content)
{
   marker_pic_temp.addEventListener("click",function(e){
			baidu_pic_click (infowindow_content,e)}
	 );  
} 

function  baidu_pic_click(infowindow_content,e)
{
   var opts = {    
       width : 50,     // 信息窗口寬度   ，完全沒作用！  
       height: 50,     // 信息窗口高度    
       //title : "Hello"  // 信息窗口標題   
   } 
    var p = e.target;
		var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
		var infoWindow = new BMap.InfoWindow(infowindow_content,opts);  // 创建信息窗口对象 
		map.openInfoWindow(infoWindow,point); //开启信息窗口
}




//  地圖播放，函數名稱取一樣 。不同地方
function setMarkers() {           // 播放用的 key 第一點是 0
  map.clearOverlays();   
  key++;    
    if (key > play_final_point_key){  
       //key=key- beaches.length;               // 這樣會無限重播
       window.clearInterval(market_play );      // 一循環停止
    }   
    beach_now = beaches_obj[key];               // 這個是出發點，但是判斷是用 key     
    var myLatLng = new BMap.Point(beach_now.longitude,beach_now.latitude); 
    var marker = new BMap.Marker(myLatLng);
    markers[key]=marker;    
    map.addOverlay(markers[key]);
     //map.setCenter(myLatLng);                    // 地圖重新置中,用了 marker 好像來不急產生
     add_highchart_line(key);                     // 連動 high chart   , 是用 key 控制，所以也好了
     
}






function callback(xyResults){  
		var xyResult = null;
		for(var index in xyResults){     
			xyResult = xyResults[index];
			if(xyResult.error != 0){continue;}//出错就直接返回;
			myLatLng1[index] = new BMap.Point(xyResult.x, xyResult.y);    // 轉換後的座標	, 注意一下經緯度要顛倒	       
		}
    baidu_change_status=true;
}
