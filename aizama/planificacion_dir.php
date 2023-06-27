<?php
session_start();
require "includes/functions.php";
if(!cliente_activo()){
    header("Location : direccion.php");
    exit();
}
require 'header_dir.php';
?>

<link rel="stylesheet" type="text/css" href="css/planificacion_adm.css?v=<?php echo rand();?>">
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css" rel="stylesheet" />

<div id="container" class="container">
    <div class="title"><h1>Planificaciones gesti&oacute;n <?php echo (date("Y"));?></h1></div>
    <div class="div-select oculto">
        <select id="seleccionar_curso">
            <option value="">-- Seleccionar Curso -- </option> 
        </select>
        <select id="seleccionar_paralelo">
            <option value="">-- Seleccionar Paralelo -- </option> 
        </select>
    </div>

    <div id="tabla_lista" class="table-lista oculto">
        <table> 
            <thead>
                <tr>
                    <td colspan="9">
                        <div class="div-search">
                            <input class="input-search" id="input_date" type="date" placeholder="B&uacute;squeda..." /><a class="btn-search" href="#" onclick="search_data();"><img src="svg/busqueda.svg"></a>
                        </div> 
                    </td>
                </tr>
                <tr>
                    <td class="index">Nro.</td>
                    <td class="border-left">Fecha</td>
                    <td class="border-left">D&iacute;a</td>
                    <td class="border-left">Periodo</td>
                    <td class="border-left">Materia</td>
                    <td class="border-left">Actividad o Tema</td>
                    <td class="border-left">Actividad complementaria</td>
                    <td class="border-left">Bibliograf&iacute;a</td>
                </tr>
            </thead>
            <tbody id="body">                
            </tbody>
        </table>
    </div>
    <div class="noData oculto">No tiene planificaciones...</div>
</div>


<script type="text/javascript" src="js/planificacion_adm.js?v=<?php echo rand();?>"></script>
  <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js"></script>
<script type="text/javascript">
    $('#seleccionar_curso').select2({"width":300});
    $('#seleccionar_paralelo').select2({"width":300});
</script>