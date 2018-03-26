var  map;
var marker;
var markersArray=[];
var marker_if=false;
var myLatLng1=[];
var beaches_obj;
var create_path;
//var line = [];
var create_path_if=false;

function initialize() {
  //var myLatlng = new google.maps.LatLng(beaches_obj[0].latitude, beaches_obj[0].longitude );
  var mapOptions = {
    zoom: 2,
    center: new google.maps.LatLng(24.9966083333333 ,	121.4877),
    zoomControl: true,
    zoomControlOptions: {
        style: google.maps.ZoomControlStyle.LARGE,
        position: google.maps.ControlPosition.LEFT_CENTER
    },
  }   
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions); 
  
 }
google.maps.event.addDomListener(window, 'load', initialize);



function set_path() { 
   create_path = new google.maps.Polyline({
      path: myLatLng1,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
   });
   create_path.setMap(map); 
 //  line.push(create_path);
   create_path_if=true;
}

function clear_path() 
{
  if (create_path_if==true)
  {
     create_path.setMap(null);
  }
}


function clear_marker ()
{
  if (marker_if==true){
     for (i in markersArray) {
         markersArray[i].setMap(null);
     }
  }
}




