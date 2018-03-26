var init_point;
var siteLatLng_array=[];
var baidu_change_status=false;
var t;

/*
$(document).ready(function(){  
});
*/

function initialize (lat,lng)
{
  map = new BMap.Map("map-canvas");  
  init_point = new BMap.Point(lng,lat);             
  map.centerAndZoom(init_point, 16);
  map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT} )); 
  geocoder = new BMap.Geocoder();
}


function geocoder_return(address)
{
   geocoder.getPoint( address, function(point) {
		if (point) {
			var lat=point.lat;
			var lng=point.lng;
			var url=next_page+
				"?lat="+lat+
				"&lng="+lng;
       	$('#iframe_table').attr('src',url);
			  updatePosition(lat,lng,address); 
		} else {     
       alert(portHistory_errer_1);
		}
	});
}

function set_map_centert()
{
   temp=new BMap.Point (116.454, 39.915);      // 地圖置中定位用而已
   map.centerAndZoom(temp, 10);  
   setTimeout(function(){refreshScroll();},1000);
}

function clearAllMarker(){
  map.clearOverlays(); 
	ActiveMapMarker=[];
	previousID=-1;
}

var  myIcon_array=[];
// baidu 先儲存成 array 好了。
function createMarker(site, map,sportTypeID,targethtml)
{
  siteLatLng=new BMap.Point(site[2],site[1]);
  siteLatLng_array.push(siteLatLng);  
  sportTypeImageUrl=getImageIconUrl(sportTypeID);
  
  var myIcon = new BMap.Icon(sportTypeImageUrl, new BMap.Size(30, 25));
  myIcon_array.push( myIcon); 
}

; 

function new_baidu_pos()
{
  // 先轉換座標
  BMap.Convertor.transMore(siteLatLng_array,0,callback);  
  t=setInterval(function(){        // 轉換 baidu 座標
  if (baidu_change_status==true){    
      clearTimeout(t);
      for(var i in siteLatLng_array ){     
        var marker= new BMap.Marker(siteLatLng_array[i], {
        enableDragging: false,
        icon:myIcon_array[i]
      });
	    ActiveMapMarker.push(marker);
      marker.addEventListener("click",function(e){
        var opts = {    
          width : 310,     // 信息窗口寬度   ，完全沒作用！  
          height: 330,     // 信息窗口高度    
        } 
        contentString=targethtml;
        var p = e.target;
		    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
	      var infoWindow = new BMap.InfoWindow(contentString,opts);  // 创建信息窗口对象 
        map.openInfoWindow(infoWindow,point); //开启信息窗口 
      });     
      } 

  }
  }, 1000);

 


}


  /*
function createMarker(site, map,sportTypeID,targethtml){
  siteLatLng=new BMap.Point(site[2],site[1]);                         // 這邊才去轉換成 baidu 座標
  siteLatLng_array[0]=siteLatLng;  

  console.log ( siteLatLng_array[0]);
  BMap.Convertor.transMore(siteLatLng_array,0,callback);  
  t=setInterval(function(){        // 轉換 baidu 座標
  if (baidu_change_status==true){
      console.log ( siteLatLng_array[0]);
      clearTimeout(t);
  }
  }, 1000);   
  
	var sportTypeImageUrl=getImageIconUrl(sportTypeID);
  var myIcon = new BMap.Icon(sportTypeImageUrl, new BMap.Size(30, 25));
  var marker= new BMap.Marker(siteLatLng, {
    enableDragging: false,
    icon:myIcon
  }); 
	ActiveMapMarker.push(marker);

  marker.addEventListener("click",function(e){
     var opts = {    
       width : 310,     // 信息窗口寬度   ，完全沒作用！  
       height: 330,     // 信息窗口高度    
     } 
     contentString=targethtml;
     var p = e.target;
		 var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
	   var infoWindow = new BMap.InfoWindow(contentString,opts);  // 创建信息窗口对象 
     map.openInfoWindow(infoWindow,point); //开启信息窗口 
  }); 



}
 */

// 這邊可能有問題，不太確定他在這邊 set icon 是做什麼
function locateMarker(index){

var train_id=result[index].id;
var train_userid=result[index].userid;
$("#show_vscroll_div").html("<iframe src='Vscrollframe.php?id="+train_id+"&train_userid="+train_userid+"' scrolling='no' allowtransparency='true' style='background-color:#efefef;border:none;height:100%;width:100%;text-align:center;vertical-align:center'></iframe>");

	if(typeof(ActiveMapMarker)!='undefined'){
		if(previousID!==-1){
			//ActiveMapMarker[previousID].setIcon(getImageIconUrl(result[previousID].SportType));
      var myIcon = new BMap.Icon(getImageIconUrl(result[previousID].SportType), new BMap.Size(30, 30));
      if (baidu_change_status ==true){    
  	    ActiveMapMarker[index].setIcon(myIcon);
      }
			//ActiveMapMarker[previousID].setZIndex(0);
		}
      var myIcon = new BMap.Icon('./images/Active_Marker_1.png', new BMap.Size(30, 30)); 
      if (baidu_change_status ==true){    
		    ActiveMapMarker[index].setIcon(myIcon);
      }       
		  //ActiveMapMarker[index].setZIndex(1000);     // 不確定serzindex
		previousID=index;
	}
}

// 一樣這邊可能有問題，他有些動作，不太確定是做什麼的
//使用者點選某一個活動後產生的動作
function selectRecord(index){
  map.clearOverlays(); 
	var train_id=result[index].id;
	thisTripID=result[index].id;
	var train_userid=result[index].userid;
	$("#show_vscroll_div").html("<iframe src='Vscrollframe.php?id="+train_id+"&train_userid="+train_userid+"' scrolling='no' allowtransparency='true' style='background-color:#efefef;border:none;height:100%;width:100%;text-align:center;vertical-align:center'></iframe>");
	locateMarker(index);
  var temp_pos=new BMap.Point(parseFloat(result[index].start_lng),parseFloat(result[index].start_lat));
   map.addOverlay(ActiveMapMarker[index]);
   map.centerAndZoom(temp_pos, 13); 
   $('.BMap_Marker').click(); 

	setTimeout(function(){
		$.ajax({
			url:'../../common/lib/php/UpdateViewCnt.php',
			type:'POST',
			data:'tripID='+train_id,
			success: function(response){
				var jsonArray=eval('('+response+')');
				if(jsonArray[0].result==="1"){
					$('#ViewCnt_'+index).html(jsonArray[0].returnVal+'');
				}else{
					$('#ViewCnt_'+index).html('--');
				}
				
			},
			error: function() {
				//alert("ERROR!!! by UpdateSettings click()");
			}
		});
	},500);
	
}



function callback(xyResults){
                var xyResult = null;
                for(var index in xyResults){                  
                        xyResult = xyResults[index];
                        if(xyResult.error != 0){continue;}//出错就直接返回;
                        siteLatLng_array[index] = new BMap.Point(xyResult.x, xyResult.y);    // 轉換後的座標 , 注意一下經緯度要顛倒                                  
                }              
                baidu_change_status=true;
}
 