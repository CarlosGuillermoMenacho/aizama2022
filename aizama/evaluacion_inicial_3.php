<?php
session_start();
if($_SESSION['app_user_perfil'] == 'SECUNDARIA') {
    require 'new_header.php';
} 
if($_SESSION['app_user_perfil'] == 'PRIMARIA' || $_SESSION['app_user_perfil'] == 'INICIAL' ) {
  require 'new_header.php';
} 
?>
<link rel="stylesheet" type="text/css" href="css/evaluacion_inicial_3.css?v=<?php echo rand();?>">
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
	<div class="div-lapiz">
		<img src="images/pincelazul.png" title="Lápiz azul" onclick="lapiz(4);"> 
		<img src="images/pincelverde.png" title="Lápiz verde" onclick="lapiz(3);">
		<img src="images/pincelrojo.png" title="Lápiz rojo" onclick="lapiz(1);">
		<img src="images/pincelamarillo.png" title="Lápiz amarillo" onclick="lapiz(2);">
		<img src="images/pincelblanco.png" title="Borrador" onclick="lapiz(0);">
	</div>
	<div class="div-content-faces">
		<img src="images/agricola.png" id="cursorImage" ondragstart="return false;">
		<img src="images/astronauta.png" id="cursorImage1" ondragstart="return false;">
		<img src="images/cientifico.png" id="cursorImage2" ondragstart="return false;">		
		<img src="images/cheff.png" id="cursorImage3" ondragstart="return false;">
		<img src="images/obrero.png" id="cursorImage4" ondragstart="return false;">
	</div>
	<div class="div-canvas borrador" id="div-canvas">
		<canvas id="canvas"></canvas>
	</div>
	<div class="div-content-faces">
		<img src="images/doctor.png" id="cursorImage5" ondragstart="return false;">
		<img src="images/ingeniero.png" id="cursorImage6" ondragstart="return false;">
		<img src="images/profesor.png" id="cursorImage7" ondragstart="return false;">	
		<img src="images/cantante.png" id="cursorImage8" ondragstart="return false;">
		<img src="images/policia.png" id="cursorImage9" ondragstart="return false;">	
	</div>
</div>
	<div class="btn-save">
		<img id="btn-save" src="images/ready.png">
	</div>
<div id="out-img"></div>
<script type="text/javascript" src="js/html2Canvas.min.js"></script>
<script type="text/javascript" src="js/evaluacion_inicial_3.js?v=<?php echo rand();?>"></script>