<?php
session_start();
require 'header_family.php';
//require 'includes/config.php';
$_SESSION['app_bimestre'] = 0;
//$_SESSION['app_user_id'] = $_SESSION['auxiliar'];

?>
<link rel="stylesheet" type="text/css" href="css/informativo_familia.css?v=<?php echo rand();?>">
<div class="div-fecha">	
	<h2>Lunes 31 de Julio</h2>
</div>

<div class="calendar-icon">
 	<img src="img/calendario.png" onclick="calendar_show();">
</div>
<div id="dias-festivos" class="main-container">
</div>
<div id="container">
	
</div>
<div class="div-calendario show-calendar oculto">
    <div class="btn-close">
        <img src="images/close.svg" onclick="close_form();">
    </div>
    <table class="table-calendario">
    	<thead>
        	<tr>
	          	<td colspan="7">
	            	<div class="button-meses">
	              		<div id="mes-ant" class="mes-button" onclick="mes_anterior();">Junio</div>
	              		<div id="mes-act" colspan="5" style="padding:10px 20px; font-size:1.4em;">Julio</div>
	              		<div id="mes-sig" class="mes-button" onclick="mes_siguiente();">Agosto</div>
	            	</div>
	          	</td>
        	</tr>
	        <tr>
	          	<td class="border-top">LU</td>
	          	<td class="border-td">MA</td>
	          	<td class="border-td">MI</td>
	          	<td class="border-td">JU</td>
	          	<td class="border-td">VI</td>
	          	<td class="border-td">SA</td>
	          	<td class="border-td">DO</td>
	        </tr>
      	</thead>
      	<tbody id="body-calendario">
      	</tbody>
    </table>
</div>
<script type="text/javascript" src="js/informativo_familia.js?v=<?php echo rand();?>"> </script>
<?php
require 'footer.php';
?>