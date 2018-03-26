<?php 
$navigation=true;
$no_check=false;
include ("../config/head.php");
$user_id=$_SESSION['user_id'];

$query="select *,a.displayname as machine_name,a.id as a_id  from tbl_device as a,tbl_user as b,tbl_device_model as c "; 
$query.=" where b.id='$user_id' and b.id=a.creator and c.id=a.model";
$result=mysql_query($query); 
$machine_table="<table id='machine_table'><tr><th>$lang[machine_type]</th><th>$lang[imei]</th><th>$lang[machine_name]</th></tr>";
while ($row=mysql_fetch_array($result))
{
  $machine_table.="<tr><td>$row[name]</td>";
  $machine_table.="<td> $row[deviceid]</td>";
  $machine_table.="<td><input name='machine_value_$row[a_id]' type='text' value='$row[machine_name]' /> </td></tr>";  
  $machine_table.="<tr><td colspan='3'><hr> </td></tr>";      
}
$machine_table.="</table>";


?>
<style>

#machine_save_show{color:green;}
#machine_table{width:100%}
#machine_table td{width:33%}
</style>
<script type="text/javascript" src="js/config2.js"></script>


<?php
echo "<div id='body_page'> <div id='body_table'> ";
$click_if='machine';
include ("head_config2.php");
echo "<div id='body_content'>";
echo "$machine_table";
echo "<div style='text-align:center'><br>
          <div id='machine_save' class='button_css3'>$lang[save] </div>
      </div>";
echo "</div>";


echo "</div></div>";
include ("../foot.php");
?>


