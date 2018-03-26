var ServerRequest = {
    data:'123',
	getData : function(serverURL){
		$.ajax({
			url: serverURL,
			type:"GET",
			success: function(msg){
				this.data=msg;
			},
			error:function(xhr, ajaxOptions, thrownError){ 
			   alert(xhr.status); 
			   alert(thrownError); 
			}
		});
    },
	getDataByJSON:function(serverURL){
		$.ajax({
			url:serverURL,
			type:"GET",
			dataType: "json",
			success: function(Jdata) {
				alert(Jdata);
			},
			error: function() {
				alert("ERROR!!! by getDataByJSON()");
			}
		});
	}
};
