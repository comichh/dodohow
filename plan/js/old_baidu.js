var init_point;
var map_change_status=false;
function baidu_init()
{
    map_baidu = new BMap.Map("map-canvas");   
    init_point = new BMap.Point(116.454, 39.915);
    map_baidu.centerAndZoom(init_point, 16);
    map_baidu.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT} ));
} 


function show_baidu_map(data)
{
  //if (typeof(init_point) =="undefined"){  
    baidu_init(); 
  //}
  var beaches_obj= eval(data);  
  for (var i = 0; i <data.length; i++) {  
    var beach = beaches_obj[i];    
    myLatLng1[i] = new BMap.Point(parseFloat(beach.longitude),parseFloat(beach.latitude) );                
  }
console.log (myLatLng1);
  if (change_baidu_point==true )
  {    
     BMap.Convertor.transMore(myLatLng1,0,callback);    
  } 
  setTimeout(function(){             // 上面那個應該是非同步，所以 wait
    //clear_marker();       //   因為我都是 init map 所以所有東西都不需要清空了
    //clear_path();
    map_baidu.centerAndZoom(myLatLng1[0], 16);
    console.log (myLatLng1);
    baidu_create_path(); 
  }, 1000);
 
}


function map_baidu_init_data(data)
{
  //if (typeof(init_point) =="undefined"){  
    baidu_init(); 
  //}
  var beaches_obj= eval(data);  
  for (var i = 0; i <data.length; i++) {  
      var beach = beaches_obj[i];    
        myLatLng1[i] = new BMap.Point(parseFloat(beach.longitude),parseFloat(beach.latitude) );               
  }
  if (change_baidu_point==true)
  {    
     BMap.Convertor.transMore(myLatLng1,0,callback);    
  }
  setTimeout(function(){    
    for (var i = 0; i <data.length; i++) {
        markersArray[i]= new BMap.Marker(myLatLng1[i], {           // 這點存成 marker    
              enableDragging: true                                 // 導航好像要設成 true 才會比較正常，但是直線部分，我不允許拉動
        });
     // 地圖點重新被拉動後
     markersArray[i].addEventListener("dragstart", baidu_draggble_change_start);   
     markersArray[i].addEventListener("dragend", baidu_draggble_change_end);  
    }     
     //map_baidu.clearOverlays();   
     map_baidu.centerAndZoom(myLatLng1[0], 16);     
     show_baidu_marker();
     baidu_create_path(); 
  }, 1000);
}

function baidu_draggble_change_start(e)
{
  for (i in markersArray)
  {
    if (markersArray[i].getPosition(0).lat == e.point.lat &&  markersArray[i].getPosition(0).lng == e.point.lng)
    { 
       baidu_change_dis(i,"-");     
    }
  }
}


function baidu_draggble_change_end(e)
{
  map_baidu.clearOverlays(); 
  for (i in markersArray)
  {
    if (markersArray[i].getPosition(0).lat == e.point.lat &&  markersArray[i].getPosition(0).lng == e.point.lng)
    { 
       myLatLng1[i] =new BMap.Point( parseFloat(markersArray[i].getPosition(0).lng) ,	parseFloat(markersArray[i].getPosition(0).lat));      
       baidu_change_dis(i,"+");     
    }
  }
  show_baidu_marker(); 
  baidu_create_path(); 
}





// 拉動後，距離重新計算
function baidu_change_dis(i,sum_dis){
var now_point=[];
var last_point=[];
var next_point=[];
var get_dis;
i=parseInt(i);
j= i+1;
    now_point[0]=markersArray[i].getPosition(0).lat;
    now_point[1]=markersArray[i].getPosition(0).lng;
    if (i>0){
       last_point[0]=markersArray[i-1].getPosition(0).lat;
       last_point[1]=markersArray[i-1].getPosition(0).lng;
    }else { 
      last_point[0]=now_point[0]; 
      last_point[1]=now_point[1];
    } 
    if (j == markersArray.length)
    {
      next_point[0]=now_point[0]; 
      next_point[1]=now_point[1];
    }else{
      next_point[0]=markersArray[i+1].getPosition(0).lat;
      next_point[1]=markersArray[i+1].getPosition(0).lng;
    }    
    $.post('ajax/get_dis.php', {now_point:now_point,last_point:last_point,next_point:next_point }, function(get_dis){          
        total_dis=parseInt($("#total_dis").val());        
        get_dis=parseInt(get_dis);       
        if (sum_dis =='-'){    
           total_dis=total_dis-get_dis ;
        }else {
            total_dis=total_dis+get_dis ;             
        }   
        $("#total_dis").val(total_dis);  
         
    });  
}



