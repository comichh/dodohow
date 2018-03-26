<?php 
// 語系完成 ，常數完成
$navigation=true;
$no_check=false;
include ("../config/head.php");


$user_id=$_SESSION['user_id'];
$query="select * from tbl_user where id='$user_id'";
$result=mysql_query($query);

while ($row=mysql_fetch_array($result))
{
  $weight=$row['weight'];
  $age=$row['age'];
  
  if ($age ==0){$age=$default_age;}
  $heart_age=220-$age;   

  //$heart_stand_value[1]=$heart_age*0.5;
  $heart_stand_value[2]=round($heart_age*0.6);
  $heart_stand_value[3]=$heart_stand_value[2];
  $heart_stand_value[4]=round($heart_age*0.7);
  $heart_stand_value[5]=$heart_stand_value[4];
  $heart_stand_value[6]=round($heart_age*0.8);
  $heart_stand_value[7]=$heart_stand_value[6];
  $heart_stand_value[8]=round($heart_age*0.9);
  $heart_stand_value[9]=$heart_stand_value[8];
  $heart_stand_value[10]=$heart_age*1;

  //$heart_save_value[1]=$row['heart_a_min'];
  //$heart_save_value['1']=0;
  $heart_save_value['2']=$row['heart_a_max'];
  //$heart_save_value[3]=$row['heart_b_min'];
  $heart_save_value['4']=$row['heart_b_max'];
  //$heart_save_value[5]=$row['heart_c_min'];
  $heart_save_value['6']=$row['heart_c_max'];
  //$heart_save_value[7]=$row['heart_d_min'];
  $heart_save_value['8']=$row['heart_d_max'];
  //$heart_save_value[9]=$row['heart_e_min'];
  $heart_save_value['10']=$row['heart_e_max'];
}


foreach ($heart_save_value as $key => $value ) 
{
  if ($value ==0)
  {
    $heart_save_value[$key]= $heart_stand_value[$key];
  } 
}
//print_r ( $heart_save_value);


?>
<style>
#inter_table{width:100%}
input {width:230px;height:30px;}
button{width:60px;height:35px;}
#p_weight_s,#p_age_s{color:green;}
</style>
<script type="text/javascript" src="js/config2.js"></script>
<script>
var UserImage='<?php echo $_SESSION[UserImage]?>';
var config2_error_fomat_number='<?php echo $lang['config2_error_fomat_number'] ?>';
var config_2_error_fomat_none_0='<?php echo $lang['config_2_error_fomat_none_0'] ?>';
</script>     



<div id='body_page'> <div id='body_table'>
<?php
  $click_if='config2'; 
  include ("head_config2.php"); 
?>
 <div id='body_content'>
<table id='inter_table' ><tr>
<?php echo "<th>".$lang['MyProfile_2_t_1']."</th>  <th>".$lang['MyProfile_2_t_2']."</th><th>".$lang['MyProfile_2_t_3']."</th><th>".$lang['MyProfile_2_t_4']."</th>";?> 
</tr><tr>
<td><?php echo $lang['MyProfile_2_t_5']?></td>
<td>0 </td>　
<td><input type='text'  value='<?php echo $heart_save_value['2'];?>' ></td>
<td><?php echo "0 - $heart_stand_value[2]"?></td>

</tr><tr>
<td colspan="4"><hr></td>
</tr>
<tr>
<td><?php echo $lang['MyProfile_2_t_6']?></td>
<td><?php echo $lang['MyProfile_2_t_10']?></td>　
<td><input type='text'  value='<?php echo $heart_save_value['4'];?>' ></td>
<td><?php echo "$heart_stand_value[3] - $heart_stand_value[4]"?></td>

</tr><tr>
<td colspan="4"><hr></td>
</tr>
<tr>
<td><?php echo $lang['MyProfile_2_t_7']?></td>
<td><?php echo $lang['MyProfile_2_t_11']?></td>
<td><input type='text'  value='<?php echo $heart_save_value['6'];?>' ></td>
<td><?php echo "$heart_stand_value[5] - $heart_stand_value[6]"?></td>

</tr><tr>
<td colspan="4"><hr></td>
</tr>
<tr>
<td><?php echo $lang['MyProfile_2_t_8']?></td>
<td><?php echo $lang['MyProfile_2_t_12']?></td>　
<td><input type='text'  value='<?php echo $heart_save_value[8];?>' ></td>
<td><?php echo "$heart_stand_value[7] - $heart_stand_value[8]"?></td>

</tr><tr>
<td colspan="4"><hr></td>
</tr>
<tr>
<td><?php echo $lang['MyProfile_2_t_9']?></td>
<td><?php echo $lang['MyProfile_2_t_13']?></td>　
<td><input type='text'  value='<?php echo $heart_save_value[10];?>' ></td>
<td><?php echo "$heart_stand_value[9] - $heart_stand_value[10]"?></td>

</tr><tr>
<td colspan="4"><hr></td>
</tr>
<tr></table>
<div style='text-align:center'>
 <div id='save' class='button_css3'><?php echo $lang['save'] ?> </div>
</div>

<?php echo $lang['MyProfile/2_ps'];?>
</div></div>   </div>

<?php include ("../foot.php");?>

