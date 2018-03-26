var submenu;
$(function(){
    $('.dropdown').mouseenter(function(){     
        $('.sublinks').stop(false, true).hide();    
         submenu = $(this).parent().next();
        submenu.css({
            position:'absolute',
            top: $(this).offset().top + $(this).height() + 'px',
            left: $(this).offset().left + 'px',
            zIndex:1000
        });        
        submenu.stop().slideDown(100);   
        submenu.mouseleave(function(){                 
            submenu.slideUp(100);
        });       
        $('.menu').mouseleave(function(){ 
          submenu.slideUp(100);
        });

    });
$('.dropdown').click(function(){
   submenu.slideUp(100);
});   
$("#show_table").click(function(){   
   $("#comment_list").css({
            position:'absolute',   
            top: $(this).offset().top +$(this).height() +22  + 'px',
            left: $(this).offset().left-80 + 'px',        
            zIndex:5000
   }).toggle();  
   $("#navigation_tri").toggle();
   $("#new_comment").hide();         
});

/* 訊息主旨*/
$("#comment_list_show").click(function(){
   $("#new_comment").css({
            position:'absolute',
            top: $(this).offset().top -10 + 'px',
            left: $(this).offset().left-245 + 'px',        
            zIndex:2000
   }).toggle();     
});
});