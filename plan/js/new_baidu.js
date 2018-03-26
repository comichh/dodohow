$(document).ready(function(){ 
var driving;     // 導航物件 
var output ;     // 導航最後回傳值

map_baidu = new BMap.Map("map-canvas");   
var init_point = new BMap.Point(116.454, 39.915);
map_baidu.centerAndZoom(init_point, 15);  
map_baidu.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT} ));

total_point=0; 


map_baidu.addEventListener("click", create_new_point);
$direct_type.change(function(){
    direct_type=$direct_type.val();
    if (direct_type ==1)   // 導航     
    {  
      if (total_point !=0)
      {
        alert (clear_directions);      
        total_point=0;  
        myLatLng1=[];  
        markersArray=[];   
        map_baidu.clearOverlays();                             
      } 
    map_baidu.removeEventListener("click", create_new_point_1);
    map_baidu.addEventListener("click", create_new_point);
    }else{            // 直線模式
      if (total_point !=0)
      {
        alert (clear_directions);      
        total_point=0;  
        myLatLng1=[];
        markersArray=[];     
        map_baidu.clearOverlays();                             
      }
    map_baidu.removeEventListener("click", create_new_point);   
    map_baidu.addEventListener("click", create_new_point_1);  
    } 
}); 






 


$kill_last_point.click(function(){
  if (direct_type ==1){
    kill_last_point();            // 導航的最後一點
  }else{
    kill_last_point_1();          // 直線的最後一點
  }
}); 

function create_new_point_1(e)
{
  save_marker(e,false);
  // 這邊要算距離。
  if ( total_point >1){
     baidu_create_path();
     acc_distince();
  }
}
});


function create_new_point(e)
{
  save_marker(e,true);
  // 導航
  if (total_point ==1 )     // 第一點，都未導航
  {
        start1=myLatLng;
  }else if (total_point ==2) {
  }else{  
       waypts.push(myLatLng1[total_point-2]) ;       
  }
  end=myLatLng;
  if (total_point >1 ){
    directionsService_start();
  }
} 








// 正式導航開始
function  directionsService_start()
{ 
  driving = new BMap.DrivingRoute(map_baidu, {    
   renderOptions: {    
    map: map_baidu,    
    autoViewport: true , 
    enableDragging: true  
   },
   onSearchComplete: searchComplete,
   onPolylinesSet: function(e){   
     //  導航點
     for (j in e)
     {       
      for (i in e[j].getPath(0))
      {
        new_markersArray.push(e[j].getPath(0)[i]);          // 最後的導航點，跟 google 最後取出的是相同的，所以理論上導航到這邊就完成 
      }
     }     
     $html_total_dis.val(output);        	
   },     
  });  
   //map_baidu.clearOverlays();                                  // 他把導航點也視為覆蓋物，所以要先清空
   //alert (start1+""+end);
  new_markersArray=[];
   driving.search(start1,end,{waypoints:waypts});        // 最後導航語法 
}



var searchComplete = function (results){
		if (driving.getStatus() != BMAP_STATUS_SUCCESS){
			return ;
		}
		var plan = results.getPlan(0);
		//output += plan.getDuration(true) + "\n";                //获取时间
		//output += "总路程为：" ;
		output = plan.getDistance(false) + "\n";             //获取距离 , 設假，單位 m
} 

function save_marker(e,create_type)
{  
  myLatLng =new BMap.Point (e.point.lng,e.point.lat)
  var marker=[];   
  markersArray[total_point]= new BMap.Marker(myLatLng, {        // 這點存成 marker    
    enableDragging: create_type                                 // 導航好像要設成 true 才會比較正常，但是直線部分，我不允許拉動
  });
  show_baidu_marker();  
  myLatLng1[total_point]=myLatLng;                        //  這點存成需要的座標  
  total_point++;      
}




/*
function callback(xyResults){
		var xyResult = null;
		for(var index in xyResults){     
			xyResult = xyResults[index];
			if(xyResult.error != 0){continue;}//出错就直接返回;
			myLatLng1[index] = new BMap.Point(xyResult.x, xyResult.y);    // 轉換後的座標	, 注意一下經緯度要顛倒	       
		}
}
*/ 

function kill_last_point()
{
  if (total_point >0)
  {
    total_point--; 
    myLatLng1.pop(); 
    point_length=myLatLng1.length;
    waypts.pop();                         // 去除掉最後一點
    markersArray.pop();
    end=myLatLng1[point_length-1];
    clean_directionsService(); 
    if (total_point >1 ){        
      directionsService_start();      
    }  
    // 兩點又繼續按刪除。清地圖，把第一點畫上去 
    else if ( total_point ==1 )
    {
       map_baidu.clearOverlays();
       show_baidu_marker();
       $html_total_dis.val("0");          
    }else{       // 一點又按刪除       
       map_baidu.clearOverlays();
    }      
  }
}
 

function kill_last_point_1()
{
  if (total_point >0){  
      map_baidu.clearOverlays();
      myLatLng1.pop(); 
      markersArray.pop();
      show_baidu_marker();     
    if (total_point>1){       
      baidu_create_path()                  
    }
      total_point--;
  }
}


function clean_directionsService()
{
  new_markersArray=[];   
}