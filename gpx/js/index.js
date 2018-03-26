$(document).ready(function(){  
// 圖片上傳
$('#file_upload_gpx').uploadify({
            'swf'      : '../jquery/plugin/uploadify/uploadify.swf',
            'uploader' : 'ajax/gpx.php?a=1',
            'method'   : 'POST',
            'formData' : {'session_id':session_id,random:Math.random()},
            'onUploadSuccess' : function(file, data1, response) 
            {
               //alert ('上傳成功'); 
               //console.log (data1);
               // 這邊還有錯誤或是成功要修改      
               //if (data1 =='no'){ 
               //   alert ('上傳成功');                                                                    
               //}else {
                 alert (data1);                                    
                 //location.reload();                                              
               //}                                                
            }            
});

});