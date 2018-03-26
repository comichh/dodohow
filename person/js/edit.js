var beaches;
  //console.log (beaches);
if (beaches !=''){
  var beaches_obj= eval(beaches);    // eval()將JSON字串轉為JavaScript物件 
}
var GoogleMapSrv;

$(document).ready(function(){
GoogleMapSrv={
	StaticMap:{
    pictureURL:'http://maps.google.com/maps/api/staticmap',
		pictureWidth:200,
		pictureHeight:200,
		scale:1,
			fillcolor:'blue',
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
          +"&path="
					//+"&scale="+this.scale
					+"color:"+this.color
					+"|weight:"+this.lineWeight
					+"|enc:"+encodeString 
					+"&sensor="+(this.sensor==false?'false':'true');
/*
					+"?size="+this.pictureWidth+"x"+this.pictureHeight
					+"&scale="+this.scale
					+"|color:"+this.color
					+"|weight:"+this.lineWeight
					+"|enc:"+encodeString 
					+"&sensor="+(this.sensor==false?'false':'true');
*/

			return url;			
		}
	}
};



$('#save').click(function() {
  var train_name=$("#train_name").val();
  var displayname=$("#displayname").val();  
  var sport_type=$('select[id="sport_type"]').val();
  var share=$("input:radio:checked[name='share[]']").val();
  var weather=$("input:radio:checked[name='weather[]']").val();
  var description=$("#desctiption").val();
  var pic='';

  if (beaches !=null){
    var pic1=getenc();
    pic=encodeURIComponent(pic1);
  }
//  if (pic !=''){ // 這個沒有，因為我只有偵測第一次而已
   $.post('ajax/train_save.php', {train_id:train_id,train_name:train_name,displayname:displayname,sport_type:sport_type,share:share,weather:weather,description:description,pic:pic,slope:slope}, function(data){  
    alert (data); 
    //console.log (data);    
 });
 // }





});







});

// 要的就是這個而已 detailObj  ，他的作法是每 n 點取一次，最多400 點

function getenc(){
	var countLimit=200;
	var detailCount=beaches.length;
	var divValue=Math.ceil(detailCount/400);
	//if(divValue==0)	divValue=1	
	//------------------------------------------------
	var pointIndex=0;
	var modValue=0;
	var points = new Array();
	//for(var index=0;index<detailObj.length;index++){
	//	modValue=index%divValue;    //  取餘數
	//	if(modValue==0){
			//points[pointIndex]=new google.maps.LatLng(parseFloat(detailObj[index].latitude), parseFloat(detailObj[index].longitude));
			//pointIndex+=1;
	//	}
	//}
  for (var i = 0; i <beaches.length; i++) {  
     modValue=i%divValue;   
     if(modValue==0){
       var beach = beaches_obj[i];     
       points[pointIndex] = new google.maps.LatLng(beach.latitude ,beach.longitude);
       pointIndex+=1;
     }   
  }
 
	return GoogleMapSrv.StaticMap.getStaticMapImageUrl(points);
}





