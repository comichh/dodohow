var CommentID;
$(function() {
	
	$('#NavHeadbar li a').on('click', function() {
		$(this).parent().parent().find('.active').removeClass('active');
		$(this).parent().addClass('active').css('font-weight', 'bold');
	});
	
	$('#CloseMessage').click(function(){
		if($('#HaveRead').prop('checked')){
			setCommentReaded();
		}
	});

});

function showMessagebox(){
	$('#MessageBox').modal('show');
}

function getCommentDetail(id){
	
	url="./common/lib/php/GetComment.php?comment_id="+id;
	CommentID=id;
	var fullUrl=url;
	var str='';
	$.ajax({
		url:fullUrl,
		type:"GET",
		contentType:"application/json;charset=utf-8",
		success: function(Jdata) {
			var jsonTripArray=eval('('+Jdata+')');
			str+='<div class="well" style="margin: 0 auto 10px;width:90%">';
			str+='<table width="100%"><tr><td valign="top" width="60"><img src="./upload/upload/'+jsonTripArray[0].ImageName+'" width="60" /></td><td valign="top"><span class="label label-warning">'+jsonTripArray[0].CommentUserName+'</span><br><h5>'+jsonTripArray[0].Content+'</h5></td></tr></table>';
			str+='</div>';
			str+='<input type="checkbox" id="HaveRead">已閱讀';
			$('#MessageBoxLabel').html(jsonTripArray[0].TrainName);
			$('#Messagebody').html(str);
			$('#MessageBox').modal('show');
		},
		error: function() {
			alert("ERROR!!! by getDataByJSON()");
			$('#Startloading').hide();
		}
	});
}

function setCommentReaded(){
	
	$.ajax({
		url:'./common/lib/php/SetCommentReaded.php',
		type:'POST',
		data:'CommentID='+CommentID,
		success: function(Jdata) {
			alert(Jdata);
		},
		error: function() {
			alert("ERROR!!! by getDataByJSON()");
			$('#Startloading').hide();
		}
	});
}


