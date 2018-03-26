<?php 
   $navigation=true;
   $no_check=false;
   include ("../config/head.php");
   $show_status=2; 
   setcookie("show_status",$show_status,time()+72000);
?>
  <script src="jquery/js/jquery-ui-1.9.2.custom.js"></script>
  <script src="./js/jquery-migrate-1.2.1.min.js"></script>

	<script>
		var user_id='<?php echo $_SESSION['user_id'] ?>';
		var lang_id='<?php echo $_SESSION['Lang'] ?>';
    var map_config='<?php echo $_SESSION['map'] ?>';
		var UserImage='<?php echo $_SESSION['UserImage'] ?>';
		var nickname='<?php echo $_SESSION['displayname'] ?>';
	</script>

	<script>
		$(function(){
			$('#frameContainer').html('<iframe id="SocialContent" src="./sandbox/demo1/index_nb.php" style="vertical-align:top;" width="100%" height="684px" frameBorder="0" ></iframe>');
		});
	</script>


<body >
		<div id="frameContainer" class="container" style="width:100%;height:100%">	
				<iframe id="SocialContent" src="./sandbox/demo1/index_nb.php" style="vertical-align:top;" width="100%" height="684px" frameBorder="0" ></iframe>		
		</div>
	     <input type="hidden" id="test" value=<?php echo $_SESSION['user_id'] ?>>
</body>

<div style='margin:0 0 0px -18px'>
   <?php include ("../foot.php");?>
</div>

