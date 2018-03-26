var marker;
var map_edit=false;
var  pic_myLatLng;

var beaches;
var beaches_obj= eval(beaches);    // eval()將JSON字串轉為JavaScript物件 
var myLatLng1=[];
for (var i = 0; i <beaches.length; i++) {  
     var beach = beaches_obj[i];     
     myLatLng1[i] = new google.maps.LatLng(beach.latitude ,beach.longitude);  
} 


function initialize() {
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
  set_path();  // 畫路徑
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

/*
  function click_map(point){   
    if (marker){
      marker.setMap(null);
    }
    var lat=point.latLng.lat();
    var lng=point.latLng.lng()
    myLatLng = new google.maps.LatLng(lat, lng);
    $('#show_lat').html(lat+","+lng);
      marker = new google.maps.Marker({
      position:  myLatLng ,
      map: map,
      title: '你的圖片座標'
    });
    map.setCenter(myLatLng);
}
*/



google.maps.event.addDomListener(window, 'load', initialize);



var index=0;
var click_index;
var pic_size_1;

var pic_id;
var pic_name;


$(document).ready(function(){
var $show_pic = $('#show_pic');
var pic_size=$show_pic.find('div').size();   // 圖片張數 
var pic_size_1=pic_size-1;
// 圖片上傳
setTimeout( function (){
$('#file_upload').uploadify({ 
            'swf'      : '../jquery/plugin/uploadify/uploadify.swf',
            'uploader' : 'ajax/ajax_uploadify.php?a=1',
            'method'   : 'POST',
            'dataType' : "json",
            'formData' : {'db_name' : db_name, 'train_id' : train_id,'session_id':session_id,random:Math.random() },
            'onUploadSuccess' : function(file, data, response) {
                data1=JSON.parse (data);   
                //console.log (data1);
                if (data1.status == 'ok')
                {          
                  $("#show_pic").prepend("<div><img  src='"+pic_path+"/"+data1.file_name +"' alt='"+data1.position+"' title='' pic_id='"+data1.id+"' ></div>");                                                 
                  pic_size_1++;   
                  $("#new_upload_window").hide();                                                       
                }else {                                   
                  alert(data1.status);               
                }
                //data='';               
            },
           'onUploadError' : function(file, errorCode, errorMsg, errorString) {
               alert (errorMsg);
           }             
    });
},10);

/*
$(document).on("click","#new_upload",new_upload);
function new_upload()
{
  //$("#new_upload_window").toggle ();
  $("#file_upload").toggle ();
}
*/

// 右邊的圖片
// 下一張
$(document).on("click","#page_down",page_down);
function page_down()
{
    if (index < pic_size_1 )              
   {
    index++;
    $show_pic.find('div:lt('+index+')' ).hide();
    $show_pic.find('div:gt('+index+')' ).show();
    return false;
   }
}
// 上一張
$(document).on("click","#page_up",page_up);
function page_up()
{
   if (index >0)
   {
      index--;  
      $show_pic.find('div:eq('+index+')').show();     
      return false;
   }
}
// 點小圖變大圖
$("#show_pic").on("click", "img", function() {
   pic_path_1=$(this).attr("src");
   pic_lat=$(this).attr("alt");                    
   pic_title=$(this).attr("title");
   pic_id=$(this).attr("pic_id");    
   click_index=$('#show_pic div img').index(this);
   $('#new_pic').html("<img style='height:150px;width:150px' src='"+pic_path_1+"'>");
   if (pic_lat){$('#show_lat').html(pic_lat); }else { $('#show_lat').html('');}
   $('#pic_title').val(pic_title);
   // 弄到地圖上去
   map_edit=false;
   pic_lat_array=pic_lat.split(",");
   if (marker){
      marker.setMap(null);
   } 
   pic_myLatLng = new google.maps.LatLng( pic_lat_array[0], pic_lat_array[1]);  
   marker = new google.maps.Marker({
         position:  pic_myLatLng ,
         map: map,  
         //draggable:true,      
   });   
});
$("#edit_map").click(function(){     
         if (map_edit ==false){ map_edit=true;} else { map_edit=false;} 
         map_edit_function_1();  
});


// 存檔
$('#pic_save').click(function() {
   var pic_lat= $('#show_lat').html();
   var pic_title= $('#pic_title').val();
   $.post('ajax/pic_save.php', {pic_lat:pic_lat,pic_title:pic_title,pic_id:pic_id}, function(data){
      alert (data);  
      $('#show_pic').find('div:eq('+click_index+')').find("img").attr("title",pic_title);
      $('#show_pic').find('div:eq('+click_index+')').find("img").attr("alt",pic_lat);
   });
});
//  刪除 
$('#pic_kill').click(function() {
    var pic_kill_path=$("#new_pic img").attr("src");
    //alert ("a:"+pic_id);
    $.post('ajax/pic_kill.php', {pic_id:pic_id,pic_kill_path:pic_kill_path}, function(data){
     if (data =="ok"){     
        $('#show_pic').find('div:eq('+click_index+')').remove();  
        pic_size_1--;   
        $('#new_pic').html(''); 
        $('#pic_title').val(''); 
      }else {alert (data);}
   });
     
});

});


function draggble_change(point){
    var lat=point.latLng.lat().toString().slice(0,8) ;
    var lng=point.latLng.lng().toString().slice(0,8);
    $('#show_lat').html(lat+","+lng);
    pic_myLatLng = new google.maps.LatLng( lat, lng);    
}


function map_edit_function_1()
{
  if (map_edit==true){      
     marker.setMap(null);
      marker = new google.maps.Marker({
         position:  pic_myLatLng ,
         map: map,
         draggable:true,
     });
     google.maps.event.addListener(marker, 'dragend',draggble_change); 
    }else{      
        marker.setMap(null);
        marker = new google.maps.Marker({
         position:  pic_myLatLng ,
         map: map,
         draggable:false,        
      });
   }
}


