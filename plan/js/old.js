var start_dis=0;
var pic1='';
var map;
var marker;
var markersArray=[];
var marker_if=false;
var myLatLng1=[];
var beaches_obj;
var create_path;
var create_path_if=false;
var map_source;
var change_baidu_point;
var f_point=[];
var f_point_1=[];
var  gps_lat=[];
var  gps_lng=[];

if (map_config==1){
   $(document).ready(function(){ 
     google_init();
   }); 
}else{
  $(document).ready(function(){ 
     baidu_init();
  });  
} 



$(document).ready(function(){  
var total_dis;

// 搜尋
$(document).on("click","#search",search);
$(document).on("change","#select_sort",search);
$(document).keydown(function(event){  
  if(event.keyCode==13){
     search();
  }  
});  
function search()
{
 var origin='1'; 
 search_1=$("#search_1").val() ;
 search_2=$("#search_2").val() ;
 select_sort=$("#select_sort").val();
 $("#select_page").val(1);
 select_page=$("#select_page").val();
 $.post('ajax/search.php',{search_1:search_1,search_2:search_2,select_sort:select_sort,select_page:select_page,origin:origin }, function(data){  
  $("#1_search_result").html(data);
 }); 
}


$(document).on("change","#select_page",change_page);
function change_page()
{
 var origin='2'; 
 search_1=$("#search_1").val() ;
 search_2=$("#search_2").val() ;
 select_sort=$("#select_sort").val();
 select_page=$("#select_page").val();
 $.post('ajax/search.php', {search_1:search_1,search_2:search_2,select_sort:select_sort,select_page:select_page,origin:origin}, function(data){  
   $("#1_search_result").html(data);
 }); 
}


//預覽地圖 ,只有線，所以所有 marker 是清空
$(document).on("click","#show_map",show_map);
function show_map()
{
  var id=$(this).attr('value');                  // 計畫資料表的 autokey
  var train_id=$(this).attr('name');             // 這個是 0 ，就是沒有原始資料 。新創的數據
  map_source=$(this).attr('map_source');        // 要是是百度 2, 就忽略地圖設定，且提示只能使百度地圖修改
  myLatLng1=[];                                  // 清空上一次的數據

  $.getJSON('ajax/show_map.php', {id:id,train_id:train_id}, function(data){
     if ( map_source==2)     // 用 baidu 規劃 
     {
        if (map_config==1){alert (lang_limit_use_baidu);}
        change_baidu_point=false;  
        show_baidu_map(data);                
     }else{
       if (map_config==1)
       {
         show_google_map(data) ;          
       }else{ 
         change_baidu_point=true;
         show_baidu_map(data);           // 這種情況要換座標   ，這種情況是 gps 座標，但是使用百度秀資料 
       }     
     }
      
  }); 
}





// 編輯資料
$(document).on("click","#edit",edit);
function edit()
{
  $("#map_right1").hide();  
  clear_path();  
  var id=$(this).attr('value');  
  var train_id=$(this).attr('name');      // 這個是 0 ，就是沒有原始資料 。就是獨一個資料庫
  map_source=$(this).attr('map_source');        // 要是是百度 2, 就忽略地圖設定，且提示只能使百度地圖修改
  myLatLng1=[]; 
  $.post('ajax/edit_show.php', {id:id,train_id:train_id}, function(data){          // 這邊只是取統計數據
    $("#map_right2").html(data);
  });
   $.getJSON('ajax/show_map.php', {id:id,train_id:train_id}, function(data){       // 實際的地圖處理，下面寫成函數    
     if ( map_source==2)     // 用 baidu 規劃 
     {
        if (map_config==1){alert (lang_limit_use_baidu);} 
        change_baidu_point=false; 
        map_baidu_init_data(data);                
     }else{
       if (map_config==1)
       {
         map_google_init_data(data) ;            
       }else{
         change_baidu_point=true;
         map_baidu_init_data(data); 
       }     
     }       
  });
} 
  


$(document).on("click","#edit_save",edit_save);
function edit_save()
{
  var edit_save_array=[];
  edit_save_array[0]=$("#e_title").val();
  edit_save_array[1]=$("#e_desciption").val();
  edit_save_array[2]=$("#machine_title").val();
  edit_save_array[3]=$("#total_dis").val();
  edit_save_array[4]=$("#e_wAscent").val();
  edit_save_array[10]=$("input:radio:checked[name='sport_type[]']").val();
  if ( edit_save_array[3] >=0 &&  edit_save_array[3] <1000000000  && edit_save_array[4]>=0 && edit_save_array[4]<1000000000 ){
    $("#edit_save").hide();
    if (map_config ==2){map_source=2;}             // 若是用 baidu ，又按了 save ，則轉成 百度模式 
    if (map_source ==1){    
      for (i in markersArray)
      {
        f_point[i]= markersArray[i].position.lat();
        f_point_1[i]= markersArray[i].position.lng();
        gps_lat[i]=f_point[i];
        gps_lng[i]=f_point_1[i];
      }  
    }else{
      for (i in markersArray)
      {
        f_point[i]= markersArray[i].getPosition(0).lat;
        f_point_1[i]= markersArray[i].getPosition(0).lng;
        baidu_to_google (i);
        //gps_lat[i]=f_point[i]- 0.0060;
        //gps_lng[i]=f_point_1[i] - 0.0065;  
      }  
    }
    // 這邊還有一個， 原gps 座標 ，但是用百度呈現， 而且按了修改。這個時候
    $.post('ajax/edit_save.php', {edit_save_array:edit_save_array,f_point:f_point,f_point_1:f_point_1,map_source:map_source,gps_lat:gps_lat,gps_lng:gps_lng }, function(data){     
      if (data !='error'){               
         location.reload();    
      }else{
        alert ('error');    
        $("#edit_save").show();
      }
    });  
  }else if (edit_save_array[3]<0)  {alert (lang_error_dis_1+"0");
  }else if (edit_save_array[4]<0)  {alert (lang_error_wAscent_1+"0");   
  }else if (edit_save_array[3]> 1000000000)  {alert (lang_error_dis_2+"1000000000");
  }else if (edit_save_array[4]> 1000000000)  {alert (lang_error_wAscent_2+"1000000000");
  }else {alert (lang_error_play_format)  };
}
$(document).on("click","#edit_cacel",edit_cacel);
function edit_cacel()
{
  location.reload();
}



// 刪除
$("#kill").bind('click',function(){
  var id=[];
  var  train_id=[];
  $("input:checkbox:checked").each(function(e){
           id[e]=$(this).val();
           train_id[e]=$(this).attr('name');      // 這個是 0 ，就是沒有原始資料 。就是獨一個資料庫       
  });
  if (id !='')
  { 
    $.post('ajax/kill.php', {id:id,train_id:train_id}, function(data){ 
      location.reload();
    });
  }else{alert (select_no_data);}

});

// 下載  ，這邊實際上還有問題！ 因為是 baidu 座標
$("#download").bind('click',function(){
  var id=[];
  var  train_id=[];
  $("input:checkbox:checked").each(function(e){
           id[e]=$(this).val();
           train_id[e]=$(this).attr('name');      // 這個是 0 ，就是沒有原始資料 。就是獨一個資料庫       
  });
  if (id !='')
  { 
    // 這邊多存一個座標？
    $.post('ajax/download.php', {id:id,train_id:train_id}, function(data){ 
      alert (data);
      location.reload();
    });
  }else{alert (select_no_data);} 
});




});  // 最外層







  







/*
function getenc(){
	var countLimit=400;
	var detailCount=markersArray.length;
	var divValue=Math.ceil(detailCount/countLimit);
	var pointIndex=0;
	var modValue=0;
	var points = new Array();
  for (var i = 0; i <markersArray.length; i++) {  
     modValue=i%divValue;   
     if(modValue==0){ 
       points[pointIndex] = new google.maps.LatLng(markersArray[i].position.lat() ,markersArray[i].position.lng());
       pointIndex+=1;
     }   
  }
	return GoogleMapSrv.StaticMap.getStaticMapImageUrl(points);
}
*/ 



 


