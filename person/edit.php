<?php
$navigation=true;
$no_check=true;
include ("../config/head.php");
include ("../function/slope_difficulty.php");

$train_id=$_GET['train_id'];


$p1="<img src='../pic/person/weather_1_new.png'>";
$p2="<img src='../pic/person/weather_2_new.png'>";
$p3="<img src='../pic/person/weather_3_new.png'>";
$p4="<img src='../pic/person/weather_4_new.png'>";
$p5="<img src='../pic/person/weather_6_new.png'>";
$p6="<img src='../pic/person/weather_7_new.png'>";

$query="select * from tbl_train_data as a,tbl_device as b,tbl_device_model as c  ";
$query.=" where a.id='$train_id' and  a.deviceid=b.deviceid and b.model=c.id";
$result=mysql_query($query);
while ($row=mysql_fetch_array($result))
{     
  $model=trim($row['name']);
  $displayname=trim($row['displayname']);
  $train_name=trim($row['train_name']);
  $cSport6=$row['cSport6'];     //1 跑步。2腳踏車
  $public_access=$row['public_access'];  
  $weather=trim($row['weather']);   
  $train_description =trim($row['train_description']);
  $lTotalDistance=$row['lTotalDistance']/1000;  
  $wAscent=$row['wAscent']/1000; 
}
// 這邊才去計算 存 路段難度，已經原來有的就先不理會 ，這邊可能還有問題，自己的看不到
$slope=slope_difficulty_1 ($lTotalDistance,$wAscent);



// 為了產生縮圖，撈每一點座標出來的資料出來，不管要不要分享都產生吧
$map_pic_path="$work_path/upload/point_thumbnail/$train_id.jpg";

if (!is_file($map_pic_path))
{
  // 撈每一點座標
  $query="select * from tbl_train_data,tbl_device  where tbl_train_data.id='$train_id' and tbl_train_data.deviceid=tbl_device.deviceid";
  $result=mysql_query($query);
  while ($row_total=mysql_fetch_array($result))
  {
    $db_name=$row_total['db_name'];
  }
  $query="select * from $db_name  where train_data_key='$train_id'";
  $result=mysql_query($query);
  $i=0;
  while ($row=mysql_fetch_array($result))
  {
    $sql_array[$i]['latitude']=$row['latitude'];    // 經度
    $sql_array[$i]['longitude']=$row['longitude'];  // 緯度
    $i++;
  }   
}

$sql_json= json_encode($sql_array);

   $to_js="<script type='text/javascript'>";
   $to_js.="var beaches=$sql_json;";
   $to_js.="</script>";
   echo $to_js;             //傳遞參數給 js


$sport[1]=$lang['run'];
$sport[2]=$lang['bicycle'];
$sport_type="<select id='sport_type'>";
foreach ($sport as $key => $value ) 
{
  if ($key ==$cSport6)
  {
     $sport_type.="<option  value='$key' selected='selected'>$value</option>";
  }else {
     $sport_type.="<option value='$key'>$value</option>"; 
  }
}
$sport_type.="</select>";

 
$share_1[0]=$lang['share_1'];
$share_1[1]=$lang['share_2'];
foreach ($share_1 as $key => $value ) 
{
  if ($key == $public_access)
  {
     $share.="<INPUT type='radio' checked='yes' name='share[]' value='$key' />$value";
  }else {
      $share.="<INPUT type='radio'  name='share[]' value='$key' />$value";
  }
}

$weather='';
$weather_1[0]=$p1;
$weather_1[1]=$p2;
$weather_1[2]=$p3;
$weather_1[3]=$p4;
$weather_1[4]=$p5;
$weather_1[5]=$p6;
foreach ($weather_1 as $key => $value ) 
{
  if ($key == $weather)
  {
     $weather.="<INPUT type='radio' value='$key' checked='yes' name='weather[]'/>$value";
  }else {
     $weather.="<INPUT type='radio' value='$key'  name='weather[]'/>$value";
  }
}



?>
<script type="text/javascript" src="js/edit.js"></script>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=geometry"></script>
<script>
  var train_id="<?php echo $train_id;?>";
  var slope="<?php echo $slope;?>";
</script>
<style>
#page_table{width:1280px;height:800px; font-size:30px;margin:15px auto; text-align:left;background-color:#91AFD1;padding:25px 25px;border:solid black 1px;}
#save{float:right;}
#train_name{width:80%;height:30px}
#machine_type{width:100px;height:30px;color:#9fa0a0;}
#displayname{width:300px;height:30px;color:#9fa0a0;}
#desctiption{width:100%;height:280px}
#edit_1_div div{margin:0 0 20px 0}
#edit_1_div span{display:inline-block;}  
#edit_1_div span:first-child {width:150px; }
</style>



<div id='body_page'> <div id='body_table'><div id='body_content'>

<div id='edit_1_div'>
  <div>
    <span><?php echo $lang['train_name']?></span>
    <span><input type='text' id='train_name' style='width:405px' value='<?php echo $train_name ?>'> </span>
  </div>
  <div>
    <span><?php echo $lang['edit_2']?></span>
    <span><input type='text' id='machine_type' readonly='yes' value='<?php echo $model ?>' ></span>
    <span>  <input type='text' id='displayname'  readonly='yes' value='<?echo $displayname ?>'> </span>
  </div>
  <div>
    <span> <?php echo $lang['edit_3'];?> </span>
    <span> <?php echo $sport_type;?> </span>
  </div>
  <div>
    <span><?php echo $lang['share_0'];?> </span>
    <span><?php echo $share ?></span>
  </div>
  <div>
    <span><?php echo $lang['edit_4'];?> </span>
    <span><?php echo $weather; ?> </span>
  </div>
  <br>
<?php echo $lang['sport_info'];?>
<TextArea Name='Text' id='desctiption' Wrap='Virtual'><?php echo $train_description?></TextArea> 
<br>

<br>
<span class='button_css3'>
  <a id='upload_pic' href='upload_pic.php?train_id=<?php echo $train_id;?>'> <?php echo $lang['upload_pic'];?> </a>
</span>
<span class='button_css3' id='save'><?php echo $lang['save'];?> </span>  

</div></div></div>

 <?php include ("../foot.php");?>

