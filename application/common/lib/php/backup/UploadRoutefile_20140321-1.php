<?php 
//-------------- include profile variable ----------------------------
include_once "ThisProfiles.php";
//-----------------------------------------------------------------
$uploaddir=UploadRoutePath;

$uploadfile=$uploaddir."/".urldecode($_FILES['myfile']['name']);

if (move_uploaded_file($_FILES['myfile']['tmp_name'], $uploadfile)) {
	echo $uploadfile;
} else {
	echo "-1";
}
?> 

