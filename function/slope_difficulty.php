<?php
/*
騎乘公里*爬升公里*3 (四捨五入)
10*0.033*3=9.9  四捨五入  =10
半顆星   <16
一顆星   17-52
一星半  52-108 
二顆星  109-176
二星半  176-266
三顆星   267-360
三星半   361-495
四顆星   496-616
四星半   616-770
五顆星   >771
*/

function slope_difficulty ($lTotalDistance,$wAscent,$http_path,$pic=0)
{
$slope=round($lTotalDistance*$wAscent*3,0);
if ($pic==1){
  $all_star="all_star_1.png"; 
  $helf_star="helf_star_1.png";   
}else{
  $all_star="all_star.png";
  $helf_star="helf_star.png";
}

switch (true) {       // 路段難度
   case ($slope <=16  ):
     $slope_pic="<img  src='http://$http_path/pic/train_detail/$helf_star'/>";
   break;
   case ($slope>16 and $slope <=52):
      $slope_pic="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
    break;
   case ($slope>52 and $slope <=108):
      $slope_pic="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$helf_star'/>";
   break;
   case ($slope>108 and $slope <=176):
      $slope_pic="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
   break;
   case ($slope>176 and $slope <=266):
      $slope_pic="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$helf_star'/>";
   break;
   case ($slope>266 and $slope <=360):
      $slope_pic="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
   break;
   case ($slope>360 and $slope <=495):
      $slope_pic="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$helf_star'/>";
   break;
   case ($slope>495 and $slope <=616):
      $slope_pic="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
   break;
  case ($slope>616 and $slope <=770):
      $slope_pic="<img   src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img   src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$helf_star'/>";
   break;
   case ($slope>770 ):
      $slope_pic="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'/>";
   break;
   default:
     $slope_pic="沒有數據"; 
   break;
}
return $slope_pic;
}


function slope_difficulty_1 ($lTotalDistance,$wAscent)
{
$slope=round($lTotalDistance*$wAscent*3,0);
switch (true) {       // 路段難度
   case ($slope <=16):
     $slope_number=0.5;
   break;
   case ($slope>16 and $slope <=52):
     $slope_number=1;
    break;
   case ($slope>52 and $slope <=108):
     $slope_number=1.5;
   break;
   case ($slope>108 and $slope <=176):
     $slope_number=2;
   break;
   case ($slope>176 and $slope <=266):
     $slope_number=2.5;
   break;
   case ($slope>266 and $slope <=360):
     $slope_number=3;
   break;
   case ($slope>360 and $slope <=495):
     $slope_number=3.5;
   break;
   case ($slope>495 and $slope <=616):
     $slope_number=4;
   break;
  case ($slope>616 and $slope <=770):
     $slope_number=4.5;
   break;
   case ($slope>770 ):
     $slope_number=5;
   break;
   default:
     $slope_number=0;
   break;
}
return $slope_number;
}


function slope_difficulty_2 ($slope,$pic,$http_path)
{
// $slope=round($lTotalDistance*$wAscent*3,0);
if ($pic==1){
  $all_star="all_star_1.png"; 
  $helf_star="helf_star_1.png";   
}else{
  $all_star="all_star.png";
  $helf_star="helf_star.png";
}

switch (true) {       // 路段難度
   case ($slope ==0.5  ):
     $slope_pic="<img  src='http://$http_path/pic/train_detail/$helf_star'></img>";
   break;
   case ($slope ==1 ):
      $slope_pic="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
    break;
   case ($slope ==1.5):
      $slope_pic="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$helf_star'></img>";
   break;
   case ($slope ==2):
      $slope_pic="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
   break;
   case ($slope ==2.5):
      $slope_pic="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$helf_star'></img>";
   break;
   case ($slope ==3):
      $slope_pic="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
   break;
   case ($slope ==3.5):
      $slope_pic="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$helf_star'></img>";
   break;
   case ($slope ==4 ):
      $slope_pic="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
   break;
  case ($slope ==4.5 ):
      $slope_pic="<img   src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img   src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$helf_star'></img>";
   break;
   case ($slope ==5 ):
      $slope_pic="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
      $slope_pic.="<img  src='http://$http_path/pic/train_detail/$all_star'></img>";
   break;
   default:
     $slope_pic="NA"; 
   break;
}
return $slope_pic;
}

?>
