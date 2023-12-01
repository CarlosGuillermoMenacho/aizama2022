<?php
session_start();
require "includes/functions.php";
if(!cliente_activo()){
    header("Location: docentes.php");
    exit();
}
require 'header.php';
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
<div class="div-respuestas oculto">
    <div class="div-resp">
        <div class="btn-close2">
            <img src="images/close.svg" onclick="close_respuestas();">
        </div>
        <div class="main-info">
            <div class="div-info">
                <strong>Curso:</strong>&nbsp; PRIMERO DE SECUNDARIA - A  
            </div>
            <div class="div-info">
                <strong>Meteria:</strong>&nbsp; Biología
            </div>
            <div class="div-info">
                <strong>Alumno:</strong>&nbsp; Carlos GUillermo Menacho Zárate 
            </div>
            <div class="div-info">
                <strong>Fecha:</strong>&nbsp; Lunes 2 de marzo
            </div>
            <div class="div-info">
                <strong>Nota:</strong>&nbsp; 100
            </div>
        </div>
        <div class="div-content-respuestas">
            <div class="div-pregunta" style="margin-top:10px;border: 1px solid #ccc;border-radius: 5px;padding: 10px;">
                <h3>Pregunta 1</h3>
                <div class="div-pregunta-img">
                    <div class="divtext input-data" style="width: 100%"></div>
                </div>
                <div class="div-img-preg">
                    <img src="svg/imagen.svg" width="47px" style="cursor: pointer;" title="Selecciona una imagen para la pregunta...">          
                </div>
                <h3>Opciones</h3>
                <div>
                    <div class="div-opcion">
                        <div class="divtext input-data" style="width: 100%;"> Valor</div>
                    </div>
                    <div class="div-opcion">
                        <div class="divtext input-data" style="width: 100%;"></div>
                    </div>
                </div>
                <div class="div-tempo" style="font-size: .9em;padding: 10px;display: flex;justify-content: space-between;align-items: center;">
                        Hora: inicio 17:00:00 - fin 17:03:00
                </div>
            </div>
        </div>
    </div>
</div> 
<script type="text/javascript" src="js/evaluaciones_seleccion_doc.js?v=<?php echo rand();?>"></script>
