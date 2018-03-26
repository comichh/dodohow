function calHrAndMin(val){
	var hrMins=parseFloat(parseInt(val)/36000);
	var hr=parseInt(hrMins);
	var trueMinute=(hrMins-hr)*60;
	var minute=parseInt(trueMinute);
	var second=parseInt((trueMinute-minute)*60);
	return fillzerowithValue(hr)+":"+fillzerowithValue(minute)+":"+fillzerowithValue(second);
}

function fillzerowithValue(val){
	if(val<10){
		return '0'+val;
	}else{
		return ''+val;
	}
}

function calHrAndMinWithSecond(val){
	var hrMins=parseFloat(parseInt(val)/3600);
	var hr=parseInt(hrMins);
	var trueMinute=(hrMins-hr)*60;
	var minute=parseInt(trueMinute);
	var second=parseInt((trueMinute-minute)*60);
	return fillzerowithValue(hr)+":"+fillzerowithValue(minute)+":"+fillzerowithValue(second);
}