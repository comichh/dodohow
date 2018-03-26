var create_path ;
var create_path_array=[];
var total_point=0;


// google 共用函數
function set_path() { 
   create_path = new google.maps.Polyline({
      path: myLatLng1,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
   });
   create_path.setMap(map); 
   create_path_array[total_point]=create_path;
}

function clear_path() 
{ 
  for (i in create_path_array){ 
       create_path_array[i].setMap(null);
  } 
}


function clear_marker ()
{
     for (i in markersArray) 
     {
         markersArray[i].setMap(null);
     }
}



// baidu 共用函數
function show_baidu_marker()
{
  for ( i in  markersArray)
  {
     map_baidu.addOverlay(markersArray[i]);
     //console.log ( markersArray[i]);
  }
}

function  baidu_create_path()
{
  var polyline = new BMap.Polyline(myLatLng1,
  {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5}    
  );    
  map_baidu.addOverlay(polyline);
}

// 這邊做，把百度轉成 google  ，用 這邊的作法   http://malagis.com/baidu-map-coordinate-transformation.html
//  http://tieba.baidu.com/p/799339703 這邊用了一個最簡單的公式，用最簡單的線性偏移，偏一點點回去而已
function baidu_to_google (pointIndex)
{
    gps_lat[pointIndex]= f_point[pointIndex] -0.0060;
    gps_lng[pointIndex]= f_point_1[pointIndex] -0.0065;
}


