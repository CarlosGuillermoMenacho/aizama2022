<?php
session_start();
require'includes/functions.php';
if(!cliente_activo()){
    header("Location: familia.php");
    exit();
}
require'header_sec.php';
?>
<link rel="stylesheet" type="text/css" href="css/practicos_family.css?v=<?php echo rand();?>">
<div class="content-main">
    <div class="div-buttons">
        <button class="button-selec selected" id="btn-select-pendientes">PENDIENTES DE PRESENTAR</button>
        <button class="button-selec" id="btn-select-presentados">PRESENTADOS Y NOTAS</button>
    </div>
    <div class="div-tablas">
        <div class="div-title-tabla" id="div-title-tabla">Prácticos pendientes de presentar</div>
        <div class="div-select-alumno" style="display: none;">
            Alumno: <select id="select-alumno"><option value="0"> -- Seleccionar Alumno --</option></select>
        </div>
        <div class="div-cont-materia" id="content-table">
            <!--div class="title-materia">
                <div class="div-materia">Ciencias Naturales</div>
                <div>Total 3 de 9</div>
            </div>
            <div class="div-content-items">
               <div class="item">Práctico 1: Fecha de presentación: 20/02/2022 100 pts.</div> 
            </div-->
        </div>
    </div>
</div>
<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />

<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>
<script type="text/javascript">
$('#select-alumno').select2({width:400});
</script>
<script src="js/practicos_alu.js?v=<?php echo rand();?>">

</script> 