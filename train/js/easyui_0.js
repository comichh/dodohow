// http://www.programering.com/a/MTN5ATNwATM.html

$(document).ready(function(){
 //$('#dg').datagrid({loadFilter:pagerFilter_0}).datagrid('loadData', getData_0());   // 這邊要重畫
 // $('#dg_0').datagrid({loadFilter:pagerFilter}).datagrid('loadData', getData0());
});


$('#dg_0').datagrid({
  pageSize:1,
  pageList:[1],                   
});

/*
$('#dg_0').datagrid({
  onLoadSuccess: function(){
      var row=$('#dg_0').datagrid('getPager');      // 這個是抓到選取列     
  }
});
*/

/*
    var row = $('#dg_0').datagrid('getSelected');
    if (row){
       alert('Item ID:'+row.itemid+"\nPrice:"+row.listprice);
    }
*/

/*
function getData(){
// 這個好像就是第一次數據？
  rows=[];   //  這明明就是物件，為何還要轉一次
  for(var i=1; i<=800; i++){
var amount = Math.floor(Math.random()*1000);
var price = Math.floor(Math.random()*1000);
rows.push({
inv: 'Inv No '+i,
date: $.fn.datebox.defaults.formatter(new Date()),
name: 'Name '+i,
amount: amount,
price: price,
cost: amount*price,
note: 'Note '+i
});
}
return rows;
}
*/
//  忘記這個函數名稱怎麼來的？從 train_detail.js
function getData_0(){
  return slq_table_1;  
}

function mysort(a,b){
				 return (a > b ? 1 : -1);
}

function pagerFilter_0(data){
if (typeof data.length == 'number' && typeof data.splice == 'function'){    // is array
data = {
total: data.length,
rows: data
}
}
var dg_0 = $(this);
var opts = dg_0.datagrid('options');
var pager = dg_0.datagrid('getPager');

pager.pagination({
onSelectPage:function(pageNum, pageSize){
  // 重新調整高度
  var need_height=pageSize*25+60;
  $('#show_train_info').css({'height':need_height});
  $('#show_train_info_2').css({'height':need_height});
  $('#dg_0').datagrid('resize',{
    height: need_height
  });
  
  opts.pageNumber = pageNum;
  opts.pageSize = pageSize;
  pager.pagination('refresh',{
    pageNumber:pageNum,
    pageSize:pageSize
  });
dg_0.datagrid('loadData',slq_table_1);
//dg_0.datagrid('loadData',rows);
}
});
if (!data.originalRows){
data.originalRows = (data.rows);
}
  var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
  var end = start + parseInt(opts.pageSize);
  data.rows = (data.originalRows.slice(start, end));
  return data;
}

