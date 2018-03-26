var mapOptions;
function google_init()
{
  google_initialize();
  google.maps.event.addDomListener(window, 'load', google_initialize);
}
function google_initialize() 
{
    mapOptions = {
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


function show_google_map(data)
{
   //if (typeof(mapOptions) =="undefined"){  
    google_init(); 
   //}
    google.maps.event.addDomListener(window, 'load', google_initialize);
    var beaches_obj= eval(data);          
    for (var i = 0; i <data.length; i++) {  
       var beach = beaches_obj[i];          
       myLatLng1[i] = new google.maps.LatLng( parseFloat(beach.latitude) ,	parseFloat(beach.longitude));        
    }
    map.setCenter(myLatLng1[0]);  
    map.setZoom(14);  
    //clear_path();
    set_path();       
    //clear_marker();    // 也要清空 baidu 地圖
}

function map_google_init_data(data)
{
  //if (typeof(mapOptions) =="undefined"){  
    google_init(); 
  //}
  var beaches_obj= eval(data);  
  for (var i = 0; i <data.length; i++) {  
      var beach = beaches_obj[i];    
        myLatLng1[i] = new google.maps.LatLng( parseFloat(beach.latitude) ,	parseFloat(beach.longitude));          
        marker = new google.maps.Marker({
          position:  myLatLng1[i] ,
          map: map,  
          draggable:true,      
       });
     // 地圖點重新被拉動後
     google.maps.event.addListener(marker, 'dragstart',draggble_change_start); // drag 後會自動存進markersArray    
     google.maps.event.addListener(marker, 'dragend',draggble_change_end); // drag 後會自動存進markersArray
     markersArray.push(marker);  
     
    }
   set_path(); 
   map.setCenter(myLatLng1[0]);    
   map.setZoom(16);             
   marker_if=true;   
} 



function draggble_change_start(point){
  for (i in markersArray)
  {
    if (markersArray[i].position.lat() == point.latLng.lat() &&  markersArray[i].position.lng() == point.latLng.lng())
    { 
       change_dis(i,"-");     
    }
  }
}


function draggble_change_end(point){
clear_path()
for (i in markersArray)
{
  if (markersArray[i].position.lat() == point.latLng.lat() &&  markersArray[i].position.lng() == point.latLng.lng())
  { 
    myLatLng1[i] = new google.maps.LatLng( parseFloat(markersArray[i].position.lat()) ,	parseFloat(markersArray[i].position.lng()));   
    change_dis(i,'+');        
  }
}
set_path();     
}



// 拉動後，距離重新計算
function change_dis(i,sum_dis){
var now_point=[];
var last_point=[];
var next_point=[];
var get_dis;
i=parseInt(i);
j= i+1;
    now_point[0]=markersArray[i].position.lat();
    now_point[1]=markersArray[i].position.lng();
    if (i>0){
       last_point[0]=markersArray[i-1].position.lat();
       last_point[1]=markersArray[i-1].position.lng();
    }else { 
      last_point[0]=now_point[0]; 
      last_point[1]=now_point[1];
    } 
    if (j == markersArray.length)
    {
      next_point[0]=now_point[0]; 
      next_point[1]=now_point[1];
    }else{
      next_point[0]=markersArray[i+1].position.lat();
      next_point[1]=markersArray[i+1].position.lng();
    }    
    $.post('ajax/get_dis.php', {now_point:now_point,last_point:last_point,next_point:next_point }, function(get_dis){          
        total_dis=parseInt($("#total_dis").val());        
        get_dis=parseInt(get_dis);       
        if (sum_dis =='-'){    
           total_dis=total_dis-get_dis ;
        }else {
            total_dis=total_dis+get_dis ;             
        } 
        $total_dis.val(total_dis);               
    }); 
 
}
