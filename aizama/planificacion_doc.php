<?php
session_start();
require "includes/functions.php";
if(!cliente_activo()){
    header("Location : docentes.php");
    exit();
}
require 'header.php';
function get_first_day(){
    return date('Y-m-d', strtotime("this week"));
}
function get_last_day(){
    return date('Y-m-d',strtotime("this week + 5 days"));
}
?>

<link rel="stylesheet" type="text/css" href="css/planificacion_doc.css?v=<?php echo rand();?>">
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css" rel="stylesheet" />

<div id="container" class="container">
    <div class="title"><h1>Planificaciones gesti&oacute;n <?php echo (date("Y"));?></h1></div>
    <!--div class="div-select">
        <input type="date" id="fecha2" value="">
    </div-->
    <div id="div-btn-nuevo" class="btn-nuevo oculto">
        <button class="submit" id="btn-nuevo">Nuevo</button>
    </div>

    <div id="tabla_lista" class="table-lista oculto">
        <div class="btn-listageneral">
            <button class="submit" id="btn-lista-general">Lista general</button>
        </div>
        <table> 
            <thead>
                <!--tr>
                    <td colspan="9">
                        <div class="div-search">
                            <input class="input-search" type="text" value="" placeholder="B&uacute;squeda..." /><a class="btn-search" href="#" onclick="search();"><img src="svg/search.svg"></a>
                        </div> 
                    </td>
                </tr-->
                <tr>
                    <td class="index">Nro.</td>
                    <td class="border-left">Fecha</td>
                    <td class="border-left">D&iacute;a</td>
                    <td class="border-left">Periodo</td>
                    <td class="border-left actividad">Curso</td>
                    <td class="border-left">Materia</td>
                    <td class="border-left actividad">Actividad o Tema</td>
                    <td class="border-left">Actividad complementaria</td>
                    <td class="border-left">Bibliograf&iacute;a</td>
                    <td class="border-left">Editar/Eliminar</td>
                </tr>
            </thead>
            <tbody id="body">                
            </tbody>
        </table>
    </div>
    <div class="noData oculto">No tiene planificaciones...</div>
    <div class="div-formulario oculto">
        <form id="formulario" class="formulario">
            <div class="item">
                <label for="materia">Curso</label>
                <select id="seleccionar_curso">
                    <option value="">-- Seleccionar Curso -- </option> 
                </select>
            </div>
            <div class="item">
                <label for="materia">Materia</label>
                <select id="seleccionar_materia" name="codmat"><option value=""> -- Seleccionar Materia --</option></select>
            </div>
            <div class="item">
                <label for="fecha">Fecha</label>
                <input class="border-style" id="fecha" type="date" name="fecha" value="<?php echo date("Y-m-d");?>">
            </div>
            <div class="item">
                <label for="periodo">Periodo</label>
                <div class="checks">
                    <div class="button-check" onclick="check(this)">1<input class="oculto" type="checkbox" name="checkbox"></div>
                    <div class="button-check" onclick="check(this)">2<input class="oculto" type="checkbox" name="checkbox"></div>
                    <div class="button-check" onclick="check(this)">3<input class="oculto" type="checkbox" name="checkbox"></div>
                    <div class="button-check" onclick="check(this)">4<input class="oculto" type="checkbox" name="checkbox"></div>
                    <div class="button-check" onclick="check(this)">5<input class="oculto" type="checkbox" name="checkbox"></div>
                    <div class="button-check" onclick="check(this)">6<input class="oculto" type="checkbox" name="checkbox"></div>
                    <div class="button-check" onclick="check(this)">7<input class="oculto" type="checkbox" name="checkbox"></div>
                </div>

            </div>
            <div class="item">
                <label for="actividad">Actividad</label>
                <textarea class="border-style"  id="actividad" name="actividad" placeholder="Actividad..." maxlength="500"></textarea> 
            </div>
            <div class="item">
                <label>Recursos/Bibliograf&iacute;a</label>
                <textarea class="border-style" id="recursos" name="recursos" placeholder="Bibliograf&iacute;a..." maxlength="500"></textarea> 
            </div>
            <div class="item">
                <label>Actividad complementaria</label>
                <textarea class="border-style" id="actividad_complementaria" name="actividad_complementaria" placeholder="Actividad complementaria..." maxlength="500"></textarea> 
            </div>
        </form>
        <div class="btn-guardar"><button id="btn-guardar" class="submit">Guardar</button></div>
        <div class="btn-guardar"><button id="btn-update" class="submit">Actualizar</button></div>
    </div>
    <div class="btn-float-back oculto">
        <img src="svg/back-svg.svg">
    </div>
</div>
<div id="container-lista-general" class="container oculto">
    <div class="title"><h1>Planificaciones gesti&oacute;n <?php echo (date("Y"));?></h1></div>
    <div class="div-select">
        <select id="seleccionar_curso-lg">
            <option value="">-- Seleccionar Curso -- </option> 
        </select>
    </div>
    <div class="btn-float-back">
        <img src="svg/back-svg.svg">
    </div>
    <div class="content-table-general">

        <div id="tabla_lista_general" class="table-lista oculto">
            <table> 
                <thead>
                    <tr>
                        <td colspan="9">
                            <div class="div-search">
                                <input class="input-search" id="input_date_ini" type="date" placeholder="B&uacute;squeda..." value="<?php echo get_first_day();?>" />
                                <input class="input-search" id="input_date" type="date" placeholder="B&uacute;squeda..." value="<?php echo get_last_day();?>"/><a class="btn-search" href="#" onclick="search_data();"><img src="svg/busqueda.svg"></a>
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
                <tbody id="body-lista-general">                
                </tbody>
            </table>
        </div>        
    </div>
    <div class="noData oculto">No tiene planificaciones...</div>
</div>

<script type="text/javascript" src="js/planificacion_doc.js?v=<?php echo rand();?>"></script>
  <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js"></script>
<script type="text/javascript">
    $('#seleccionar_curso').select2({"width":250});
    $('#seleccionar_materia').select2({"width":250});
    $('#seleccionar_curso-lg').select2({"width":250});
</script>