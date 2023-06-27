<?php 
session_start();
require 'header.php';

?>
<link rel="stylesheet" type="text/css" href="css/top_calificaciones_doc.css?v=<?php echo rand();?>">
<div class="div-title">
    <h1>Top de Calificaciones</h1>
</div>
<div class="div-tabla oculto">
    <div class="div-select-nivel">
        <button class="selected" style="border-radius: 5px 0px 0px 5px;">PRIMARIA</button>
        <button style="border-radius: 0px 5px 5px 0px;">SECUNDARIA</button>
    </div>
    <div class="div-selector-materias">
        <ul>
            <li style="border-radius: 5px 0px 0px 5px;" class="selected-b">Matematicas</li>
            <li>Matematicas</li>
            <li>Matematicas</li>
            <li>Matematicas</li>
            <li>Matematicas</li>
            <li>Matematicas</li>
            <li>Matematicas</li>
            <li>Matematicas</li>
            <li style="border-radius: 0px 5px 5px 0px;">Matematicas</li>
        </ul>
    </div>

    <h2 id="title-tabla">Primero de Secundaria - A</h2>
    <table class="table">
        <thead id="head-tabla">
            <tr>
                <td>No.</td>
                <td>Nombre</td>
                <td>Nota</td>
            </tr>
        </thead>
        <tbody id="body">
            <!--tr>
                <td class="center w100">1</td>
                <td>Menacho Zárate Carlos Guillermo</td>
                <td class="center w100">10</td>
            </tr-->
        </tbody>
    </table>
</div>
<div class="div-notas-materias oculto" id="notas-materia">
    <!--h2>Nota por Materia</h2>
    <h3>Primero de primaria - A</h3>
    <h3>Carlos Guillermo Menacho</h3>
    <table class="table-notas-materias">
        <thead>
            <tr>
                <td>Materia</td>
                <td>Nota</td>
            </tr>
        </thead>
        <tbody id="body-nota-materia">
            <tr>
                <td width="100px">Ciencias Naturales</td>
                <td width="50px" class="center">80</td>
            </tr>
        </tbody>
    </table-->
</div>
<div class="div-btn-refresh oculto">
    <button id="btn-refresh" class="submit">Actualizar</button>
</div>
<!--div class="div-btn-adjust">
    <button id="btn-adjust"><img src="svg/ajustes.svg" width="25px" title="Otros top de calificaciones..."></button>
</div-->
<div class="div-cursos-float">
    <div class="div-curso-float">
        
    </div>
</div>
<script src="js/top_calificaciones_doc.js?v=<?php echo rand();?>"></script>
