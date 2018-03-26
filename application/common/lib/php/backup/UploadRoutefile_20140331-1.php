<?php 
//-------------- include profile variable ----------------------------
include_once "ThisProfiles.php";
//-----------------------------------------------------------------
$uploaddir=UploadRoutePath;
$fileName=urldecode($_FILES['myfile']['name']);
$uploadfile=$uploaddir."/".$fileName;

if (move_uploaded_file($_FILES['myfile']['tmp_name'], $uploadfile)) {
	echo UploadRoutePathURL."/".$fileName;
} else {
	echo "-1";
}
?> 

