$(document).ready(function(){
$('.slideshow_pic').cycle();



$('#start').click(function() {
  $('.slideshow_pic').cycle('resume');
  $('#start').hide();
  $('#pause').show(); 
  return false;
});

$('#pause').click(function() {
  $('.slideshow_pic').cycle('pause');
  $('#start').show();
  $('#pause').hide(); 
  return false;
});


// 確實有第一張圖愈來愈短的問題     ，真的不行的時候，就是換掉這個套件
$('.slideshow_pic').on('cycle-prev', function(e, opts) {
       var index = opts.currSlide+1;
       show_pic=$('#cycle-2 img').eq(index).prop('src');  
       pic_alt=$('#cycle-2 img').eq(index).prop('alt');             
       $("#show").html("<img src='"+show_pic+"'>");
       $(".pic_info_1").html(pic_alt);
       return false;  
});
$('.slideshow_pic').on('cycle-next', function(e, opts) {
       var index = opts.currSlide+1;
       show_pic=$('#cycle-2 img').eq(index).prop('src');
       pic_alt=$('#cycle-2 img').eq(index).prop('alt');        
       $("#show").html("<img src='"+show_pic+"'>");
       $(".pic_info_1").html(pic_alt);
       return false;   
});

$('.cycle-slide').click(function() {             
        show_pic=$(this).prop('src');
        pic_alt=$(this).prop('alt');
        $("#show").html("<img src='"+show_pic+"'>");
        $(".pic_info_1").html(pic_alt);
        return false;    
   });



});
