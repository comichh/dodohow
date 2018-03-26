function initialize() {
	geocoder = new google.maps.Geocoder();
}

function geocoder_return(address)
{
   geocoder.geocode( {'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var lat=results[0].geometry.location.lat();
			var lng=results[0].geometry.location.lng();
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