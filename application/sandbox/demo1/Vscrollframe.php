<?php
  include ("/home/wwwroot/dodohow/config/web.ini");  
  include ("$work_path/config/mysql.php");

  $train_id=$_GET['id'];
  $user_id=$_GET['train_userid'];
 
  $query="select * from tbl_pic where pic_train_key='$train_id'";
  $result = mysql_query($query);
  $need_pic="";
  $need_pic_repeat=''; 
  $i=0; 
  if (mysql_num_rows($result) > 0)
  {
    while ($row=mysql_fetch_array($result))
    {
      $i++;
      $need_pic.="<img style='height:200px;width:200px' src='$work_web/upload/trip_photo/$user_id/$train_id/thumbnail/$row[pic_name]'>";      
    }
 
    switch($i)
    {
    case "1":
     $need_pic_repeat=$need_pic.$need_pic.$need_pic.$need_pic.$need_pic.$need_pic.$need_pic.$need_pic;
    break;
    case "2":
     $need_pic_repeat=$need_pic.$need_pic.$need_pic.$need_pic;
    break;
    case "3":
     $need_pic_repeat=$need_pic.$need_pic.$need_pic;
    break;
    case "4":
     $need_pic_repeat=$need_pic.$need_pic;
    break;
    case "5":
     $need_pic_repeat=$need_pic.$need_pic;
    break;
    case "6":
     $need_pic_repeat=$need_pic.$need_pic;
    break;
    case "7":
     $need_pic_repeat=$need_pic.$need_pic;
    break;
    default:
     $need_pic_repeat=$need_pic ;
    }
  }else{
    $need_pic_repeat="<img style='height:200px;width:200px' src='$work_web/pic/train_detail/sample.jpg'>";      
  }
  
?>
<html>
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8">
		<style>
    .slideshow_pic  {width:100% ;height:100%; }
		.slideshow_pic img {width: 70%; padding:5px ; margin-left:10px;  margin-right:10px;}
#wrap { display:table; }
#cell { display:table-cell; vertical-align:middle; }
  	</style>
   <!--
    <script type="text/javascript" src="cycle/jquery-1.10.2.min.js"></script>
   -->
	<script type="text/javascript" src="js/jquery-1.8.3.js"></script>

  	<script type="text/javascript" src="js/jquery-migrate-1.2.1.min.js"></script>  
    <script type="text/javascript" src="cycle/jquery.cycle2.all.js"></script>
    <script type="text/javascript" src="cycle/jquery.cycle2.Carousel.js"></script>

    <script>　
    $(document).ready(function (){
		  $('.slideshow_pic').cycle();
    });
	</script>
</head>
	<body >
  


		<div id="photo" style="width:350px;margin-top:-10px ">
                <div class="slideshow_pic" 
                data-cycle-fx=carousel
                data-cycle-timeout=3000
                data-cycle-carousel-visible=8
                data-cycle-carousel-slide-dimension=240     
                data-cycle-next="#next3"
                data-cycle-prev="#prev3"
                data-cycle-pager="#pager3"
                data-cycle-carousel-vertical=true
                data-cycle-pause-on-hover=true
                data-cycle-log=false
              >
<?php
  echo $need_pic_repeat;
?>
            </div>
  



</div>
	</body>
</html>
