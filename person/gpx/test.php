<?php
// include('simple_html_dom.php');
//  能解析兩種   wpt , trk（這個裡面還會有 extension )
// 假如 有 trk ，這個為主，其他去補他的數據
// 有些 extension 在裡面，有些在外面

/*   GARMIN , 自己的就一堆不一樣了
RUNNING: 討厭的就是只有 extension 那部分
<trk>  
<trkseg>
<trkpt>
  <ele>
  <time>
  這邊有些有 <extensions>    Forerunner® 15
  <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:hr>112</gpxtpx:hr>
          </gpxtpx:TrackPointExtension>
        </extensions>

Cycling： extension  裡面還多了一些怪東西
  <extensions>
          <gpxtpx:TrackPointExtension>
            <gpxtpx:atemp>27.0</gpxtpx:atemp>        // 這個不知道是什麼 。溫度？
            <gpxtpx:hr>117</gpxtpx:hr>               // 這個應該是心跳
            <gpxtpx:cad>113</gpxtpx:cad>             // 踏頻
          </gpxtpx:TrackPointExtension>
        </extensions>
     

*/


if (file_exists('11111.gpx')) {
    $xml = simplexml_load_file('11111.gpx');
    foreach( $xml->children() AS $child ) {
        $name = $child->getName();

        if ($name == 'wpt') {
            print_r($name.'    ');
            echo $child['lat'].' '.$child['lon'].'<br> ';
            foreach( $child->children() AS $grandchild ) {            
              $grandname = $grandchild->getName();
          //  $name = $child->children()->getName();
             
              if ($grandname == 'ele') {
                echo $grandname.":". $grandchild .' ';
              }else if ($grandname == 'name') {
                echo $grandname.":".$grandchild .' ';
              }else  if ($grandname == 'cmt') {
                echo $grandname.":".$grandchild .' ';
              }
               echo "<br>";
              }


        }
        if ($name == 'trk') {      // 高度，經緯度，時間
            foreach( $child->children() AS $grandchild ) {
                $grandname = $grandchild->getName();
                if ($grandname == 'name') {
                    echo $grandchild.'<br/>';
                }
                if ($grandname == 'trkseg') {
                    foreach( $grandchild->children() AS $greatgrandchild ) {
                        $greatgrandname = $greatgrandchild->getName();
                        print_r($greatgrandname.'  ');
                        //echo '<br/>';
                        if ($greatgrandname == 'trkpt') {
                            echo $greatgrandchild['lat'].' '.$greatgrandchild['lon']."<br>";
                            foreach( $greatgrandchild->children() AS $elegreatgrandchild ) {
                                //echo $elegreatgrandchild.'<br/>';
                                $get_name= $elegreatgrandchild->getName();
                                if ( $get_name =='time')
                                {
                                  echo " time: ".$elegreatgrandchild ;
                                }else if ( $get_name =='ele'){
                                   echo " ele: ".$elegreatgrandchild ;                                
                                }else if ( $get_name =='speed'){
                                   echo " speed: ".$elegreatgrandchild ;
                                }
                                echo "<br>";
                            }
                        }
                        if ($greatgrandname == 'ele') {
                            print_r($greatgrandchild);
                        }   
                        echo "<br>";
                    }
                   
                }
            }
        } 
    }
} else {
    exit('Failed to open file');
}    
            







?>
