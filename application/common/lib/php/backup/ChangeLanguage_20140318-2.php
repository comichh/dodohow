<?php
	try {
		session_start();
		$_SESSION['Lang']=trim($_POST['LangID']);;
		echo "1";
	} catch (Exception $e) {
		echo 'Exception: ',  $e->getMessage()." -from ChangeLanguage.php", "\n";
	}
?>
