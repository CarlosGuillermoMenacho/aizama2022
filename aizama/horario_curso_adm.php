<?php
session_start();
require"session_verify.php";
require 'header_adm.php';
?>
<link rel="stylesheet" type="text/css" href="css/horario_curso_adm.css?v=<?php echo rand();?>">
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css" rel="stylesheet" />
<div class="content">
    <div class="title"><h1>Gestionar Horarios</h1></div>
    <div class="div-selects oculto">
        <select id="select_curso"><option value="">-- Seleccionar Curso --</option></select>
        <select id="select_paralelo"><option value="">-- Seleccionar Paralelo --</option></select>
        <div class="btn-refresh">
            <img src="images/refresh.svg">
        </div>
    </div>
    <div class="main-div-escritorio">
        <div class="div-table-escritorio oculto">
            <table>
                <thead>
                    <tr>
                        <td>Periodo</td>
                        <td>Hora</td>
                        <td>Lunes</td>
                        <td>Martes</td>
                        <td>Mi&eacute;rcoles</td>
                        <td>Ju&eacute;ves</td>
                        <td>Viernes</td>
                        <td>S&aacute;bado</td>
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
                        <label>Asignar Materia y Profesor</label>
                    </div>
                    <div class="center labels">
                        <label id="info">Lunes 07:40 a 08:20</label>  
                    </div>
                    <div class="center select-form">
                        <select id="seleccionar_materia"><option value=""> -- Seleccionar Materia --</option></select>
                        <select id="seleccionar_profesor"><option value=""> -- Seleccinar Profesor -- </option></select>
                    </div>
                    <div class="center">
                        <button class="btn-submit" id="btn-aceptar">ACEPTAR</button>
                    </div>
                    <div class="btn-delet">
                        <img src="images/delete.png">
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="main-div-mobil">
        <div class="div-table-movil oculto">
            <table class="table-movil">
                <thead class="thead-movil">
                    <tr>
                        <td class="center">Peri.</td>
                        <td class="center">Hora</td>
                        <td class="center">Lunes</td>
                    </tr>
                </thead>
                <tbody class="tbody-movil" id="body-lunes">
                    <tr>
                        <td class="index">1</td>
                        <td class="border-td2 center">07:40 a 08:20</td>
                        <td class="border-td pointer" onclick="get_info(1,1);">Matematicas</td>
                    </tr>
                    <tr>
                        <td class="index">2</td>
                        <td class="border-td2 center">07:40 a 08:20</td>
                        <td class="border-td pointer" onclick="get_info(1,1);">Matematicas</td>
                    </tr>
                    <tr>
                        <td class="index">3</td>
                        <td class="border-td2 center">07:40 a 08:20</td>
                        <td class="border-td pointer" onclick="get_info(1,1);">Matematicas</td>
                    </tr>
                    <tr>
                        <td class="index">4</td>
                        <td class="border-td2 center">07:40 a 08:20</td>
                        <td class="border-td pointer" onclick="get_info(1,1);">Matematicas</td>
                    </tr>
                    <tr>
                        <td class="index">5</td>
                        <td class="border-td2 center">07:40 a 08:20</td>
                        <td class="border-td pointer" onclick="get_info(1,1);">Matematicas</td>
                    </tr>
                    <tr>
                        <td class="index">6</td>
                        <td class="border-td2 center">07:40 a 08:20</td>
                        <td class="border-td pointer" onclick="get_info(1,1);">Matematicas</td>
                    </tr>
                    <tr>
                        <td class="index">7</td>
                        <td class="border-td2 center">07:40 a 08:20</td>
                        <td class="border-td pointer" onclick="get_info(1,1);">Matematicas</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="formulario_asignacion_movil oculto">
            <div class="btn-close">
                <img src="images/close.svg" onclick="close_form();">
            </div>
            <form id="formulario_movil">
                <div class="center title-form">
                    <label>Asignar Materia y Profesor</label>
                </div>
                <div class="center labels">
                    <label id="info_movil">Lunes 07:40 a 08:20</label>  
                </div>
                <div class="center select-form">
                    <select id="seleccionar_materia_movil"><option value=""> -- Seleccionar Materia --</option></select>
                    <select id="seleccionar_profesor_movil"><option value=""> -- Seleccinar Profesor -- </option></select>
                </div>
                <div class="center">
                    <button class="btn-submit" id="btn-aceptar-movil">ACEPTAR</button>
                </div>
                <div class="btn-delet">
                    <img src="images/delete.png">
                </div>
            </form>
        </div>
    </div>
    <div class="btn-refresh-movil">
            <img src="images/refresh.svg">
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js" integrity="sha512-2ImtlRlf2VVmiGZsjm9bEyhjGW4dU7B6TNwh/hx/iSByxNENtj3WVE6o/9Lj4TJeVXPi4bnOIMXFIJJAeufa0A==" crossorigin="anonymous"></script>
<script type="text/javascript" src="js/horario_curso_adm.js?v=<?php echo rand();?>"></script>
<script>
    $(document).ready(function() {

    $('#select_curso').select2( { width: '300px'} );

    $('#select_paralelo').select2( { width: '300px'} );
    $('#seleccionar_materia').select2( { width: '200px'} );

    $('#seleccionar_profesor').select2( { width: '200px'} );

     $('#seleccionar_materia_movil').select2( { width: '200px'} );

    $('#seleccionar_profesor_movil').select2( { width: '200px'} );
    
  });
</script>