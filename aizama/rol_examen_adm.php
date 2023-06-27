<?php
session_start();
if ($_SESSION['app_user_nivel']=='portero'){
    require 'header_por.php';
}else{
    require 'header_adm.php';
}
?>
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css" rel="stylesheet" />
<link rel="stylesheet" type="text/css" href="css/rol_examen_adm.css?v=<?php echo rand();?>">
<div id="container" class="container">
	<div class="title"><h1>ROL DE EX&Aacute;MENES</h1></div>

    <div class="div-select">
    		<select id="seleccionar_curso">
    			<option value="">-- SELECCIONAR CURSO -- </option>
    			<option value="5">PRIMERO DE PRIMARIA</option> 
    			<option value="6">SEGUNDO DE PRIMARIA</option> 
    			<option value="7">TERCERO DE PRIMARIA</option> 
    			<option value="8">CUARTO DE PRIMARIA</option> 
    			<option value="9">QUINTO DE PRIMARIA</option> 
    			<option value="10">SEXTO DE PRIMARIA</option> 
    			<option value="11">PRIMERO DE SECUNDARIA</option> 
    			<option value="12">SEGUNDO DE SECUNDARIA</option> 
    			<option value="13">TERCERO DE SECUNDARIA</option> 
    			<option value="14">CUARTO DE SECUNDARIA</option> 
    			<option value="15">QUINTO DE SECUNDARIA</option> 
    			<option value="16">SEXTO DE SECUNDARIA</option>
    			<option value="20">CURSO DE PRUEBA</option>
    		</select>
    		<select id="seleccionar_paralelo">
    			<option value="">-- SELECCIONAR PARALELO -- </option> 
    			<option value="1">A</option>
    			<option value="2">B</option>
    			<option value="3">C</option>
    			<option value="4">D</option>
    			<option value="5">E</option>
    		</select>
    </div>
	<div id="tabla_lista" class="table-lista oculto">
        <table id="tabla"> 
            <thead>
                <tr>
                    <td class="index">Nro.</td>
                    <td class="border-left">D&iacute;a</td>
                    <td class="border-left actividad">Fecha</td>
                    <td class="border-left">Hora</td>
                    <td class="border-left">Materia</td>
                    <td class="border-left">Descripci&oacute;n</td>
                </tr>
            </thead>
            <tbody id="body">  

            </tbody>
        </table>
        
        <br><br><br>
    </div>
    <div id="noData" class="noData oculto">No tiene planificaciones...</div>
</div>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js"></script>
<script type="text/javascript" src="js/rol_examen_adm.js?v=<?php echo rand();?>"></script>
<script type="text/javascript">
	$('#seleccionar_curso').select2({"width":300});
	$('#seleccionar_paralelo').select2({"width":300});
</script>