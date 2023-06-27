<?php
session_start();
require "includes/functions.php";
if(!cliente_activo()){
    header("Location : docentes.php");
    exit();
}
require 'header.php';
?>
<link rel="stylesheet" type="text/css" href="css/rol_de_examenes_doc.css?v=<?php echo rand();?>">
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css" rel="stylesheet" />
<div id="container" class="container">
    <div class="title"><h1>Rol de Ex&aacute;menes Trimestre : <?php echo $_SESSION['app_user_bimestre'];?></h1></div>
    <div class="div-selects">
        <div class="sel">
            <select name="seleccionar_curso" id="seleccionar_curso" required>
                <option value="0" > -- Seleccionar Curso -- </option>
            </select>
        </div>
        <div class="sel">
            <select name="seleccionar_materia" id="seleccionar_materia" required>
                <option value="0">-- Seleccionar Materia -- </option>
            </select>
        </div>
    </div>
    <div id="div-btn-nuevo" class="btn-nuevo oculto">
        <button class="submit" id="btn-nuevo">Nuevo</button>
    </div>

    <div id="tabla_lista" class="table-lista oculto">
        <table> 
            <thead>
                <tr>
                    <td class="index">Nro.</td>
                    <td class="border-left">Descripci&oacute;n</td>
                    <td class="border-left">Fecha</td>
                    <td class="border-left">Hora</td>
                    <td class="border-left">Opciones</td>
                </tr>
            </thead>
            <tbody id="body">                
            </tbody>
        </table>
    </div>
    <div id="noData" class="noData oculto">No tiene planificaciones...</div>
    <div class="div-formulario oculto">
        <form id="formulario" class="formulario">
            <div class="item">
                <label>Descripción</label>
                <textarea class="border-style" id="descripcion" name="actividad_complementaria" placeholder="Descripción..." maxlength="500"></textarea> 
            </div>
            <div class="item">
                <label for="fecha">Fecha</label>
                <input class="border-style" id="fecha" type="date" name="fecha">
            </div>
            <div class="item">
                <label for="hora">Hora</label>
                <input class="border-style" id="hora" type="time" name="hora">
            </div>
        </form>
        <div class="btn-guardar"><button id="btn-guardar" class="submit">Guardar</button></div>
    </div>
    <div class="btn-float-back oculto">
        <img src="svg/back-svg.svg">
    </div>
</div>
<script type="text/javascript" src="js/rol_de_examen.js?v=<?php echo rand();?>"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js" integrity="sha512-2ImtlRlf2VVmiGZsjm9bEyhjGW4dU7B6TNwh/hx/iSByxNENtj3WVE6o/9Lj4TJeVXPi4bnOIMXFIJJAeufa0A==" crossorigin="anonymous"></script>
<script>

  $(document).ready(function() {

    $('#seleccionar_curso').select2( { width: '300px'} );

    $('#seleccionar_materia').select2( { width: '300px'} );

  });

</script>