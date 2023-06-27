<?php
session_start();
require 'header_adm.php';
?>
<link rel="stylesheet" type="text/css" href="css/listas_adm.css?v=<?php echo rand();?>">
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css" rel="stylesheet" />
<div class="content">
    <div class="title"><h1>Gestionar Listas</h1></div>
    <div class="div-selects oculto">
        <select id="select_curso"><option value="">-- Seleccionar Curso --</option></select>
        <select id="select_paralelo"><option value="">-- Seleccionar Paralelo --</option></select>
    </div>
    <div class="div-table-escritorio oculto">
        <table>
            <thead>
                <tr>
                    <td>Nro.</td>
                    <td>Alumno</td>
                    <td>Opciones</td>
                </tr>
            </thead>
            <tbody id="body-escritorio">
                <tr>
                    <td class="index">1</td>
                    <td class="border-td2 center">07:40 a 08:20</td>
                    <td class="border-td pointer" onclick="get_info(1,1);">Matematicas</td>
                    <td class="border-td pointer">Sociales</td>
                    <td class="border-td pointer">Lenguajes</td>
                    <td class="border-td pointer">Ciencias</td>
                    <td class="border-td pointer">Biologia</td>
                    <td class="border-td pointer">Musica</td>
                </tr>
                <tr>
                    <td class="index">1</td>
                    <td class="border-td2 center">07:40 a 08:20</td>
                    <td class="border-td pointer" onclick="get_info(1,1);">Matematicas</td>
                    <td class="border-td pointer">Sociales</td>
                    <td class="border-td pointer">Lenguajes</td>
                    <td class="border-td pointer">Ciencias</td>
                    <td class="border-td pointer">Biologia</td>
                    <td class="border-td pointer">Musica</td>
                </tr>
                <tr>
                    <td class="index">1</td>
                    <td class="border-td2 center">07:40 a 08:20</td>
                    <td class="border-td pointer" onclick="get_info(1,1);">Matematicas</td>
                    <td class="border-td pointer">Sociales</td>
                    <td class="border-td pointer">Lenguajes</td>
                    <td class="border-td pointer">Ciencias</td>
                    <td class="border-td pointer">Biologia</td>
                    <td class="border-td pointer">Musica</td>
                </tr>
                <tr>
                    <td class="index">1</td>
                    <td class="border-td2 center">07:40 a 08:20</td>
                    <td class="border-td pointer" onclick="get_info(1,1);">Matematicas</td>
                    <td class="border-td pointer">Sociales</td>
                    <td class="border-td pointer">Lenguajes</td>
                    <td class="border-td pointer">Ciencias</td>
                    <td class="border-td pointer">Biologia</td>
                    <td class="border-td pointer">Musica</td>
                </tr>
                <tr>
                    <td class="index">1</td>
                    <td class="border-td2 center">07:40 a 08:20</td>
                    <td class="border-td pointer" onclick="get_info(1,1);">Matematicas</td>
                    <td class="border-td pointer">Sociales</td>
                    <td class="border-td pointer">Lenguajes</td>
                    <td class="border-td pointer">Ciencias</td>
                    <td class="border-td pointer">Biologia</td>
                    <td class="border-td pointer">Musica</td>
                </tr>
                <tr>
                    <td class="index">1</td>
                    <td class="border-td2 center">07:40 a 08:20</td>
                    <td class="border-td pointer" onclick="get_info(1,1);">Matematicas</td>
                    <td class="border-td pointer">Sociales</td>
                    <td class="border-td pointer">Lenguajes</td>
                    <td class="border-td pointer">Ciencias</td>
                    <td class="border-td pointer">Biologia</td>
                    <td class="border-td pointer">Musica</td>
                </tr>
                <tr>
                    <td class="index">1</td>
                    <td class="border-td2 center">07:40 a 08:20</td>
                    <td class="border-td pointer" onclick="get_info(1,1);">Matematicas</td>
                    <td class="border-td pointer">Sociales</td>
                    <td class="border-td pointer">Lenguajes</td>
                    <td class="border-td pointer">Ciencias</td>
                    <td class="border-td pointer">Biologia</td>
                    <td class="border-td pointer">Musica</td>
                </tr>
            </tbody>
        </table>
        <div class="formulario_asignacion oculto">
            <div class="btn-close">
                <img src="images/close.svg" onclick="close_form();">
            </div>
            <form id="formulario">
                <div class="center title-form">
                    <label>Asignar Nuevo Curso</label>
                </div>
                <div class="center labels">
                    <label id="info">Lunes 07:40 a 08:20</label>  
                </div>
                <div class="center select-form">
                    <select id="seleccionar_curso"><option value=""> -- Seleccionar Curso --</option></select>
                    <select id="seleccionar_paralelo"><option value=""> -- Seleccinar Paralelo -- </option></select>
                </div>
                <div class="center">
                    <button class="btn-submit" id="btn-aceptar">ACEPTAR</button>
                </div>
            </form>
        </div>
    </div>
    <div class="div-table-movil">
        <table>
            <thead>
                
            </thead>
            <tbody id="body-movil">
                
            </tbody>
        </table>
    </div>
    
</div>
<script type="text/javascript" src="js/listas_adm.js?v=<?php echo rand();?>"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js" integrity="sha512-2ImtlRlf2VVmiGZsjm9bEyhjGW4dU7B6TNwh/hx/iSByxNENtj3WVE6o/9Lj4TJeVXPi4bnOIMXFIJJAeufa0A==" crossorigin="anonymous"></script>
<script>
    $(document).ready(function() {
    	$('#select_curso').select2( { width: '300px'} );
	    $('#select_paralelo').select2( { width: '300px'} );
	    $('#seleccionar_curso').select2( { width: '200px'} );
	    $('#seleccionar_paralelo').select2( { width: '200px'} );
  	});
</script>