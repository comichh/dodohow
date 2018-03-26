var direct_type=1;   // 判斷是導航，還是直線規劃，1是導航
var map;             //  地圖物件實體化  
var map_baidu;             //  地圖物件實體化  
var myLatLng;            // 當前操作點 ，原來沒有，但是居然可以傳值！
var myLatLng1=[];    //  已經物件實體化的經緯度。
var waypts = [];     // google 導航的中間點，baidu 也有用
var markersArray=[];         // 地圖上呈現的 marker
var new_markersArray=[];     // 最後的導航點，用這些點去做最後縮點
var geocoder;               // ----  不太確定，為何會放到最外面來 
var start1;           // 導航的第一點，永遠不變
var now_point=[];     // 計算直線距離時，當前點的座標，[0] 是 lat , [1] 是 lng
var last_point=[];    // 計算直線距離時，當前點的座標，[0] 是 lat , [1] 是 lng
// 地圖處理後，最後要存的值
var f_point=[];       // 最後縮點後的點，經度
var f_point_1=[];     // 最後縮點後的點，緯度 
var  gps_lat=[];
var  gps_lng=[];


$(document).ready(function(){  

$html_total_dis=$("#total_dis");
$kill_last_point=$("#kill_last_point");
$direct_type=$("#direct_type");

$("#edit_save").click(function(){
 var edit_save_array=[];
 edit_save_array[0]=$("#e_title").val();
 edit_save_array[1]=$("#e_desciption").val();
 edit_save_array[2]=$("#machine_title").val();
 edit_save_array[3]=$("#total_dis").val();
 edit_save_array[10]=$("input:radio:checked[name='sport_type[]']").val();
 if (direct_type ==1){
   reduce_200();             // 導航規劃縮點
 }else{
   reduce_200_1();          //  直線規劃縮點
 }  
 // 這邊多存一個 gps 座標，為了給 device 用 
 $.post('ajax/save_new_recode.php', {edit_save_array:edit_save_array,f_point:f_point,f_point_1:f_point_1,gps_lat:gps_lat,gps_lng:gps_lng}, function(data){          
       alert (data);       
 });
}); 




}); 







function  reduce_200_1()
{
  if (map_config ==1){  
    for (var i = 0; i <myLatLng1.length; i++) {  
      f_point[i]= myLatLng1[i].lat();
      f_point_1[i]= myLatLng1[i].lng();
      gps_lat[pointIndex]= f_point[i];           
      gps_lng[pointIndex]= f_point_1[i]; 
    }
  }else{
    for (var i = 0; i <myLatLng1.length; i++) {  
      f_point[i]= myLatLng1[i].lat;
      f_point_1[i]= myLatLng1[i].lng;
      baidu_to_google (pointIndex);
    }
  }  
}

function reduce_200(){              // 縮點
  var countLimit=200;
	var detailCount=new_markersArray.length;
	var divValue=Math.ceil(detailCount/countLimit);
	var pointIndex=0;
	var modValue=0;
  for (var i = 0; i <new_markersArray.length; i++) {  
     modValue=i%divValue;   
     if(modValue==0){      
     if (map_config ==1){         // google 最後的點
         f_point[pointIndex]= new_markersArray[i].lat();
         f_point_1[pointIndex]= new_markersArray[i].lng();
         gps_lat[pointIndex]=f_point[pointIndex];            // google 的一模樣，不轉換再存一次
         gps_lng[pointIndex]=f_point_1[pointIndex];               
       }else{                       // baidu 最後的點
         f_point[pointIndex]= new_markersArray[i].lat;
         f_point_1[pointIndex]= new_markersArray[i].lng;
         baidu_to_google(pointIndex);   
 //gps_lat[pointIndex]= f_point[pointIndex] -0.0060;
    //gps_lng[pointIndex]= f_point_1[pointIndex] -0.0065;    
       }
       pointIndex+=1;
     }   
  }
}






// 直線規劃計算距離
function acc_distince()
{
      if (map_config ==1){ 
        now_point[0]=myLatLng1[total_point-1].lat();
        now_point[1]=myLatLng1[total_point-1].lng();
        last_point[0]=myLatLng1[total_point-2].lat();
        last_point[1]=myLatLng1[total_point-2].lng();
      }else{
        now_point[0]=myLatLng1[total_point-1].lat;
        now_point[1]=myLatLng1[total_point-1].lng;
        last_point[0]=myLatLng1[total_point-2].lat;
        last_point[1]=myLatLng1[total_point-2].lng; 
      }
      $.post('ajax/get_dis_new_point.php', {now_point:now_point,last_point:last_point}, function(get_dis){
        total_dis=parseInt($html_total_dis.val());  
        get_dis=parseInt(get_dis);  
        total_dis=total_dis+get_dis;
        $html_total_dis.val(total_dis);           
      }); 
}

