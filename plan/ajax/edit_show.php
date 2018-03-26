<?php
include ("../../config/web.ini");
include ("../../auth.php");
include ("../../config/mysql.php");
include ("../../config/lang_select.php");

$id=$_POST['id'];
$train_id=$_POST['train_id'];
?>
<style>
#new_1_div div{margin:0 0 20px 0}
#new_1_div span{display:inline-block;}  
#new_1_div span:first-child {width:100px; }
</style>


<?php
if ( $train_id !=0)
{
  $dbname="tbl_planning";                                   // 這邊存 訓練id   
}else {
  $dbname="tbl_planning_private_create";                // 這邊存的是對應的 key      
}
$query="select * from $dbname where id_planning='$id'";
$result=mysql_query($query); 



$sport_1='';
$sport_2='';
while ($row=mysql_fetch_array($result))
{
 if ($row['sport_type']==1){
    $sport_1="checked='yes'";
 }else{$sport_2="checked='yes'";}
    $right_2_content.="
    <div id='new_1_div' class='body_Split'>
      <div>
         <span>$lang[train_name]</span> 
         <span><input type='text' id='e_title' value='$row[web_planning_name]'></span>
      </div>
      <div>
         <span>$lang[sport_info]</span> 
         <span><input type='text' id='e_desciption' value='$row[train_description]'></span>
      </div>  
      <div>
         <span>$lang[machine_title]</span> 
         <span><input type='text' id='machine_title' value='$row[pctool_planning_name]'></span>  
         <div>($lang[machine_title_info])</div>   
      </div>     
      <div>
         <span>$lang[sport_type]</span> 
         <span>
            <input type='radio' name='sport_type[]' value='1' $sport_1 >$lang[run]
            <input type='radio' name='sport_type[]' value='2' $sport_2 >$lang[bicycle] 
         </span>
      </div>  
      <div>
         <span>$lang[total_distance](m)</span> 
         <span><input type='text' id='total_dis' value='$row[lTotalDistance]'></span>
      </div> 
      <div>
         <span>$lang[climb](m)</span> 
         <span><input type='text' id='e_wAscent' value='$row[wAscent]'></span>
      </div>
      <div style='text-align:center;'>
        <span class='button_css3' id='edit_save'>$lang[save]</span>
        <span class='button_css3' id='edit_cacel'>$lang[cacel]</span>
      </div>
      
";
}
echo $right_2_content;


?>