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
<div class="title"><h1>Estadísticas</h1></div>
<div class="div-main-content-options">
    <div class="div-options-avanced">
        <div class="btn-est-alumnos">
            <button class="btn-options" onclick="esta_alumnos();">Estudiantes</button>
            <div id="sAlu" class="selecter selected"></div>
        </div>
        <div class="btn-est-alumnos">
            <button class="btn-options" onclick="esta_cursos();">Cursos</button>
            <div id="sCur" class="selecter"></div>
        </div>
    </div>
</div>
<div class="div-main-content">
    <div class="div-lista-alumnos">
        <div class="div-options">
            <div class="div-search">
                <input type="text" id="input-search" class="input-date" placeholder="Buscar...">
            </div>
            <div class="select-curso">
                <select id="seleccionar_curso"><option value="0">-- Seleccionar Curso --</option></select>
            </div>
        </div>
        <div class="div-content-lista">
            
        </div>
    </div>
    <div class="div-cuadro-estadisticas">
        <!--h2 class="t-estadisticas">Estadísticas Generales</h2>
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
                            <tr><td><div>100</div></td></tr>
                            <tr><td><div>90</div></td></tr>
                            <tr><td><div>80</div></td></tr>
                            <tr><td><div>70</div></td></tr>
                            <tr><td><div>60</div></td></tr>
                            <tr><td><div>50</div></td></tr>
                            <tr><td><div>40</div></td></tr>
                            <tr><td><div>30</div></td></tr>
                            <tr><td><div>20</div></td></tr>
                            <tr><td><div>10</div></td></tr>
                        </tbody>
                    </table>
                    <table class="table-grafic-bar">
                        <tbody>
                            <tr>
                                <td><div>Matematicas</div></td>
                                <td><div>Ciencias Sociales</div></td>
                                <td><div>Lenguaje</div></td>
                                <td><div>Ciencias Naturales</div></td>
                                <td><div>Ed. Física</div></td>
                                <td><div>Valores</div></td>
                                <td><div>Inglés</div></td>
                                <td><div>Computación</div></td>
                                <td><div>Artes Plásticas</div></td>
                                <td><div>Ortografía</div></td>
                            </tr>
                        </tbody>

                    </table>
                    <div class="title-grafico">1er Trimestre</div>
                </div>
            </div>
        </div-->
    </div>
</div>
<script type="text/javascript" src="js/select2.min.js"></script>
<script type="text/javascript" src="js/cuadro_estadistico_adm.js?v=<?php echo rand();?>"></script>
