$(document).ready(function(){
    //$('#dg').datagrid({loadFilter:pagerFilter}).datagrid('loadData', getData1());
});

$('#dg_3').datagrid({
  pageSize:5,
  pageList:[5,10,15,20,25,30],                   
});



function getData3(){
  return beaches_lap;
}

function pagerFilter_3(data){
if (typeof data.length == 'number' && typeof data.splice == 'function'){    // is array
data = {
  total: data.length,
  rows: data
}
}
var dg_3 = $(this);
var opts = dg_3.datagrid('options');
var pager = dg_3.datagrid('getPager');

pager.pagination({
layout:['list','first','prev','links','next','last'],
onSelectPage:function(pageNum, pageSize){
  // 重新調整高度
  var need_height=pageSize*25+60;
  $('#show_train_info').css({'height':need_height});
  $('#show_train_info_3').css({'height':need_height});
  $('#dg_3').datagrid('resize',{
    height: need_height
  });
  
  opts.pageNumber = pageNum;
  opts.pageSize = pageSize;
  pager.pagination('refresh',{
    pageNumber:pageNum,
    pageSize:pageSize
  });
dg_3.datagrid('loadData',beaches_lap);
//dg.datagrid('loadData',rows);
}
});
if (!data.originalRows){
data.originalRows = (data.rows);
}
if (!opts.remoteSort && opts.sortName){
		target = this;
		names = opts.sortName;
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
