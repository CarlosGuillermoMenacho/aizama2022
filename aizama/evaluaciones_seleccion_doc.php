<?php
session_start();
require "includes/functions.php";
if(!cliente_activo()){
    header("Location: docentes.php");
    exit();
}
require 'new_header_doc.php';
?>
<link rel="stylesheet" type="text/css" href="css/evaluaciones_seleccion_doc.css?v=<?php echo rand();?>">
<div id="container" class="container">
    <div class="title2" id="title-pag"><h1>Evaluaciones de Selección Múltiple<br><br>Gestión <?php echo (date("Y"));?></h1></div>
    <div class="div-materias" id="content-table">
        <div class="div-evaluaciones">      
        </div>
</div>
<div class="div-cursos-float">
    <div class="div-curso-float">     
    </div>
</div>
<div class="div-formulario-evaluacion tarjeta oculto" id="formulario-evaluacion">  
</div>  
<script type="text/javascript" src="js/evaluaciones_seleccion_doc.js?v=<?php echo rand();?>"></script>
