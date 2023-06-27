<?php
session_start();
require 'header_family.php';
//require 'includes/config.php';
$_SESSION['app_bimestre'] = 0;
//$_SESSION['app_user_id'] = $_SESSION['auxiliar'];

?>
<link rel="stylesheet" type="text/css" href="css/kardex_familia.css?v=<?php echo rand();?>">
<div class="title" id="title-pag">
	<h1>KARDEX</h1>
</div>
<div class="div-lista-hijos">
	
</div>
<script type="text/javascript" src="js/kardex_familia.js?v=<?php echo rand();?>"></script>
<?php
require 'footer.php';
?>