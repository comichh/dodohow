// 每一點位置表格
var now_page_num=1;
var now_page_size=5;
var names ;       // 排序用

 
$(document).ready(function(){
 $('#dg').datagrid({
   onClickRow: function(rowIndex,rowData){
     var click_num=(now_page_num-1)*now_page_size+rowIndex+1;          
     create_map_marker_easyui(click_num);            // 不知道為什麼抓不到原來函數，只好在定義一個
   }
  });
});

function create_map_marker_easyui(key_temp)
{       
          add_highchart_line(key_temp);  
          key=key_temp-1;                              // 播放用的 key 
          beach = beaches_obj[key_temp];              
          var myLatLng = new google.maps.LatLng(beach.latitude, beach.longitude);
          var marker = new google.maps.Marker({
             position: myLatLng,   
          });    
            for(i in markers_1){                       // 這樣也可以避掉第一次，沒有值的問題
              markers_1[i].setMap(null);                           
          }    
          markers_1=[];                                // 然後再把陣列歸 0
          markers_1.push(marker);
          marker.setMap(map);
          for(i in markers){
             markers[i].setMap(null);                   // 這個是清除自動播放時的上一點
          }
}


$('#dg').datagrid({          // 初始狀態
  pageNumber:now_page_num,
  pageSize:now_page_size,
  pageList:[5,10,15,20,25,30,200],  
});


// 寫在 train_detail.js 那邊，
function getData1(){
  return beaches;   
}

function pagerFilter(data){
if (typeof data.length == 'number' && typeof data.splice == 'function'){    // is array
 data = {
   total: data.length,
   rows: data,
 }
}
var dg = $(this);
var opts = dg.datagrid('options');
var pager = dg.datagrid('getPager');
pager.pagination({
 layout:['list','first','prev','links','next','last'],
  onSelectPage:function(pageNum, pageSize){
    // 重新調整高度
    var need_height=pageSize*25+60;
    $('#show_train_info').css({'height':need_height});
    $('#show_train_info_2').css({'height':need_height});
    $('#dg').datagrid('resize',{
      height: need_height
    });
    now_page_num= pageNum;
    now_page_size=pageSize;
    opts.pageNumber = now_page_num;
    opts.pageSize = now_page_size;
    pager.pagination('refresh',{
      pageNumber:pageNum,
      pageSize:pageSize,
   });
  dg.datagrid('loadData',beaches);
  //dg.datagrid('loadData',data.rows);
}
});
if (!data.originalRows){
  data.originalRows = (data.rows);
}
// 排序用，localdata 
if (!opts.remoteSort && opts.sortName){
		target = this;
		names = opts.sortName;
		//orders = opts.sortOrder;   
	  data.originalRows.sort(sortNumber);
}
  var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
  var end = start + parseInt(opts.pageSize);
  data.rows = (data.originalRows.slice(start, end));  
  return data;
}
  

function sortNumber(r1,r2)
{      
  return r1[names]-r2[names];
}
