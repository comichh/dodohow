<?php
function generatorPassword()
{
srand((double)microtime()*1000000);
$no = md5(uniqid(rand()));
$ed = strlen($no)-8;
$rat = rand(0,$ed);
$password = strtoupper(substr("$no",$rat,8));
return $password;
}
?>

