function initialize() {
   geocoder = new BMap.Geocoder();   
}


function geocoder_return(address)
{
   geocoder.getPoint( address, function(point) {
		if (point) {
			var lat=point.lat;
			var lng=point.lng;
			var url=next_page+
				"?lat="+lat+
				"&lng="+lng;
       	$('#iframe_table').attr('src',url);
			  updatePosition(lat,lng,address); 
		} else {     
       alert(SportHistory_errer_1);
		}
	});
}

