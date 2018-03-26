var GoogleMapSrv={
	StaticMap:{
		pictureURL:'http://maps.google.com/maps/api/staticmap',
		pictureWidth:200,
		pictureHeight:200,
		scale:1,
		fillcolor:'',
		color:'0x0000ff80',
		lineWeight:2,
		sensor:false,
		getStaticMapEnc:function(points){
			return this.createEncodings(points)
		},
		getStaticMapImageUrl:function(points){
			var encodeString = google.maps.geometry.encoding.encodePath(points);
			var url=this.pictureURL
					+"?size="+this.pictureWidth+"x"+this.pictureHeight
					+"&scale="+this.scale
					+"&path=fillcolor:"+this.fillcolor
					+"|color:"+this.color
					+"|weight:"+this.lineWeight
					+"|enc:"+encodeString 
					+"&sensor="+(this.sensor==false?'false':'true');
			return url;			
		}	
	}
};