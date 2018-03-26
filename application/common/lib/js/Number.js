
function formatFloat(num, pos){
	var size = Math.pow(10, pos);
	return Math.round(num * size) / size;
}