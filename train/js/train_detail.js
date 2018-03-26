var map;
var marker ;
var markers = [];

var beach_pic;
var marker_pic;
var markers_pic=[];
var myLatLng_pic=[];

var key=-1;
var play_final_point_key=beaches.length -1;
var market_play;
var create_path;

var beaches;
var beaches_obj= eval(beaches);    
var myLatLng1=[];





$(document).ready(function(){  
  $(document).tooltip({
    track: true
  });      


  
   
  // 下面圖表選擇，選單
  $("#chart_select_show a").eq(0).click(function(){
       var width_temp=$("#chart_select_show").width()-48;       // 8 是 padding 的關係
       $("#chart_select").css({"z-index":2000,"top":"0px","width":width_temp,"left":0}).toggle();        
      return false;
  });
  // 選完圖表後動作
  $("a[id^='pie_']").click(function(){   
     var pic_id=$(this).attr('id');   
     var pic_content=$(this).html() ; 
     $("#chart_select").hide();    
     $("#chart_select_show span").eq(0).html(pic_content) ;  
     $("#chart_select").css({"z-index":0,"top":"0px"});
     // 執行那些圖表要出現
     switch (pic_id) {
        case 'pie_1':
          $("#container_pie_speed").show();       
          break;
       case 'pie_2':  
           $("#container_pie_heart").show();           
           $("#container_pie_speed").hide();          
          break;
       case 'pie_3':
          $("#container_pie_slope").show();   
          $("#container_pie_speed").hide();   
          $("#container_pie_heart").hide();  
          break;
       case 'pie_gauge':
          $("#container_pie_speed").hide();   
          $("#container_pie_heart").hide();  
          $("#container_pie_slope").hide(); 
          // 1,2,3 hide
       break;     
     }
     return false; 
  }); 
   $('#dg_0').datagrid({loadFilter:pagerFilter_0}).datagrid('loadData', getData_0());   // 這邊要重畫
  // 表格顯示控制
  $('#show_jqgrid_total').click(function() {
    $("#show_train_info").css({"height":40});   // 高度也要重新動態調整 
    $("#show_train_info_1").show();
    $("#show_train_info_2").hide();
    $("#show_train_info_3").hide();
    $("#show_jqgrid_total").css("background-image", " url('../pic/train_detail/button_100x35_u.png')");
    $("#show_jqgrid_location").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
    $("#show_jqgrid_lap").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
    $('#dg_0').datagrid({loadFilter:pagerFilter_0}).datagrid('loadData', getData_0());   // 這邊要重畫
    return false;
  });
  $('#show_jqgrid_location').click(function() {
    $("#show_train_info").css({"height":186});
    $("#show_train_info_1").hide();
    $("#show_train_info_2").show();
    $("#show_train_info_3").hide();
    $("#show_jqgrid_total").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
    $("#show_jqgrid_location").css("background-image", " url('../pic/train_detail/button_100x35_u.png')");
    $("#show_jqgrid_lap").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
    $('#dg').datagrid({loadFilter:pagerFilter}).datagrid('loadData', getData1());   // 這邊要重畫
    return false;
  });
  $('#show_jqgrid_lap').click(function() {
      $("#show_train_info").css({"height":186});
      $("#show_train_info_1").hide();
      $("#show_train_info_2").hide();
      $("#show_train_info_3").show();
      $("#show_jqgrid_total").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
      $("#show_jqgrid_location").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
      $("#show_jqgrid_lap").css("background-image", " url('../pic/train_detail/button_100x35_u.png')");
      $('#dg_3').datagrid({loadFilter:pagerFilter_3}).datagrid('loadData', getData3());   // 這邊要重畫
     return false;
  });



  // google map play  
  $('#start_play').click(function() {
   market_play=window.setInterval("setMarkers();",1000);
   // 若是要播放部分，要寫在 highchart 那邊,但是控制開始在這邊，都用 key 再控制而已     
   $("#start_play img").css({"background-image":"url('../pic/train_detail/button_100x35_u.png')","padding":"0px 12px","width":"15px"});
   $("#stop_play img").css({"background-image":"url('../pic/train_detail/button_100x35_b.png')","padding":"0px 12px","width":"15px" }); 
  });
  $('#stop_play').click(function() {
    window.clearInterval(market_play)
    $("#start_play img").css({"background-image":"url('../pic/train_detail/button_100x35_b.png')","padding":"0px 12px","width":"15px" });
    $("#stop_play img").css({"background-image":"url('../pic/train_detail/button_100x35_u.png')","padding":"0px 12px","width":"15px" });
  });




 
   
  //  chart 換到時間
   $('#change_to_time').click(function() {
  $("#change_to_time").css("background-image", " url('../pic/train_detail/button_100x35_u.png')");

  $("#change_to_distance").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
      var chart2 = $('#container_1').highcharts();
        chart2.xAxis[0].update({       
            categories: x_data_time,
            tickInterval: tickInterval, 
            //title: {
            //    text: train_time 
            // }
        });   
    return false;        
    });

  //  chart 換到距離
   $('#change_to_distance').click(function() {
  $("#change_to_time").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
  $("#change_to_distance").css("background-image", " url('../pic/train_detail/button_100x35_u.png')");

       var chart1 = $('#container_1').highcharts();
        chart1.xAxis[0].update({       
            categories: x_data,
            tickInterval: tickInterval, 
            //title: {
            //    text: train_distance+'(km)' 
            // }
        });  
    return false;         
    });

   // 收藏
   $('#plan_save').click(function() {
     if (user_id !='null'){
        $.get('ajax/plan_save.php', {train_id:train_id}, function(data){            
             alert (data[0]);                    
             $("#plan_save_update").html(data[1]+'|');        
        },'json');
     }else{ alert (lang_not_user);}      
   });   
   // 讚
   $('#praise_save').click(function() {
     if (user_id !='null'){
       $.get('ajax/praise_save.php', {train_id:train_id}, function(data){   
          alert (data[0]);            
          $("#praise_save_update").html(data[1]+'|');          
       },'json');
     }else{ alert (lang_not_user);}          
   }); 
  // 分享
  $('#share_this').click(function() {
       $("#share_web_link").toggle();
       $("#share_web_link").css({
            position:'absolute',
            top: $(this).offset().top + $(this).height() + 'px',
            left: $(this).offset().left-800 + 'px',
            zIndex:1000       
       });    
  }); 




});




//  地圖播放時，連動 highchart
function add_highchart_line(key)
{
  var chart_1 = $('#container_1').highcharts();
     chart_1.xAxis[0].removePlotLine('plot-band-1');
     chart_1.xAxis[0].addPlotLine({	           	                    
                color: '#FFFF99',
                width: 10,
                value: key,
                id: 'plot-band-1'
		 });
  // 連動左邊 gauge 圖
  var chart_gauge_speed = $('#container_gauge_speed').highcharts();
  var g_speed=parseFloat(beaches[key].speed);                           
  chart_gauge_speed.series[0].points[0].update(g_speed);

  var chart_gauge_heart = $('#container_gauge_heart').highcharts();
  var g_heart=parseFloat(beaches[key].heart_rate);      
  chart_gauge_heart.series[0].points[0].update(g_heart);
  // chart_gauge_heart.series[0].points[0].update(key);

  var chart_gauge_power = $('#container_gauge_power').highcharts();
  var g_power=parseFloat(beaches[key].power);      
  chart_gauge_power.series[0].points[0].update(g_power);
  // chart_gauge_power.series[0].points[0].update(key);
 
  var chart_gauge_cadence = $('#container_gauge_cadence').highcharts();
  var g_cadence=parseFloat(beaches[key].cadence);      
  chart_gauge_cadence.series[0].points[0].update(g_cadence);
  //chart_gauge_cadence.series[0].points[0].update(key);
}
