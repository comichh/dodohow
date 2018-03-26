var map;
var serachMap;
var maploaded=false;
var mapForSearchloaded=false;

$(function() {
	$('#myTab a').click(function (e) {
		switch($(e.target).attr("href")){
			case "#profile":
				if(!maploaded){
					setTimeout(function(){
						initialize();
					},500);
				}
				break;
			case "#SearchNearBy":
				
				if(!mapForSearchloaded){
					setTimeout(function(){
						MapForsearch();
					},500);
				}
				
				break;
			default:
				break;
		}
	});
	
	$("#UserPhoto").attr('src','../upload/user/'+UserImage);
	$("#UserPhoto").show(500);
	$("#UserPhotoSmall").attr('src','../upload/user/'+UserImage);
	
	
	/*
	$("#TypeChar").msgPlay({
		speed: 10 
	});
	*/
	$("#updateDetail").click(function(){
		updateDetail();
	});
	
	
		getDevicelistByAjax();
});

var jsonArray;
function getDevicelistByAjax(){
	var fullUrl="./common/lib/php/GetDeviceList.php?ud="+$('#test').val();
	$.ajax({
		url:fullUrl,
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {
			jsonArray=eval('('+Jdata+')');
			var str='';
			var tableStr='';
			if(jsonArray.length>0){
				for(var i=0;i<jsonArray.length;i++){
					str+="<sapn id='deviceid' class='badge badge-info' style='height:30px'>"+jsonArray[i].modelname+"</span>&nbsp;&nbsp;<input type='text' class='input-large' style='position:relative;height:26px;top:2px' id='DisplayName_"+jsonArray[i].id+"' size=20 value='"+jsonArray[i].displayname+"' /><img src='./images/update.png' onclick='changeUserDeviceName(\""+jsonArray[i].deviceid+"\",\"DisplayName_"+jsonArray[i].id+"\","+jsonArray[i].id+")' style='cursor:pointer;position:relative;top:-4px;left:2px'><span id='DisplayName_"+jsonArray[i].id+"_loading' style='display:none'>&nbsp;&nbsp;<img src='./images/LoadingShine.gif' /></span><br>";
				}
				tableStr="<table><tr><td>"+str+"</td></tr></table>";
			}
			
			$('#DeviceList').html(tableStr);
		},
		error: function() {
			alert("ERROR!!! by getDataByJSON()");
		}
	});
	$('#NickName').val(nickname);
}

function openMsgbox(){
	$("#myModal").modal('show');
}

function changeUserPhoto(url){
	var urlArray=url.split("/");
	var picName=urlArray[urlArray.length-1];
	$.ajax({
		url:'./common/lib/php/UpdateMySetting.php',
		type:'POST',
		data:'userID='+encodeURIComponent(user_id)+'&photoImgName='+encodeURIComponent(picName),
		success: function(response) {
			setTimeout(function(){
				//document.getElementById("UserPhoto").src=url;
				$('#UserPhoto').attr("src", url);
				$('#UserPhotoSmall').attr("src", url);
				//$('#UserPhoto').attr("src",url);
				//var d=new Date();
				//alert(url+"?id="+(d.getTime()));
				//alert(url);
				//$("#UserPhotoTD").html('<img id="UserPhoto" src="'+url+'" onclick="openMsgbox()" style="border:1px solid #cecece;cursor:pointer;width:120px;display:none" alt="">');
				//$("#UserPhoto").removeAttr("src").attr("src", url);
				//$('#UserPhoto').attr("src", url+"?timestamp=" + new Date().getTime());
				//$('#UserPhotoSmall').attr("src", url+"?timestamp=" + new Date().getTime());
				//$('#UserPhoto').attr("src", url+"?timestamp=" + new Date().getTime());
				//$('#UserPhotoSmall').attr("src", url+"?timestamp=" + new Date().getTime());
				//$('#UserPhoto').fadeIn(500);
			},500);
		},
		error: function() {
			alert("ERROR!!! by UpdateSettings click()");
		}
	});
}

function changeUserDeviceName(DeviceID,DeviceNameFieldID,rowID){
	$('#DisplayName_'+rowID+"_loading").show();
	var DeviceName=$('#'+DeviceNameFieldID).val();
	$.ajax({
		url:'./common/lib/php/UpdateMyDeviceSetting.php',
		type:'POST',
		data:'DeviceID='+encodeURIComponent(DeviceID)+'&DeviceName='+encodeURIComponent(DeviceName),
		success: function(response) {
			setTimeout(function(){
				$('#DisplayName_'+rowID+"_loading").hide();
			},500);
		},
		error: function() {
			alert("ERROR!!! by UpdateSettings click()");
			$('#DisplayName_'+rowID+"_loading").hide();
		}
	});
	
}

function updateDetail(){
	$('#UpdateDetailLoading').show();
	$.ajax({
		url:'./common/lib/php/UpdateMyDetail.php',
		type:'POST',
		data:'id='+user_id+'&name='+encodeURIComponent($('#NickName').val())+'&map='+encodeURIComponent(1)+'&language='+encodeURIComponent($('#UseLanguage').val()),
		success: function(response) {
			setTimeout(function(){
				if(response=='1'){
					$('#NavNickname').html($('#NickName').val());
				}
				$('#UpdateDetailLoading').hide();
			},1000);
		},
		error: function() {
			alert("ERROR!!! by UpdateSettings click()");
			$('#UpdateDetailLoading').hide();
		}
	});
	
}