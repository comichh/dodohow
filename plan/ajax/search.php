<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/parameter.ini");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");
include ("../../function/slope_difficulty.php");

$origin=$_POST['origin'];
$search_1=$_POST['search_1'];
$search_2=$_POST['search_2'];

$select_sort=$_POST['select_sort'];
$select_page=$_POST['select_page'];
$start=($select_page-1)*$page_number;

$user_id=$_SESSION['user_id'];


$query_base=" tbl_user as b WHERE user_planning='$user_id' and origin_user=b.id";
if ($search_1!='')
{
  $query_base.=" and (web_planning_name like '%$search_1%' or train_description like '%$search_1%')";  
}
$query="(SELECT * FROM tbl_planning ,$query_base group by id_planning)";
$query.="UNION ALL ";
$query.="(SELECT * FROM tbl_planning_private_create ,$query_base group by id_planning)";



switch ($select_sort)
{
  case $lang['create_date']:
    $query.=" ORDER BY create_time desc";
  break;
  case $lang['total_distance']:
    $query.=" ORDER BY lTotalDistance desc";
  break;
  case $lang['SectionsDifficulty']:
    $query.=" ORDER BY slope desc";
  break;
  case  $lang['climb']:
    $query.=" ORDER BY wAscent desc";
  break;
}


if ($origin ==2 ){
  $query.=" LIMIT $start,$page_number";
}else{
  $query.=" LIMIT 0,$page_number";
}

//echo $query;

$result=mysql_query($query);
while ($row=mysql_fetch_array($result))
{
if ($row[sport_type] ==2)
{
  $sport_type_pic="<img style='width:25px' src='../pic/train_detail/type_biking.png'/>";
}else{
  $sport_type_pic="<img style='width:25px' src='../pic/train_detail/type_running.png'/>";
}
$slope=slope_difficulty_2($row['slope'],1,$http_path);


  $right_1_content.="<table id='right_table'><tr><td >
               <table><tr>
                <td id='show_right_pic_td'>
                   <div><input type='checkbox' name='$row[tain_planning]' value='$row[id_planning]'>$sport_type_pic </div>
                   <div><img id='man_pic'  src='../upload/user/$row[image]'/></div> 
                   <div id='show_map' class='button_css3' name='$row[tain_planning]' value='$row[id_planning]' map_source='$row[map_source]'> $lang[show_map]</div>
                   <div id='edit' class='button_css3' name='$row[tain_planning]' value='$row[id_planning]' map_source='$row[map_source]'>  $lang[edit] </div>          
                 </td>
                <td>
                    $row[displayname]<br>
                    $row[web_planning_name]<br>
                    $lang[total_distance](m)：$row[lTotalDistance]<br>
                    $lang[climb](m)：$row[wAscent]<br>
                    $lang[SectionsDifficulty]：$slope
                </td>
               </tr></table>  
           
                
                </td>";
  
}
$right_1_content.="</tr></table>";

echo $right_1_content;


?>