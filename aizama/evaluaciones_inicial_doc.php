<?php
session_start();
require "includes/functions.php";
if(!cliente_activo()){
    header("Location: docentes.php");
    exit();
}
require 'header.php';
?>
<link rel="stylesheet" type="text/css" href="css/evaluacion_inicial_doc.css?v=<?php echo rand();?>">
<div id="container" class="container">
    <div class="title" id="title-pag"><h1>Evaluaciones Inicial<br>Gestión <?php echo (date("Y"));?></h1></div>
    <div class="div-actividades">
    	<div class="div-actividad">
    		<div class="div-text">
    			Actividad
    		</div>
    		<div class="div-captura">
    			<img src="images/evaluacion1.png">
    		</div>
    	</div>
    </div>
</div>



<script type="text/javascript" src="js/evaluacion_inicial_actividades_doc.js?v=<?php echo rand();?>"></script>
