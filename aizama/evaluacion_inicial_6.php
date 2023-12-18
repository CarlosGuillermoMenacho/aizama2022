<?php
session_start();
if($_SESSION['app_user_perfil'] == 'SECUNDARIA') {
    require 'new_header.php';
} 
if($_SESSION['app_user_perfil'] == 'PRIMARIA' || $_SESSION['app_user_perfil'] == 'INICIAL' ) {
  require 'new_header.php';
} 
?>
<link rel="stylesheet" type="text/css" href="css/evaluacion_inicial_6.css?v=<?php echo rand();?>">
<div class="div-title"><h1>Evaluaciones Inicial</h1></div>
<div class="div-list-materia oculto">
	<div class="div-materia">
		<img src="images/comunidadysociedad.png">
		<div class="div-nombre-materia">COMUNIDAD Y SOCIEDAD</div>
	</div>
	<div class="div-materia">
		<img src="images/cienciatecnologia.png">
		<div class="div-nombre-materia">CIENCIA, TECNOLOGÍA Y PRODUCCIÓN</div>
	</div>
	<div class="div-materia">
		<img src="images/vidatierra.png">
		<div class="div-nombre-materia">VIDA, TIERRA Y TERRITORIO</div>
	</div>
	<div class="div-materia">
		<img src="images/cosmopensamiento.png">
		<div class="div-nombre-materia">COSMOS Y PENSAMIENTO</div>
	</div>
</div>
<div id="evaluaciones" class="div-content-eval">
	<div class="div-content-faces">
		<img src="images/oler.png">
		<img src="images/comer.png">
		<img src="images/tocar.png">	
		<img src="images/escuchar.png">
		<img src="images/telescopio.png">	
	</div>
	<!--div class="div-content-face">
		<img src="images/carita.png" >
	</div-->
	<div class="div-content-faces2">
		<img src="images/oreja.png" id="cursorImage" ondragstart="return false;">
		<img src="images/mano.png" id="cursorImage1" ondragstart="return false;">
		<img src="images/ojo.png" id="cursorImage2" ondragstart="return false;">
		<img src="images/nariz.png" id="cursorImage3" ondragstart="return false;">
		<img src="images/boca.png" id="cursorImage4" ondragstart="return false;">		
	</div>
</div>
	<div class="btn-save">
		<img id="btn-save" src="images/ready.png">
	</div>
<div id="out-img"></div>
<script type="text/javascript" src="js/html2Canvas.min.js"></script>
<script type="text/javascript" src="js/evaluacion_inicial.js?v=<?php echo rand();?>"></script>