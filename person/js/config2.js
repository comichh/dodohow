$(document).ready(function(){  


$("#save").click(function(){
  var tb_value=[];
  var check='ok';
   $("input:text").each(function(e){
     tb_value[e]=$(this).val();  
     if(isNaN(tb_value[e])){
       check=config2_error_fomat_number;
     }
     if (tb_value[e] == 0){
       check=config_2_error_fomat_none_0;
     }                
   });
   if ( check == 'ok'){
     $.post('ajax/config2_save.php', {tb_value:tb_value}, function(data){  
       alert (data);
     });
   }else {
     alert (check) ;
   }
   
     
}); 


$("#machine_save").click(function(){  
  var ff_value=[];
  var ff_name=[];
  $("input[name^='machine_value']").each(function(e){
   ff_value[e]=$(this).val(); 
   ff_name[e]=$(this).attr('name');;   
  }); 
  $.post('ajax/machine_save.php', {ff_value:ff_value,ff_name:ff_name}, function(data){ 
     alert (data) 
      // $("#machine_save_show").html(data);
  });   
});
 



}); 