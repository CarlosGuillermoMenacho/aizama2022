<?php
session_start();
if($_SESSION['app_user_perfil'] == 'SECUNDARIA') {
    require 'header_sec.php';
} 
if($_SESSION['app_user_perfil'] == 'PRIMARIA' || $_SESSION['app_user_perfil'] == 'INICIAL' ) {
  require 'header_prim.php';
} 
?>
<link rel="stylesheet" type="text/css" href="css/practicos_family.css?v=<?php echo rand();?>">
<div class="content-main">
    <div class="div-buttons">
        <button class="button-selec selected" id="btn-select-pendientes">PENDIENTES A REALIZAR</button>
        <button class="button-selec" id="btn-select-presentados">REALIZADOS Y NOTAS</button>
    </div>
    <div class="div-tablas">
        <div class="div-title-tabla" id="div-title-tabla">Evaluaciones pendientes de realizar</div>
        <div class="div-select-alumno" style="display:none;">
            Alumno: <select id="select-alumno"><option value="0"> -- Seleccionar Alumno --</option></select>
        </div>
        <div class="div-cont-materia" id="content-table">
            <div class="title-materia">
                <div class="div-materia">Ciencias Naturales</div>
                <div>Total 3 de 9</div>
            </div>
            <div class="div-content-items">
               <div class="item">Práctico 1: Fecha de presentación: 20/02/2022 100 pts.</div> 
            </div>
        </div>
    </div>
</div>
<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />

<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>
<script type="text/javascript">
$('#select-alumno').select2({width:400});
</script>
<script src="js/evaluaciones_alumno.js?v=<?php echo rand();?>">

</script>