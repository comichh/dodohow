$(document).ready(function(){  
// 圖片上傳
setTimeout( function (){
$('#file_upload_1').uploadify({
            'swf'      : '../jquery/plugin/uploadify/uploadify.swf',
            'uploader' : 'ajax/person_uploadify.php?a=1',
            'method'   : 'POST',
            //'auto' : false,
            'formData' : {'session_id':session_id },
            'onUploadSuccess' : function(file, data1, response) {                          
               //if (data1.indexOf("檔案") > -1){     
               if (data1.length !=0){                                                 
                   alert(data1);                      
               }else {                                       
                   location.reload();
                  //$("#show_pic").attr({"src":"../upload/user/"+UserImage+"?a="+Math.random()});  
                  //$("#show_pic").attr({"src":"../upload/user/"+data1+"?a="+Math.random()});                                
               }                                                
            } 
            // Your options here
});
 },10);





/*
$("#s_weight").click(function(){
   tb_value=$("#p_weight").val();
   $.post('ajax/config1_save.php', {tb_value:tb_value,tb_name:'weight'}, function(data){  
      if (data =='ok'){ $("#p_weight_s").html('save');}
   });   
}); 

$("#s_age").click(function(){   
   tb_value=$("#p_age").val();
   $.post('ajax/config1_save.php', {tb_value:tb_value,tb_name:'age'}, function(data){  
      if (data =='ok'){$("#p_age_s").html('save');}
   });   
});

$("#language_show").change(function(){
   var lang=$('select[id="language_show"]').val();
   $.post('ajax/lang.php', {lang:lang}, function(data){  
      if (data =='ok'){ location.reload(); }
   })
}); 
*/

$("#save_config_1").click(function(){   
   var tb_value_weight=$("#p_weight").val();
   var tb_value_age=$("#p_age").val();
   var lang=$('select[id="language_show"]').val();
   var map=$('select[id="map_show"]').val();
   $.post('ajax/config1_save.php', {tb_value_weight:tb_value_weight,tb_value_age:tb_value_age,lang:lang,map:map}, function(data){  
      //if (data =='ok'){$("#p_age_s").html('save');}
      if (data =='ok'){ location.reload(); }
   });   
});



}); 