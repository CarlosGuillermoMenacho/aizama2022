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
<link rel="stylesheet" type="text/css" href="css/cuadro_estadistico_adm.css?v=<?php echo rand();?>">
<link rel="stylesheet" type="text/css" href="css/select2.min.css">
<div class="title"><h1>Cuadro Estadístico</h1></div>
<div class="div-main-content">
    <div class="div-lista-alumnos">
        <div class="div-search">
            <input type="text" id="input-search" class="input-date" placeholder="Buscar...">
        </div>
        <div class="div-content-lista">
            
        </div>
    </div>
    <div class="div-cuadro-estadisticas">
        <h2 class="t-estadisticas">Estadísticas Generales</h2>
        <div class="div-head-info">
            <div>
                <h3>Estudiante: Carlos Guillermo</h3>
                <h3>Curso: Primero de Secundaria A</h3>                
                <h3>Código: 2445</h3>
            </div>
            <img class="img-est" width="100px" src="svg/imagen.svg">
        </div>
        <div class="div-content-graficos">
            <div class="grafico-notas-materias">
                <h2>Calificaciones por materia</h2>
                <div class="grafic-background">
                    <table class="table-grafic">
                        <tbody>
                            <tr><td></td></tr>
                            <tr><td></td></tr>
                            <tr><td></td></tr>
                            <tr><td></td></tr>
                            <tr><td></td></tr>
                            <tr><td></td></tr>
                            <tr><td></td></tr>
                            <tr><td></td></tr>
                            <tr><td></td></tr>
                            <tr><td></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="js/select2.min.js"></script>
<script type="text/javascript" src="js/cuadro_estadistico_adm.js?v=<?php echo rand();?>"></script>
