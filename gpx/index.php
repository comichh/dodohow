<?php
$navigation=true;
$no_check=false;
include ("../config/head.php");

$user_id=$_SESSION['user_id'];


?>

<script type="text/javascript" src="js/index.js"></script>
<script type="text/javascript" src="../jquery/plugin/uploadify/jquery.uploadify.min.js?ver=<?php echo rand(0,9999);?>"></script>
<script>
var session_id='<?php echo session_id();?>';
</script>

<div id='body_page'><div id='body_table'><div id='body_content'>
  <h2> gpx  上傳 </h2>
  <input type="file" name="file_upload" id="file_upload_gpx"/>
  
</div></div></div>  