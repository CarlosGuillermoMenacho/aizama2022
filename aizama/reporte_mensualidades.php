<?php 
session_start();
require_once"session_verify.php";
if($_SESSION['app_user_type'] != "adm"){
	header("Location: ../perfil.php");
}
if($_SESSION['app_user_id']==16){
    require 'header_dir.php';
}else{
    require 'header_adm.php';
}
?>

<link rel="stylesheet" type="text/css" href="css/reporte_mensualidades.css?v=<?php echo rand(); ?>">
<div class="content-main">
	
<div class="div-btn-adjust">
    <button id="btn-adjust"><img src="svg/ajustes.svg" width="25px" title="Otros top de calificaciones..."></button>
</div>
<div class="title"><h1>Pago de Mensualidades <?php echo date("Y");?></h1></div>
<div id="tabla_lista" class="table-lista">
	<!--h3>Primero de primaria
		<div class="btn-close">
	        <img src="images/close.svg" onclick="close_form();">
	    </div>
	</h3>
    <table > 
        <thead>
            <tr>
                <td class="index">Nro.</td>
                <td class="border-left">Nombre</td>
                <td class="border-left">Kardex</td>
            </tr>
        </thead>
        <tbody id="body">
		    <tr>
		        <td class="border-top index">1</td>
		        <td class="border-td fecha">Carlos</td>
		        <td class="border-td">
		        	<div class="main-cuota">
		        		
			        	<div class="cuota">
				        	<div class="detalle">E/ (Feb/2023) a/c 1a. Cuota</div>
				        	<div class="monto">100.00</div>
			        	</div>
			        	<div class="cuota border-l">
				        	<div class="detalle">E/ (Feb/2023) a/c 1a. Cuota</div>
				        	<div class="monto">100.00</div>
			        	</div>
			        	<div class="cuota border-l">
				        	<div class="detalle">E/ (Feb/2023) a/c 1a. Cuota</div>
				        	<div class="monto">100.00</div>
			        	</div>
			        	<div class="cuota border-l">
				        	<div class="detalle">E/ (Feb/2023) a/c 1a. Cuota</div>
				        	<div class="monto">100.00</div>
			        	</div>
			        	<div class="cuota border-l">
				        	<div class="detalle">E/ (Feb/2023) a/c 1a. Cuota</div>
				        	<div class="monto">100.00</div>
			        	</div>
		        	</div>
		        </td>
			    
			</tr>   
			  
		</tbody>
    </table-->
</div>
  <div class="div-cursos-float">
  	<div class="div-curso-float">
  	</div>
  </div>
</div>
<script type="text/javascript" src="js/reporte_mensualidades.js?v=<?php echo rand();?>"></script>