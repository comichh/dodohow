/*
範圍連動部分，寫在   gooogle.map.js
*/

var heart_age_obj_array= eval(heart_array);    // 心跳範圍 
var heart_age_obj = heart_age_obj_array[0];    

var range_color_1='#DDDF0D';        // 綠 
var range_color_2='#55BF3B';        // 黃
var range_color_3='#DF5353';        // 紅


// speed    
var speed_container="#container_gauge_speed";
var speed_title=lang_speed;
var speed_unit='km/h';
var speed_range_1=10 ;
var speed_range_2=30 ;
var speed_range_max=80;
var speed_init_date=[0];
var hhh=0;
// 未確定範圍，先這樣，依然沒有 default , 確定使用年紀來計算，所以一定會有年紀
var user_age=30;   // 暫時先用
var heart_container="#container_gauge_heart";
var heart_title=lang_heart_rate;
var heart_unit='BMP';
var heart_range_1=(220-user_age)*0.6 ;
var heart_range_2=(220-user_age)*0.9 ;
var heart_range_max=200;
var heart_init_date=[0];

var power_container="#container_gauge_power";
var power_title=lang_power;
var power_unit='W';
var power_range_1=300 ;
var power_range_2=400 ;
var power_range_max=1500;
var power_init_date=[0];

var cadence_container="#container_gauge_cadence";
var cadence_title=lang_cadence;
var cadence_unit='RPM';
var cadence_range_1=70 ;
var cadence_range_2=90 ;
var cadence_range_max=130;
var cadence_init_date=[0];

/*
pie 圖，暫時試算 速度範圍
範圍等都定義在外層, 顏色都要獨立定義
*/
var speed_container_pie="#container_pie_speed";
var speed_title_0_10='0-10';
var speed_title_10_20='10-20';
var speed_title_20_30='20-30';
var speed_title_30_40='30-40';
//var speed_title_40_50='40-50';
var speed_title_other='>40';
var pie_color_range_1='#ffdc00';
var pie_color_range_2='#79c06e';
var pie_color_range_3='#00a1e9';
var pie_color_range_4='#7f1184';
//var pie_color_range_5='#7f1184';
var pie_color_range_6='#ea553a';
var count_speed_0_10=0;
var count_speed_10_20=0;
var count_speed_20_30=0;
var count_speed_30_40=0;
//var count_speed_40_50=0;
var count_speed_other=0;
var count_speed_distance_0_10=0;
var count_speed_distance_10_20=0;
var count_speed_distance_20_30=0;
var count_speed_distance_30_40=0;
//var count_speed_distance_40_50=0;
var count_speed_distance_other=0;

// 心跳，沒示意圖，分區？ 這邊要加入一段質
var heart_container_pie="#container_pie_heart";
var heart_age_range=[];
heart_age_range[0]=heart_age_obj.heart_a_min;
heart_age_range[1]=heart_age_obj.heart_a_max;
heart_age_range[2]=heart_age_obj.heart_b_max;
heart_age_range[3]=heart_age_obj.heart_c_max;
heart_age_range[4]=heart_age_obj.heart_d_max;
heart_age_range[5]=heart_age_obj.heart_e_max;
var heart_title_0_10=heart_age_range[0]+'-'+heart_age_range[1] ;
var heart_title_10_20=heart_age_range[1]+'-'+heart_age_range[2] ;
var heart_title_20_30=heart_age_range[2]+'-'+heart_age_range[3] ;
var heart_title_30_40=heart_age_range[3]+'-'+heart_age_range[4] ;
var heart_title_other='>'+heart_age_range[4];





var count_heart_0_10=0;
var count_heart_10_20=0;
var count_heart_20_30=0;
var count_heart_30_40=0;
var count_heart_other=0;
var count_heart_distance_0_10=0;
var count_heart_distance_10_20=0;
var count_heart_distance_20_30=0;
var count_heart_distance_30_40=0;
var count_heart_distance_other=0;



$(document).ready(function(){



// 所有圖表適用的設定,gauge 
var config_chart=
{
	        type: 'gauge',
	        plotBackgroundColor: null,
	        plotBackgroundImage: null,
	        plotBorderWidth: 0,
	        plotShadow: true
}

var config_pane=
{
	        startAngle: -150,
	        endAngle: 150,
	        background: [{
	            backgroundColor: {
	                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
	                stops: [
	                    [0, '#FFF'],
	                    [1, '#333']
	                ]
	            },
	            borderWidth: 0,
	            outerRadius: '100%'
	        }, {
	            backgroundColor: {
	                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
	                stops: [
	                    [0, '#333'],
	                    [1, '#FFF']
	                ]
	            },
	            borderWidth: 1,
	            outerRadius: '107%'
	        }, {	      
	        }, {
	            backgroundColor: '#DDD',
	            borderWidth: 0,
	            outerRadius: '105%',
	            innerRadius: '103%'
	        }]
	    }


//  gauge 個別圖示開始
create_gauge(speed_container,speed_title,speed_unit,speed_range_1,speed_range_2, speed_range_max,speed_init_date)
create_gauge(heart_container,heart_title,heart_unit,heart_range_1,heart_range_2, heart_range_max,heart_init_date)
create_gauge(power_container,power_title,power_unit,power_range_1,power_range_2, power_range_max,power_init_date)
create_gauge(cadence_container,cadence_title,cadence_unit,cadence_range_1,cadence_range_2, cadence_range_max,cadence_init_date)


// pie 圖開始
var speed_range_data=create_pie_data(0,beaches.length);
create_pie_chart(speed_container_pie,speed_range_data);

var heart_range_data=create_heart_pie_data(0,beaches.length);
create_pie_chart(heart_container_pie,heart_range_data);


function create_pie_chart(config_container,pie_data)      // pie 圖 ，暫時測適用而已
{
   $(config_container).highcharts({
        chart: {
            type: 'pie',
            options3d: {
			        	enabled: true,
                alpha: 45,
                beta: 0
            }
        },
        title: {
            text: ' '
        },
        tooltip: {
            pointFormat: '{series.name} <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                center: ["60%", "50%"],
                size: "70%",
                cursor: 'pointer',
                depth: 35,               
                dataLabels: {
                    enabled: true,
                    //color: ['red','blue'],
                    connectorWidth:0,
                    distance: 25,
                    connectorPadding:-5,     
                    //backgroundColor: 'rgba(252, 255, 197, 0.7)',                   
                    format: '{point.name} <br>{point.percentage:.1f}%'           
                }
            },
        
        },
        series: [{      
            type: 'pie',
            name:' ',           
            data:pie_data,
            point:{
              events: {
                click: function (event) {
                //console.log (event);                                                             
                 // console.log (this.x);            // 取得點擊後的點,只能取得 index ，所以看看是否要重算！ 
              
                 var chart_1 = $('#container_1').highcharts();
                 chart_1.xAxis[0].removePlotLine('plot-band-1');          // 點擊 pie 圖，線圖重新劃線
                 
                switch (config_container) {
                    case ("#container_pie_speed") :
                      click_pie_speed(0,beaches.length,this.x);     
                    break;   
                    case ("#container_pie_heart") :
                      click_pie_heart(0,beaches.length,this.x);  
                    break;               
                    default:
                    break;
                 } 

    //           
                              
                }
              }
            }
        }]
    });
}








function create_gauge(config_container,config_title,config_unit,config_range_1,config_range_2, config_range_max,config_init_date)
{ 
$(config_container).highcharts({
	    chart: config_chart, 	    
	    title: {
	        text:config_title,          // 這個預定在圖表外面，最上面能有一個標題
         	align: 'left',
          floating: true ,
          style:
          {
            fontSize: '12px'
          }
          
       
	    },	    
	    pane:config_pane ,	       	   
	    yAxis: {
	        min: 0,
	        max: config_range_max,	        
	        minorTickInterval: 'auto',
	        minorTickWidth: 1,
	        minorTickLength: 10,
	        minorTickPosition: 'inside',
	        minorTickColor: '#666',
	
	        tickPixelInterval: 30,
	        tickWidth: 2,
	        tickPosition: 'inside',
	        tickLength: 10,
	        tickColor: '#666',
	        labels: {
	            step: 2,
	            rotation: 'auto'
	        },
	        title: {
	            text: ' '               // 這邊可以秀一個類似標題的東西，在圖片上面
	        },
	        plotBands: [{               // 重點是這個, 顏色範圍選定
	            from: 0,
	            to: config_range_1,
	            color: range_color_1 // green
	        }, {
	            from: config_range_1,
	            to: config_range_2,
	            color: range_color_2 // yellow
	        }, {
	            from: config_range_2,
	            to: config_range_max,
	            color: range_color_3 // red
	        }]        
	    },
	
	    series: [{
	        name: config_title,                      //滑上去顯示
	        data: config_init_date,
	        tooltip: {
	            valueSuffix: config_unit
	        }
	    }]
	} 
);
}





});


function create_pie_data(i_start,i_end)
{
count_speed_0_10=0;
count_speed_10_20=0;
count_speed_20_30=0;
count_speed_30_40=0;   
count_speed_other=0;
  for (var i = i_start; i <i_end; i++) 
   {  
   var beach = beaches_obj[i];       
   var speed_distance=beach.distance/1000; 
   var y_speed=parseFloat(beach.speed);   

   switch (true) {
      case ( y_speed >=0 &&  y_speed <10  ) :
        count_speed_0_10++;
        count_speed_distance_0_10+=speed_distance;
      break;
      case ( y_speed >=10 &&  y_speed <20  ) :
        count_speed_10_20++;
        count_speed_distance_10_20=count_speed_distance_10_20+speed_distance;
      break;
      case ( y_speed >=20 &&  y_speed <30  ) :
        count_speed_20_30++;
         count_speed_distance_20_30=count_speed_distance_20_30+speed_distance;
      break;
      case ( y_speed >=30 &&  y_speed <40  ) :
        count_speed_30_40++;
        count_speed_distance_30_40=count_speed_distance_30_40+speed_distance;
      break;
      default:
         count_speed_other++;
        count_speed_distance_other=count_speed_distance_other+speed_distance;
      break;       
   }
   }
count_speed_distance_0_10=Math.round(count_speed_distance_0_10*100)/100;
count_speed_distance_10_20=Math.round(count_speed_distance_10_20*100)/100;
count_speed_distance_20_30=Math.round(count_speed_distance_20_30*100)/100;
count_speed_distance_30_40=Math.round(count_speed_distance_30_40*100)/100;
count_speed_distance_other=Math.round(count_speed_distance_other*100)/100;
// 這個是最後呈現出來的數據, 改成非 0 才秀
var speed_data=[];
if ( count_speed_0_10 !=0)
{
  var value_temp={name:speed_title_0_10+'km/h<br>'+count_speed_distance_0_10+'km',y:count_speed_0_10,color:pie_color_range_1,dataLabels:{color:pie_color_range_1}};
  speed_data.push(value_temp);
}
if ( count_speed_10_20 !=0)
{
  var value_temp={name:speed_title_10_20+'km/h<br>'+count_speed_distance_10_20+'km',y:count_speed_10_20,color:pie_color_range_2,dataLabels:{color:pie_color_range_2}};
  speed_data.push(value_temp);
}
if ( count_speed_20_30 !=0)
{
  var value_temp={name:speed_title_20_30+'km/h<br>'+count_speed_distance_20_30+'km',y:count_speed_20_30,color:pie_color_range_3,dataLabels:{color:pie_color_range_3}};
  speed_data.push(value_temp);
}
if ( count_speed_30_40 !=0)
{
  var value_temp=  {name:speed_title_30_40+'km/h<br>'+count_speed_distance_30_40+'km',y:count_speed_30_40,color:pie_color_range_4,dataLabels:{color:pie_color_range_4}};
  speed_data.push(value_temp);
}
if ( count_speed_other !=0)
{
  var value_temp={name:speed_title_other+'km/h<br>'+count_speed_distance_other+'km',y:count_speed_other,color:pie_color_range_6,dataLabels:{color:pie_color_range_6}};
  speed_data.push(value_temp);
}
  return speed_data;
}


///
function create_heart_pie_data(i_start,i_end)
{
count_heart_0_10=0;
count_heart_10_20=0;
count_heart_20_30=0;
count_heart_30_40=0;
count_heart_other=0;
  for (var i = i_start; i <i_end; i++) 
   {  
   var beach = beaches_obj[i];       
   var heart_distance=beach.distance/1000; 
   y_heart=parseFloat(beach.heart_rate);      
   switch (true) {
      //case ( y_heart >=0 &&  y_heart <120  ) :
      case ( y_heart >=heart_age_range[0] &&  y_heart <heart_age_range[1]  ) :

        count_heart_0_10++;
        count_heart_distance_0_10+=heart_distance;
      break;
//      case ( y_heart >=120 &&  y_heart <140  ) :
   case ( y_heart >=heart_age_range[1] &&  y_heart <heart_age_range[2]  ) :
        count_heart_10_20++;
        count_heart_distance_10_20+=heart_distance;
      break;
//      case ( y_heart >=140 &&  y_heart <160  ) :
 case ( y_heart >=heart_age_range[2] &&  y_heart <heart_age_range[3]  ) :
        count_heart_20_30++;
        count_heart_distance_20_30+=heart_distance;
      break;
//      case ( y_heart >=160 &&  y_heart <180  ) :
  case ( y_heart >=heart_age_range[3] &&  y_heart <heart_age_range[4]  ) :
        count_heart_30_40++;
        count_heart_distance_30_40+=heart_distance;
      break;
      default:
        count_heart_other++;
        count_heart_distance_other+=heart_distance;
      break;       
   }
   }
count_heart_distance_0_10=Math.round(count_heart_distance_0_10*100)/100;
count_heart_distance_10_20=Math.round(count_heart_distance_10_20*100)/100;
count_heart_distance_20_30=Math.round(count_heart_distance_20_30*100)/100;
count_heart_distance_30_40=Math.round(count_heart_distance_30_40*100)/100;
count_heart_distance_other=Math.round(count_heart_distance_other*100)/100;



// 這個是最後呈現出來的數據
   var heart_data=
    [
      {name:heart_title_0_10+lang_heart_rate_unit +'<br>'+count_heart_distance_0_10+'km',y:count_heart_0_10,color:pie_color_range_1,dataLabels:{color:pie_color_range_1}},
      {name:heart_title_10_20+lang_heart_rate_unit+'<br>'+count_heart_distance_10_20+'km',y:count_heart_10_20,color:pie_color_range_2,dataLabels:{color:pie_color_range_2}},
      {name:heart_title_20_30+lang_heart_rate_unit+'<br>'+count_heart_distance_20_30+'km',y:count_heart_20_30,color:pie_color_range_3,dataLabels:{color:pie_color_range_3}},
      {name:heart_title_30_40+lang_heart_rate_unit+'<br>'+count_heart_distance_30_40+'km',y:count_heart_30_40,color:pie_color_range_4,dataLabels:{color:pie_color_range_4}},   
      {name:heart_title_other+lang_heart_rate_unit+'<br>'+count_heart_distance_other+'km',y:count_heart_other,color:pie_color_range_6,dataLabels:{color:pie_color_range_6}},   
    ];
var heart_data=[];
if ( count_heart_0_10!=0)
{
  var value_temp={name:heart_title_0_10+lang_heart_rate_unit+'<br>'+count_heart_distance_0_10+'km',y:count_heart_0_10,color:pie_color_range_1,dataLabels:{color:pie_color_range_1}};
  heart_data.push(value_temp);
}
if ( count_heart_10_20!=0)
{
  var value_temp={name:heart_title_10_20+lang_heart_rate_unit+'<br>'+count_heart_distance_10_20+'km',y:count_heart_10_20,color:pie_color_range_2,dataLabels:{color:pie_color_range_2}};
  heart_data.push(value_temp);
}
if ( count_heart_20_30!=0)
{
  var value_temp={name:heart_title_20_30+lang_heart_rate_unit+'<br>'+count_heart_distance_20_30+'km',y:count_heart_20_30,color:pie_color_range_3,dataLabels:{color:pie_color_range_3}};
  heart_data.push(value_temp);
}
if ( count_heart_30_40!=0)
{
  var value_temp=  {name:heart_title_30_40+lang_heart_rate_unit+'<br>'+count_heart_distance_30_40+'km',y:count_heart_30_40,color:pie_color_range_4,dataLabels:{color:pie_color_range_4}};
  heart_data.push(value_temp);
}
if ( count_heart_other!=0)
{
  var value_temp={name:heart_title_other+lang_heart_rate_unit+'<br>'+count_heart_distance_other+'km',y:count_heart_other,color:pie_color_range_6,dataLabels:{color:pie_color_range_6}};
  heart_data.push(value_temp);
}
   return heart_data;
}

 
function click_pie_speed(i_start,i_end,pic_index)
{
 for (var i = i_start; i <i_end; i++) 
 {  
   var beach = beaches_obj[i];  
   var need_speed_distance=[];   
   need_speed_distance[i]=beach.distance; 
   y_speed=parseFloat(beach.speed);   
   
   switch (true) {
      case ( y_speed >=0 &&  y_speed <10 && pic_index==0  ) :
         pie_create_new_line(i,pie_color_range_1);
      break;
      case ( y_speed >=10 &&  y_speed <20 && pic_index==1 ) :
         pie_create_new_line(i,pie_color_range_2);
      break;
      case ( y_speed >=20 &&  y_speed <30 && pic_index==2  ) :
         pie_create_new_line(i,pie_color_range_3);
      break;
      case ( y_speed >=30 &&  y_speed <40 && pic_index==3 ) :
         pie_create_new_line(i,pie_color_range_4);
      break;
      case ( y_speed >=40 && pic_index==4 ) :
         pie_create_new_line(i,pie_color_range_6);
      break;       
  }
}
}

function click_pie_heart(i_start,i_end,pic_index)
{
 for (var i = i_start; i <i_end; i++) 
 {  
   var beach = beaches_obj[i];       
   var heart_distance=beach.distance/1000; 
   y_speed=parseFloat(beach.heart_rate);      
   
   switch (true) {
      case ( y_speed >=0 &&  y_speed <120 && pic_index==0  ) :
         pie_create_new_line(i,pie_color_range_1);
      break;
      case ( y_speed >=120 &&  y_speed <140 && pic_index==1 ) :
         pie_create_new_line(i,pie_color_range_2);
      break;
      case ( y_speed >=140 &&  y_speed <160 && pic_index==2  ) :
         pie_create_new_line(i,pie_color_range_3);
      break;
      case ( y_speed >=160 &&  y_speed <180 && pic_index==3 ) :
         pie_create_new_line(i,pie_color_range_4);
      break;
      case ( y_speed >=180 && pic_index==4 ) :
         pie_create_new_line(i,pie_color_range_6);
      break;       
  }
}
}

// 畫y http://www.highcharts.com/stock/demo/yaxis-plotlines

function  pie_create_new_line(i,color)
{
  var chart_1 = $('#container_1').highcharts();
       //chart_1.xAxis[0].removePlotLine('plot-band-1');
       chart_1.xAxis[0].addPlotLine({	           	                    
                color: color,
                width: 1,
                value:i,
                id: 'plot-band-1'
		   });
}   
