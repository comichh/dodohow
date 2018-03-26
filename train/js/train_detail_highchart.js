//  update 方法，用來換距離和時間，未做
// http://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/highcharts/members/axis-update/
// api 參考
// http://api.highcharts.com/highstock#Axis.addPlotLine
// highchart 本身動態播放
// http://www.highcharts.com/demo/dynamic-update/grid/
// 右上角那個 export 
//http://stackoverflow.com/questions/17820334/how-to-set-exporting-default-as-disable


var event1;
var markers_1=[];
var t;
var settime = 0;

var x_data=[];
var x_data_time=[];

var create_path_range;
var create_path_range_check=false;

var tickInterval=Math.round(beaches.length/10);           // 每個區間幾點

$(document).ready(function() {
var x_title=train_distance+"(km)";

line_color_1='#00a0e9';
line_color_2='#00913a';
line_color_3='#ea5514';
line_color_4='#e4007f';
line_color_5='#920783';

/*
line_color_1='#0066CC';
line_color_2='#99CC00';
line_color_3='yellow';
line_color_4='red';
line_color_5='#6633FF';
line_color_6='#66FFCC';
line_color_7='#FFCC00';
*/
var y_speed=[];
var y_altitude=[];
var y_heart_rate=[];
var y_cadence=[];
var y_power=[];
var y_temperature=[];
var y_slope=[];

for (var i = 0; i <beaches.length; i++) {  
     var beach = beaches_obj[i];   
     x_data[i]=Math.round(beach.distance*100)/100;   // 距離取兩位四捨五入
     new_time=beach.start_time.split(" ");
     x_data_time[i]=new_time[1];                     // 去掉部分時間，這邊處理掉

     y_speed[i]=parseFloat(beach.speed);
     y_altitude[i]=parseFloat(beach.altitude);
     y_heart_rate[i]=parseFloat(beach.heart_rate);
     y_cadence[i]=parseFloat(beach.cadence);
     y_power[i]=parseFloat(beach.power);
     y_temperature[i]=parseFloat(beach.temperature);
     y_slope[i]=parseFloat(beach.slope);

}  

Highcharts.setOptions ( {
    exporting: {
        enabled: false            // 可以對個別使用，寫在 chart 裡面就好
    },
    credits: {
        enabled: false
    },
})


    $('#container_1').highcharts({
        chart: {                    
            type: 'spline',
			      spacing: [0,0,0,0],
            zoomType: 'x',    
	        events: {          
	        	//selection: function(event) {                       
            redraw: function(event) {                              
              event1 = event;
              if (settime == 1){clearTimeout(t);}
              settime = 1;              
              t = setTimeout(function(){zoom_start();},3000);                      
	        	}          
	        }
       
        },
     


		title: {
			text: "|",
			align: 'left',
			style: {
            	color: 'white',
           }
		},

    legend: {                   //  y 軸選單控制
			enabled: true,
        	backgroundColor: 'white',        
        	borderWidth: 1,
          itemDistance:20,
	    	  verticalAlign: 'top',                 
          floating:true,
        },      
        xAxis: {
           categories: x_data,
           tickInterval: tickInterval,                        
			plotLines: [{                      // 畫線 test
                color: '#FFFF99',
                width: 10,
                value: 0,
                id: 'plot-band-1'  
			}],

          title: {
					align: 'high',
					offset: 10,
          //text: x_title
           },
        },
        tickWidth: 100,
        lineWidth: 101,
        gridLineWidth: 1,
        tickPixelInterval: 1,
        labels: {
            align: 'left',
        style: {
            color: '#888'
        },
        x: 3,
        y: -14
        },
 

    yAxis: [{
            title: {                     // 第一條
                text: '',                   
            },
    legend: {                 
        	backgroundColor: 'red',
     },                     
            labels: {
                formatter: function() {
                    return this.value 
                },
                 style: {
					        color: line_color_1,	        			
			    	    }
            }
		       

        },
        {
            opposite: true ,               // 第二條
            title: {
                text: '',                
            },             
            labels: {
                formatter: function() {
                    return this.value 
                },
                style: {
					        color: line_color_2,	        			
			    	    }
            },
        },
	   	  {
            opposite: true ,                     // 第三條
            title: {
                text: '', 
            },                
            labels: {
                formatter: function() {
                    return this.value 
                },
                 style: {
					        color: line_color_3,	        			
			    	    }
            },				
        },
	   {
            opposite: true ,                   // 第四條
            title: {
                text: '',                
            },             
            labels: {
                formatter: function() {
                    return this.value 
                },
                style: {
					        color: line_color_4,	        			
			    	    }
            },
        },
         {
            opposite: true ,               // 第五條
            title: {
                text: '',                
            },             
            labels: {
                formatter: function() {
                    return this.value 
                },
                style: {
					        color: line_color_5,	        			
			    	    }
            },
        },
        ],

     navigator : {
			xAxis: {
				tickWidth: 0,
				lineWidth: 0,
				gridLineWidth: 0,
				tickPixelInterval: 1,
				labels: {
					align: 'right',
					style: {
						color: 'white',
					},
					x: 0,
					y:22
				}
			},		
			margin: -60,
			enabled : true,
			maskInside: true,
			//maskFill:'rgba(128,179,236,0.3)',
			baseSeries:0,
	    	series: {
				font: 'white',
				showInLegend:false,
				fillOpacity: 0,
				dataGrouping: {
					smoothed: true
				},
				lineWidth: 1,
				marker: {
					enabled: false
				}
			}
		},    // navigator  end 

        tooltip: {
            shared: true,
            crosshairs: true,     
  //   可以用的參數 this.x + '</b> is <b>' + this.y + '</b>, in series '+ this.series.name;    
  //  formatter: function() {
  //      return 'The value for <b>' + this.y ;
   // }   
 },   	    
        plotOptions: {       // 圖表事件觸發
        spline: {
                lineWidth: 2,                
                marker: {
                    enabled: false         // 圖型小圖示取消
                },                    
            },
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (e) {         
                              create_map_marker( this.x);     // 連動地圖 ，在分為 google 和百度 
                              // 看看要不要連動 表格     
                              go_to_new_page( this.x);                                        
                              //alert ("x="+this.x);        // 只取 x ，y 值是看取道那一條線的值，有 x 就好                              
                            }
                        }
                    }                   
                }
        },
        series: [{
           name:lang_altitude+'(m)',    
           data:y_altitude,
           color:line_color_1,                   
           yAxis: 0,
           visible: true,
        },{
            name:lang_speed+'(km/hr)',
            data:y_speed, 
            color:line_color_2,    
            yAxis: 1,
            visible: true        
        },{
           name:lang_heart_rate,          
           data:y_heart_rate, 
           color:line_color_3,    
           yAxis: 2,
           visible: true,
         },{
           name:lang_cadence,          
           data:y_cadence, 
           color:line_color_4,    
           yAxis: 3,
           visible: false,
         },{
           name:lang_power,         
           data:y_power, 
           color:line_color_5,    
           yAxis: 4,
           visible: false,
         }              
      ]
    });


// 這個是 連動地圖？
function create_map_marker(key_temp)           
{       
          add_highchart_line(key_temp);     // 這個在修一下，讓圖形上面的那條線也移動
          key=key_temp-1;                   // 播放用的 key 
          //beach = beaches_obj[key_temp];
          var myLatLng =myLatLng1[key_temp];           // 直接改用，物件化的座標 ，google 和 baidu 在一開始就分開了         
          // 這邊才分離 google 和 baidu ，分離在不同檔案，會出錯？marker 會出不來，所以先放在這邊
          if (map_config ==1){      
            create_map_marker_google(myLatLng);
          }else{
            create_map_marker_baidu(myLatLng);
          }
}
// highchart 連動地圖 , google 
function create_map_marker_google(myLatLng )
{
         //var myLatLng = new google.maps.LatLng(beach.latitude, beach.longitude);
         var marker = new google.maps.Marker({
             position: myLatLng,   
          });    
         for(i in markers_1){                  // 這樣也可以避掉第一次，沒有值的問題              
              markers_1[i].setMap(null);                           
          }    
          markers_1=[];   // 然後再把陣列歸 0
          markers_1.push(marker);
          marker.setMap(map);         
          for(i in markers){
             markers[i].setMap(null);      // 這個是清除播放時的點
          }
}
function create_map_marker_baidu(myLatLng )        // 連動 baidu
{
  map.clearOverlays(); 
  //var myLatLng = new BMap.Point(beach.longitude,beach.latitude); 
  var marker = new BMap.Marker(myLatLng);
  map.addOverlay(marker);
  markers_1=[];   // 然後再把陣列歸 0
  markers_1.push(marker);
}

// 圖表連動表格
function go_to_new_page(key_temp)
{
  $('#show_jqgrid_location').trigger('click');
  key_temp++;
  var opts = $('#dg').datagrid('options');
  var pager = $('#dg').datagrid('getPager');
  var old_pageSize=opts.pageSize;
  var new_page=Math.ceil(key_temp/old_pageSize);
  var table_high_light=key_temp-( new_page-1)* old_pageSize-1;
   pager.pagination('select', new_page);                // 跳到新頁
   $('#dg').datagrid('selectRow',table_high_light);     // 高亮
}



// 範圍移動時，地圖重新畫線  ,  x 軸更動的時候，他會判定觸發這個
function chart_set_path(p_start,p_end) { 
   var myLatLng2=[];
   for (var i = p_start; i <p_end; i++) {  
     var j=i-p_start;
     myLatLng2[j]= myLatLng1[i]; 
   }
    create_path.setMap(null);
    if (create_path_range_check == true){    
      create_path_range.setMap(null);
    }
     create_path_range = new google.maps.Polyline({
      path: myLatLng2,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
     }); 
     create_path_range_check=true;
     create_path_range.setMap(map);     
}


// 範圍選擇的時候，
function zoom_start()
{ 
   settime = 0;  
   p_min=parseInt(Math.round( event1.target.xAxis[0].min));   
   p_max=parseInt(Math.round( event1.target.xAxis[0].max))+1;
  
   chart_set_path(p_min,p_max);      //重新畫地圖
   // 清空原來的點，重新劃地圖點，不在這邊
   if (key != -1){ 
      if ( markers[key]){
        markers[key].setMap(null);
     }
   }
   play_map_check=false;  
   key=p_min;
   play_final_point_key=p_max;

  // pie 圖也要重新計算,應該也是這種寫法，重新 update 就好,但是所有數據要重算   
  var speed_pie_data=create_pie_data(key,play_final_point_key);
  var chart_pie_speed = $('#container_pie_speed').highcharts();
  chart_pie_speed.series[0].update({       
      data:speed_pie_data,          
  });  

  var heart_pie_data=create_heart_pie_data(key,play_final_point_key);
  var chart_pie_heart = $('#container_pie_heart').highcharts();
  chart_pie_heart.series[0].update({       
       data:heart_pie_data,          
  });  

   

  /*
  var chart_gauge_heart = $('#container_pie_1').highcharts();
  var g_heart=parseFloat(beaches[key].heart_rate);      
  chart_gauge_heart.series[0].points[0].update(g_heart);
  */
}
























});



