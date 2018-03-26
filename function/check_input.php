<?php
//  mysql_real_escape_string

function check_input($value)
{
 $new_value=addslashes($value);  
 return $new_value;
}


function check_input_array($value)
{
 foreach($value as $key => $value_1) 
 {
   $new_value[$key]=addslashes($value_1);  
 }
 return $new_value;
}





?>


