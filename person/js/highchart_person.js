/*
y_data_update 的中文不改無所謂，沒用到
*/

var now_date;
var lTotalDistance_0=[];
var wAscent_0=[];
var wCalory_0=[];
var lTotalDistance_1=[];
var wAscent_1=[];
var wCalory_1=[];
var lTotalDistance_2=[];
var wAscent_2=[];
var wCalory_2=[];

var button_1=3;
var button_2=1;
var button_3=0;         // 自行車是 2 , 跑步是 0

var chart;

$(document).ready(function(){  

now_date=$("#now_date").html();
chart_data(beaches);                //  第一次進來的預設數據
//console.log (beaches);

var data_x_year=[month_1,month_2,month_3,month_4,month_5,month_6,month_7,month_8,month_9,month_10,month_11,month_12];
var data_x_month=['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];   
var data_x_week=[week_1,week_2,week_3,week_4,week_5,week_6,week_7];

   
$('#button1_1').bind('click',function() {     //按週
  now_date=$("#now_date").html();
  now_date_array=now_date.split("-");  
  if (button_1 ==3){
     now_date=now_date_array[0]+"-"+now_month;
     $.get('ajax/get_first_week.php', {now_date: now_date,need:'year'}, function(data){  
           var first=data;
           var last=parseInt(data)+6;
           $("#now_date").html(now_date_array[0]+"-"+now_month+"-("+first+"~"+last+")");         
     });             
  }else {                                        
     $.get('ajax/get_first_week.php', {now_date: now_date,need:'month'}, function(data){  
           var first=data;
           var last=parseInt(data)+6;
           $("#now_date").html(now_date_array[0]+"-"+now_date_array[1]+"-("+first+"~"+last+")");         
     });           
  }
  chart =$('#container_person').highcharts();
  chart.xAxis[0].update({        // x 軸更動 , y 的數據要清空，不然他會認為有      
      categories: data_x_week, 
       max:6                  
  }); 
  new_now_date=$("#now_date").html();     
  $.getJSON("ajax/calendar.php",{now_date:new_now_date,need:'get_click_week_data'},function( data ) {      // 重新劃圖        
   chart_data(data);       
           y_data_update_if();
  });
  $("#button1_1").css("background-image", " url('../pic/train_detail/button_100x35_u.png')");
  $("#button1_2").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
  $("#button1_3").css("background-image", " url('../pic/train_detail/button_100x35_b.png')")
  button_1=1;  
});      

$('#button1_2').bind('click',function() {   //按月, 這邊 y 的數據要重算
   now_date_array=$("#now_date").html().split("-");   
  if (button_1 ==3){
    if ( now_date_array.length >1 ){
        $("#now_date").html(now_date_array[0]+"-"+now_date_array[1]);   // 換到當前月合理         
       
    }else{
        $("#now_date").html(now_date_array[0]+"-"+now_month);
    }      
  }else{        // 從週來的直接抓
    $("#now_date").html(now_date_array[0]+"-"+now_date_array[1]); 
  }

  new_now_date=$("#now_date").html();     
  $.getJSON("ajax/calendar.php",{now_date:new_now_date,need:'get_click_month_data'},function( data ) {      // 重新劃圖    
         chart_data(data);       
         y_data_update_if();
         chart =$('#container_person').highcharts();
            chart.xAxis[0].update({        // x 軸更動       
            categories: data_x_month,  
            max:data.length-1          
        }); 
 });
  $("#button1_1").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
  $("#button1_2").css("background-image", " url('../pic/train_detail/button_100x35_u.png')");
  $("#button1_3").css("background-image", " url('../pic/train_detail/button_100x35_b.png')")
  button_1=2;
});  
    
$('#button1_3').bind('click',function() {     //按年
  now_date_array=$("#now_date").html().split("-");   
  $("#now_date").html(now_date_array[0]); 
  chart =$('#container_person').highcharts();
  chart.xAxis[0].update({            // x 軸更動       
         categories:data_x_year ,  
         max:11      
  });
  //if (now_date_array[0]!= now_year){        // bug ，應該還是要觸發一次才對，週月回來年也要觸發才對
    now_date=$("#now_date").html();
    $.getJSON("ajax/calendar.php",{now_date:now_date,need:'get_click_year_data'},function( data ) {      // 重新劃圖   
        chart_data(data);       
         y_data_update_if();
    });
  //}
  $("#button1_1").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
  $("#button1_2").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
  $("#button1_3").css("background-image", " url('../pic/train_detail/button_100x35_u.png')")
  button_1=3;
});

$('#d_right').click(function() {
   now_date=$("#now_date").html();
   now_date_array=now_date.split("-");
   var year=parseInt(now_date_array[0]);
   if (button_1==3){              //  next year
      year++;
      $("#now_date").html(year);        
      $.getJSON("ajax/calendar.php",{now_date:now_date,need:'get_next_year_data'},function( data ) {      // 重新劃圖   
         chart_data(data);      
         y_data_update_if();
     });  
   }else if (button_1==2){        //  next month
     if ( now_date_array[1]==12){now_date_array[1]=0;year++;}   
     month=parseInt(now_date_array[1])+1; 
     $("#now_date").html(year+"-"+month );
     $.getJSON("ajax/calendar.php",{now_date:now_date,need:'get_next_month_data'},function( data ) {      // 重新劃圖   
         chart_data(data);       
         y_data_update_if();
         chart =$('#container_person').highcharts();
             chart.xAxis[0].update({        // x 軸更動       
             categories: data_x_month,  
             max:data.length-1          
         }); 
     });       
   }else{                          //  next 週 
     $.get('ajax/calendar.php', {now_date: now_date,need:'next_week'}, function(data){    // 週改變取值
         $("#now_date").html(data);
         $.getJSON("ajax/calendar.php",{now_date:now_date,need:'get_next_week_data'},function( data ) {      // 重新劃圖   
           chart_data(data);       
           y_data_update_if();
        }); 
     });
   
   }
});


$('#d_left').click(function() {
   now_date=$("#now_date").html();
   now_date_array=now_date.split("-");
   var year=parseInt(now_date_array[0]);
   if (button_1==3){              //  last year
      year--;
      $("#now_date").html(year);        
      $.getJSON("ajax/calendar.php",{now_date:now_date,need:'get_last_year_data'},function( data ) {      // 重新劃圖   
         chart_data(data); 
         y_data_update_if();
     });  
   }else if (button_1==2){        //  last month
     if ( now_date_array[1]==1){now_date_array[1]=12;year--;}   
     month=parseInt(now_date_array[1])-1; 
     $("#now_date").html(year+"-"+month );
     $.getJSON("ajax/calendar.php",{now_date:now_date,need:'get_last_month_data'},function( data ) {      // 重新劃圖   
         chart_data(data);             
         y_data_update_if();
         chart =$('#container_person').highcharts();
             chart.xAxis[0].update({        // x 軸更動       
             categories: data_x_month,  
             max:data.length-1          
         }); 
     });       
   }else{                          //  last 週 
     $.get('ajax/calendar.php', {now_date: now_date,need:'last_week'}, function(data){    // 週改變取值
       $("#now_date").html(data);
           $.getJSON("ajax/calendar.php",{now_date:now_date,need:'get_last_week_data'},function( data ) {      // 重新劃圖   
              chart_data(data);       
              y_data_update_if();

           });  
    });    
   }
});



   $('#button2_1').click(function() {
       change_to_dis();           
   });
   $('#button2_2').click(function() {
      change_to_calory();         
    });
   $('#button2_3').click(function() {
      change_to_height();               
   });
  
  $('#button3_0').click(function() {       // 全部運動
    button_3=0;
    y_data_update_if();
    $("#button3_0").css("background-image", " url('../pic/train_detail/button_100x35_u.png')");
    $("#button3_1").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
    $("#button3_2").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
  });
  $('#button3_1').click(function() {       // 自行車
    button_3=2;
    y_data_update_if();
    $("#button3_0").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
    $("#button3_1").css("background-image", " url('../pic/train_detail/button_100x35_u.png')");
    $("#button3_2").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
  });
  $('#button3_2').click(function() {        // 跑步
    button_3=1;    
    y_data_update_if();
    $("#button3_0").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
    $("#button3_1").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
    $("#button3_2").css("background-image", " url('../pic/train_detail/button_100x35_u.png')");
  });  

function chart_data(beaches)
{ 
var beaches_obj= eval(beaches);    // eval()將JSON字串轉為JavaScript物件 
lTotalDistance_0=[];
wAscent_0=[];
wCalory_0=[];
lTotalDistance_1=[];
wAscent_1=[];
wCalory_1=[];
lTotalDistance_2=[];
wAscent_2=[];
wCalory_2=[];
for(var key in beaches_obj){   
      var beach = beaches_obj[key];  
      lTotalDistance_0.push(beach.lTotalDistance_0); 
      wAscent_0.push(beach.wAscent_0); 
      wCalory_0.push(beach.wCalory_0);         
      lTotalDistance_1.push(beach.lTotalDistance_1); 
      wAscent_1.push(beach.wAscent_1); 
      wCalory_1.push(beach.wCalory_1);   
      lTotalDistance_2.push(beach.lTotalDistance_2); 
      wAscent_2.push(beach.wAscent_2); 
      wCalory_2.push(beach.wCalory_2);                
}
}

function y_data_update_if()           //   這邊中文不重要，因為實際上用不到
{

  if (button_3 ==1){ 
    if (button_2==1){y_data_update('距離',lTotalDistance_1);}
    else if (button_2==2) { y_data_update('卡路里',wCalory_1);}
    else { y_data_update('累積高度',wAscent_1);}
  }else if (button_3 ==2){   
    if (button_2==1){y_data_update('距離',lTotalDistance_2);}
    else if (button_2==2) { y_data_update('卡路里',wCalory_2);}
    else { y_data_update('累積高度',wAscent_2);}
  }else {
    //console.log (lTotalDistance_0);
    if (button_2==1){y_data_update('距離',lTotalDistance_0);}
    else if (button_2==2) { y_data_update('卡路里',wCalory_0);}
    else { y_data_update('累積高度',wAscent_0);}
  }

     
}

function y_data_update(title,value)
{
  chart =$('#container_person').highcharts();
          chart.series[0].update({
//              name:title,                   // 名稱實際上可以省略，所以不更新也無關，用他內建的控制方式才會有差
              data:value
  });
}

function change_to_dis()      
{
      $("#button2_1").css("background-image", "url('../pic/train_detail/button_100x35_u.png')");
      $("#button2_2").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
      $("#button2_3").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
      if (button_3 ==1){ 
        y_data_update('距離',lTotalDistance_1);
      }else if (button_3 ==2) {
        y_data_update('距離',lTotalDistance_2);
      }else{
        y_data_update('距離',lTotalDistance_0);
      }
     button_2=1;
}
function change_to_calory()      
{
      $("#button2_1").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
      $("#button2_2").css("background-image", " url('../pic/train_detail/button_100x35_u.png')");
      $("#button2_3").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
        if (button_3 ==1){ 
          y_data_update('卡路里',wCalory_1);
        }else if (button_3 ==2) {
          y_data_update('卡路里',wCalory_2);
        }else{
          y_data_update('卡路里',wCalory_0);
        }  
      button_2=2;  
}


function change_to_height()      
{
  $("#button2_1").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
      $("#button2_2").css("background-image", " url('../pic/train_detail/button_100x35_b.png')");
      $("#button2_3").css("background-image", " url('../pic/train_detail/button_100x35_u.png')");   
         if (button_3 ==1){ 
           y_data_update('累積高度',wAscent_1);
         }else if (button_3 ==2) {
           y_data_update('累積高度',wAscent_2);
         }else{
           y_data_update('累積高度',wAscent_0);
         }              
    button_2=3;  
}





//   圖表程式


  Highcharts.setOptions ({
    exporting: {
        enabled: false            // 可以對個別使用，寫在 chart 裡面就好
    },
    credits: {
        enabled: false
    },
  })
  $('#container_person').highcharts({
        chart: {
            type: 'column'
        },
        legend: {                   //  y 軸選單控制
			    enabled: false,
        },
        title: {
			    text: "|",
			    align: 'left',
			    style: {
            	color: 'white',
           }
		    },
        xAxis: {
            categories:data_x_year
        },
        yAxis: {
            min: 0,
            title: {
                text: ' '
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
          //  name: '距離',
            data: lTotalDistance_0
        }]
    });









});