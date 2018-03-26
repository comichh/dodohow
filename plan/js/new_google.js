var rendererOptions = {
  draggable: true,
};
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
var directionsService = new google.maps.DirectionsService();




function initialize() {
  geocoder = new google.maps.Geocoder(); 
  var mapOptions = {
    zoom: 7,
    center: new google.maps.LatLng(24.9966083333333 ,	121.4877),
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // 這個要是沒導航，不會觸發沒問題，所以直線計算距離，寫在其他地方就好
  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
      computeTotalDistance(directionsDisplay.getDirections());
  });

  // 這邊開始分開，是用導航，或是用 直線 ，點的資料不是存在這裡 ，是存在 myLatLng1 ，存的點也沒有限制了
  // 導航的部分，我目前是用導航點！不是用 marker ，目前無法同時使用
  google.maps.event.addListener(map,'click',create_new_point);

  $direct_type.change(function(){
    direct_type=$direct_type.val();
    if (direct_type ==1)   // 導航     
    {  
      if (total_point !=0)
      {
        alert (clear_directions);      
        total_point=0;    
        clear_marker(); 
        clear_path();    
        myLatLng1=[];                  
      } 
      google.maps.event.clearListeners(map,'click',create_new_point_1);  
      google.maps.event.addListener(map,'click',create_new_point);
    } else {              // 直線規劃
      if ( total_point !=0){
        alert (clear_directions);      // 沒有英文
        total_point=0;        
        myLatLng1=[];  
        clear_marker(); 
        clear_path();    
        directionsDisplay.setMap(null);        
      } 
      google.maps.event.clearListeners(map,'click',create_new_point);  
      google.maps.event.addListener(map,'click',create_new_point_1);  
    }
  }); 
 
 

  

}


google.maps.event.addDomListener(window, 'load', initialize);

$(document).ready(function(){  

$(document).keydown(function(event){ 
    if(event.keyCode==13){
      $("#search").click();
    } 
});  

$("#search").click(function(){
// 搜很遠的距離的時候，暫時用無法導航處理，不清空原來數據 ，因為是有機會的
  var address=$("#search_value").val();
    geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      map.setZoom(14); 
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}); 


$("#edit_cacel").click(function(){  
     location.reload();   
});


$kill_last_point.click(function(){
  if (direct_type ==1){
    kill_last_point();            // 導航的最後一點
  }else{
    kill_last_point_1();          // 直線的最後一點
  }
}); 

}); 



function kill_last_point_1()
{
  if (total_point >0){  
    markersArray[total_point-1].setMap(null); 
      myLatLng1.pop();
    if (total_point>1){
      create_path_array[total_point].setMap(null);      
      markersArray.pop();
    }
      total_point--;
  }
}


function kill_last_point()
{
  if (total_point >0){
  total_point--; 
  myLatLng1.pop(); 
  point_length=myLatLng1.length;
  waypts.pop();                         // 去除掉最後一點
  markersArray.pop();
  end=myLatLng1[point_length-1];
  clean_directionsService();         // 因為我最後是用導航點做最後縮點，要清空然後重建吧
  if (point_length >1  ){               // 已經刪除過的數量   
      directionsService_start();                                                     
  }else if ( point_length ==1){       // 只剩一點了，
    directionsDisplay.setMap(null);    
    marker = new google.maps.Marker({
          position:  start1 ,
          map: map,  
          draggable:true,            
       });
     markersArray.push(marker); 
     new_markersArray.push(start1);    
  }else{
     //clear_marker();              // 最後一點也無法消掉！
     marker.setMap(null);
  }   
 
  }
}







function clean_directionsService()
{
    new_markersArray=[];  
}


function save_marker(point)
{
    myLatLng= new google.maps.LatLng( point.latLng.lat() ,	point.latLng.lng());          
    marker = new google.maps.Marker({
          position:  myLatLng ,
          map: map,     
       });
    markersArray[total_point]=marker;
    myLatLng1[total_point]=myLatLng; 
    total_point++;       // 這樣變成都是從 0 開始算起
}

function create_new_point_1(point) 
{
  if (total_point < 200 )
  {
    save_marker(point);
    if ( total_point >1)
    {  
       set_path();
       acc_distince();       // 這邊去計算直線的距離                     
    }
  }
}




function create_new_point(point)
{  
  if (total_point < 10 ){
     save_marker(point);
     if (total_point ==1 )     // 第一點，都未導航
     {
        start1=myLatLng;
        new_markersArray.push(start1);    
     }else if (total_point ==2) {
     }else{  
       waypts.push({   
         location:myLatLng1[myLatLng1.length-2],
         stopover:true
       });
      }
      end=myLatLng;                
      if (total_point>1){       // 讓第二點後才啟動導航
         clean_directionsService();
         directionsService_start();    
      }
   }else { alert (max_ten_point);} 
}


function  directionsService_start()
{
     var request = {
          origin:start1,
          destination:end,
          waypoints: waypts,
          optimizeWaypoints: true,   
          travelMode: google.maps.TravelMode.DRIVING
        };
         directionsService.route(request, function(response, status) {    
         if (status == google.maps.DirectionsStatus.OK) {       
           directionsDisplay.setDirections(response);
           directionsDisplay.setMap(map);
           // 規劃點                  
           for (i in response.routes[0].overview_path)
           {            
              new_markersArray[i]=response.routes[0].overview_path[i];                       
           }
          }else {
                 alert (no_directions);
                 location.reload();                
          }              
         });
 
}


function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  //total = total / 1000.0;    
  if (total_point !=1){  
    clear_marker();               // 讓第一點不清空
  }
  $html_total_dis.val(total); 
}


