$(function(){
  $("#list").jqGrid({
		datatype: "local",
		autowidth: true,
		height: 250,
		rowNum:5,
		colNames:['Inv No','Date', 'Client', 'Amount','Tax','Total','Notes'],
		colModel:[ 
			{name:'id',index:'id', width:60, sorttype:"int",searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
			{name:'invdate',index:'invdate', width:90, sorttype:"date",searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
			{name:'name',index:'name', width:100,searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
			{name:'amount',index:'amount', width:80, align:"right",sorttype:"float",searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
			{name:'tax',index:'tax', width:80, align:"right",sorttype:"float",searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
			{name:'total',index:'total', width:80,align:"right",sorttype:"float",searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}},
			{name:'note',index:'note', width:150,searchoptions:{sopt:['eq','ne','le','lt','gt','ge']}}
		],
		multiselect: true,
		pager: '#pager',
		viewrecords: true,
		rowList : [5,10,20,30,50,100],
		caption: "Manipulating Array Data"
	});
	loadDataToGrid();
});

function getDataFromService(){
	var mydata = [
		{id:"1",invdate:"2007-10-01",name:"test",note:"note",amount:"200.00",tax:"10.00",total:"210.00"},
		{id:"2",invdate:"2007-10-02",name:"test2",note:"note2",amount:"300.00",tax:"20.00",total:"320.00"},
		{id:"3",invdate:"2007-09-01",name:"test3",note:"note3",amount:"400.00",tax:"30.00",total:"430.00"},
		{id:"4",invdate:"2007-10-04",name:"test",note:"note",amount:"200.00",tax:"10.00",total:"210.00"},
		{id:"5",invdate:"2007-10-05",name:"test2",note:"note2",amount:"300.00",tax:"20.00",total:"320.00"},
		{id:"6",invdate:"2007-09-06",name:"test3",note:"note3",amount:"400.00",tax:"30.00",total:"430.00"},
		{id:"7",invdate:"2007-10-04",name:"test",note:"note",amount:"200.00",tax:"10.00",total:"210.00"},
		{id:"8",invdate:"2007-10-03",name:"test2",note:"note2",amount:"300.00",tax:"20.00",total:"320.00"},
		{id:"9",invdate:"2007-09-01",name:"test3",note:"note3",amount:"400.00",tax:"30.00",total:"430.00"}
	];
	return mydata;
}

function loadDataToGrid(){
	
	var data=getDataFromService();
	for(var i=0;i<=data.length;i++){
		$("#list").jqGrid('addRowData',i+1,data[i]);
	}
	$('#list').trigger('reloadGrid');
}