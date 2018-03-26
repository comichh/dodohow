<?php
  $navigation=true;
  $no_check=true;
  $head_show='home';
  include ("config/head.php"); 
?>
<style>
#body_table{text-align:center;}
#home_page_table {width:1280px;}
#home_page_table td{width:25%;padding:10px 0px;text-align:left;}
#home_page_table img{height:150px;width:300px}
</style>
   <link rel="stylesheet" type="text/css" href="_css/css_home/layout_home.css"/>
   <link rel="stylesheet" type="text/css" href="_css/css_home/style_home.css" />
	 <script type="text/javascript" src="jquery/ui/jquery_ui/jquery-ui_1.10.4.js"></script>	 
   <!--
   <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>
   <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>   
   <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>
   -->
   <script type="text/javascript" src="js/js_home/modernizr.custom.79639.js"></script>
	 <script type="text/javascript" src="js/js_home/jquery.ba-cond.min.js"></script>
	 <script type="text/javascript" src="js/js_home/jquery.slitslider.js"></script>
<script type="text/javascript">	
			var continueRun=true;
			$(document).ready(function(){
        //$("#go_home").click(function(){
        //    $('html,body').scrollTop(0);
        //});

				var timer;
				var stopSecond=15*1000;	//設定為10秒後，當使用者沒有再點擊導航bar時，背景繼續播放。			
				var Page = (function() {

					var $nav = $( '#nav-dots > span' ),
						slitslider = $( '#slider' ).slitslider( {
							onBeforeChange : function( slide, pos ) {

								$nav.removeClass( 'nav-dot-current' );
								$nav.eq( pos ).addClass( 'nav-dot-current' );

							},
							autoplay:true,
							interval:5000
						} ),

						init = function() {
							
							initEvents();
							
						},
						initEvents = function() {

							$nav.each( function( i ) {
							
								$( this ).on( 'click', function( event ) {
									var $dot = $( this );
									if( !slitslider.isActive() ) {
										$nav.removeClass( 'nav-dot-current' );
										$dot.addClass( 'nav-dot-current' );
									}
									slitslider.jump( i + 1 );
									continueRun=false;
									return false;
								} );
								
								$( this ).on( 'mouseout', function( event ) {
									clearTimeout(timer); 
									timer =setTimeout(function(){
										slitslider.play();										
									},stopSecond);
									continueRun=true;
								});
								
							} );

						};
						return { init : init };
				})();
				Page.init();			
			});
		</script>    



<body>

   

<!--
	<ul id="nav">
    	<li><a id='go_home' title="Next Section"><img src="pic/homepages/gotop.jpg" /></a></li>
      
        <li><a href="#ANALYSIS" title="Next Section"><img src="pic/homepages/goanalysis.jpg"  /></a></li>
	      <li><a href="#ROUTE" title="Next Section"><img src="pic/homepages/goroute.jpg" /></a></li>
	      <li><a href="#SHARE" title="Next Section"><img src="pic/homepages/goshare.jpg" /></a></li>
    
  </ul>
  -->


    
    
    

<div id="slider" class="sl-slider-wrapper">

				<nav id="nav-dots" class="nav-dots">
					<span class="nav-dot-current"></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
				</nav><!-- /ALL -->
                
    <div class="sign">
              <a href="registrator.php">&nbsp Sign Up for Free &nbsp</a>	
    </div><!--sign-->

	 <div class="sl-slider">
					<div class="sl-slide" data-orientation="horizontal" data-slice1-rotation="-25" data-slice2-rotation="-25" data-slice1-scale="2" data-slice2-scale="2">
						<div class="sl-slide-inner">
							<div class="bg-img bg-img-1"></div>
							  <h2>What is SPORT 4U?</h2>
							  <blockquote>
                   <div>SPORT4U is a cloud service that can provide you a friendly environment for viewing training statistics,</div>
                   <div>analyzing training result, planning route for next training and share training result with your friends.</div> 
                
                </blockquote>                 
						</div>
	        </div>




					
					<div class="sl-slide" data-orientation="vertical" data-slice1-rotation="10" data-slice2-rotation="-15" data-slice1-scale="1.5" data-slice2-scale="1.5">
						<div class="sl-slide-inner">
							<div class="bg-img bg-img-2"></div>
							<h2>Training History and Statistics</h2>
							<blockquote>
                <div> By viewing training history, you can understand your past training record and use them as a reference for your future training plan.</div>
                <div>With statistics information, you will know your current training milestone and plan for the next target.</div> 
</blockquote>
						</div>
					</div>
					
					<div class="sl-slide" data-orientation="horizontal" data-slice1-rotation="3" data-slice2-rotation="3" data-slice1-scale="2" data-slice2-scale="1">
						<div class="sl-slide-inner">
							<div class="bg-img bg-img-3"></div>
							<h2>Professional Analysis</h2>
							<blockquote>
                <div> Professional analysis is very useful for you to have an idea about your current training status. </div>   
 <div> With SPORT4U’s professional analysis, 
    you can easily plan your next level of training and will have great improvement on your training performance. </div> 
</blockquote>
						</div>
					</div>



					<div class="sl-slide" data-orientation="vertical" data-slice1-rotation="-5" data-slice2-rotation="25" data-slice1-scale="2" data-slice2-scale="1">
						<div class="sl-slide-inner">
							<div class="bg-img bg-img-4"></div>
							<h2>Plan Your Route</h2>
							<blockquote>
                 <div> You can plan route on SPORT4U and transfer to your own device.</div> 
                 <div> With planned route in your device,
                you can follow the route to go to exercise in the place you have never been without getting lost. </div> 
          </blockquote>
						</div>
					</div>



					<div class="sl-slide" data-orientation="horizontal" data-slice1-rotation="-5" data-slice2-rotation="10" data-slice1-scale="2" data-slice2-scale="1">
						<div class="sl-slide-inner">
							<div class="bg-img bg-img-5"></div>
							<h2>Share with Your Friends</h2>
							<blockquote>  
                  <div>In SPORT4U, your can share your training with your friends and know your friends training as well.</div>
                  <div>By sharing, your friend will not only understand your training result but also know where you have been.</div>
              </blockquote>        
						</div>
					</div>
				</div><!-- /sl-slider -->
</div><!-- /slider-wrapper -->
<div id="SHADOW">
</div>

<div id="ANALYSIS">
	<div id="CONTENT_2_H">Professional Analysis</div>
</div> <!-- /ANALYSIS -->

<div id="SHADOW"></div>

<div id="ROUTE">
	<div id="CONTENT_2_H">Plan Your Route</div>
</div> <!-- /ROUTE -->

<div id="SHADOW">
</div>


<div id="SHARE">
	<div id="CONTENT_2_H">Share with Friends</div>
</div> <!-- /SHARE -->
 <br><br>   
 <!--    
          <div id="FOOTER">
                <ul>
                    <li><a href="http://www.globalsat.com.tw/contact.php" target="_blank" > Contact Us |</a> </li>
                    <li><a href="http://www.globalsat.com.tw/" target="_blank"><img src="pic/homepages/shome.png" width="40" height="40"></a></li>  
                    <li><a href="mailto:service@globalsat.com.tw"><img src="pic/homepages/email.png" width="40" height="40"></a></li>
                    <li><a href="http://www.globalsat.com.tw/products-page.php?menu=4&gs_en_product_id=7&gs_en_product_cnt_id=89" target="_blank"><img src="pic/homepages/tool.png" width="40" height="40"></a></li>                
                </ul>
                <div><?php  echo $foot ?></div> 
           </div> 
  -->
  <?php include ("foot_all.php");?>


    


        </body>
</html>


