<?php
session_start();
require "includes/functions.php";
if(!cliente_activo()){
    header("Location : docentes.php");
    exit();
}
require 'header_adm.php';

function get_first_day(){
    return date('Y-m-d', strtotime("this week"));
}
function get_last_day(){
    return date('Y-m-d',strtotime("this week + 5 days"));
}
?>
<link rel="stylesheet" type="text/css" href="css/resumen_adm.css?v=<?php echo rand();?>">
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
                    	<div class="option-head">
	                    	<div class="div-trimestre">
	                    		Trimestre: 
	                    		1
	                    		<input id="t1" type="checkbox" name="" onclick="trimestre(this)">
	                    		2
	                    		<input id="t2" type="checkbox" name="" onclick="trimestre(this)">
	                    		3
	                    		<input id="t3" type="checkbox" name="" onclick="trimestre(this)">
	                    		Todos
	                    		<input id="tt" type="checkbox" name="" checked onclick="gestion(this)">
	                    	</div>
	                        <div class="div-search">
	                            <input class="input-search" id="input_date_ini" type="date" placeholder="B&uacute;squeda..." value="" />
	                            <input class="input-search" id="input_date" type="date" placeholder="B&uacute;squeda..." value=""/><a class="btn-search" href="#" onclick="search_data();"><img src="svg/busqueda.svg"></a>
	                        </div>
                    	</div>
                    </td>
                </tr>
                <tr>
                    <td class="index">Materia</td>
                    <td class="border-left">Prácticos</td>
                    <td class="border-left">Evaluaciones</td>
                    <td class="border-left">Material de Apoyo</td>
                </tr>
            </thead>
            <tbody id="body">                
            </tbody>
        </table>
    </div>
    <div class="noData oculto">No tiene materias...</div>
</div>


<script type="text/javascript" src="js/resumen_adm.js?v=<?php echo rand();?>"></script>
  <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js"></script>
<script type="text/javascript">
    $('#seleccionar_curso').select2({"width":300});
    $('#seleccionar_paralelo').select2({"width":300});
</script>
