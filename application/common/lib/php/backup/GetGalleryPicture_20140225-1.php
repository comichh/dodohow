<?php
    $tripID=$_GET['tripID'];
	$imagePath="./sandbox/FileUpload/server/php/files/".$tripID."/thumbnail";
	$index=0;
	foreach(glob('../../../sandbox/FileUpload/server/php/files/'.$tripID.'/thumbnail/{*.jpg,*.gif,*.png}', GLOB_BRACE | GLOB_NOSORT) as $imagename){
		$strdata=$strdata."{";
		$strdata=$strdata."index:'".$index."',";
		$strdata=$strdata."ImageName:'".$imagePath."/".basename($imagename)."',";
		$strdata=$strdata."ImageTitle:'"."Title ".$index."',";
		$strdata=$strdata."ImageLatlng:'24.112233,121.3211321',";
		$strdata=$strdata."ImageDescription:'"."Description ".$index."'";
		$strdata=$strdata."},";
		$index+=1;
	}
	$strdata=substr($strdata,0,strlen($strdata)-1);
	$strdata="[".$strdata."]";
	echo $strdata;

?>
