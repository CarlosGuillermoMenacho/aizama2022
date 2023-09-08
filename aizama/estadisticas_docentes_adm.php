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
<link rel="stylesheet" type="text/css" href="css/estadisticas_docentes_adm.css?v=<?php echo rand();?>">
<link rel="stylesheet" type="text/css" href="css/select2.min.css">
<div class="title"><h1>Estadísticas</h1></div>
<div class="div-main-content-options oculto">
    <div class="div-options-avanced">
        <div class="btn-est-alumnos">
            <button class="btn-options" onclick="esta_alumnos();">Prácticos</button>
            <div id="sAlu" class="selecter selected"></div>
        </div>
        <div class="btn-est-alumnos">
            <button class="btn-options" onclick="esta_cursos();">Evaluaciones</button>
            <div id="sCur" class="selecter"></div>
        </div>
    </div>
</div>
<div class="div-main-content">
    <div class="div-lista-alumnos oculto">
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
    </div>
</div>
<script type="text/javascript" src="js/select2.min.js"></script>
<script type="text/javascript" src="js/estadisticas_docentes_adm.js?v=<?php echo rand();?>"></script>
