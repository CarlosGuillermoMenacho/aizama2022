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
<link rel="stylesheet" type="text/css" href="css/calendario_academico.css?v=<?php echo rand()?>">
<div class="title"><h1>Calendario Académico</h1></div>
<div id="tabla_lista" class="table-lista">
    <table> 
        <tbody>
            <tr>
                <td class="border-td" colspan="3">
                    <form id="formulario-save">
                        <div class="fecha">
                            <div>
                                Desde: <input type="date" class="input-data" id="desde" name="desde" value="<?php echo date("Y-m-d")?>">
                            </div>
                            <div>
                                Hasta: <input type="date" class="input-data" id="hasta" name="hasta" value="<?php echo date("Y-m-d")?>">
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                Imagen: <img id="img" src="svg/imagen.svg" style="width: 45px; border-radius: 5px; cursor: pointer;" onclick="select_imagen()">
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px;">Descripción: <textarea class="input-data2" id="descripcion" name="descripcion"></textarea></div>
                            <input type="file" id="imagen" name="imagen" style="display: none;" accept="image/png, image/jpg, image/jpeg">
                        </div>
                    </form>
                </td>
                <td class="border-td">
                    <div class="content-center">
                        <img title="Guardar" class="cursor-pointer" onclick="save();" width="30px" src="images/check.svg">
                        <img title="Cancelar" class="cursor-pointer" src="images/cerrar.svg" width="30px" onclick="limpiar();">
                    </div>
                </td>
            </tr>         
        </tbody>
    </table>
</div>
<div id="tabla_lista" class="table-lista">
    <table> 
        <thead>
            <tr>
                <td class="index">Nro.</td>
                <td class="border-left">Fecha</td>
                <td class="border-left">Descripción</td>
                <td class="border-left">Imágen</td>
                <td class="border-left" width="120px">Opciones</td>
            </tr>
        </thead>
        <tbody id="body">
            <tr>
                <td class="border-top index">1</td>
                <td class="border-td fecha">2023-07-24</td>
                <td class="border-td">Habitad de los animales</td>
                <td class="border-td content-center" >
                    <img title="Editar" class="cursor-pointer" src="images/edit.svg" width="30px">
                    <img class="cursor-pointer" width="30px" src="images/delete.png" title="Eliminar">
                </td>
            </tr>    
            <!--tr>
                <td class="border-top index">2</td>
                <td class="border-td fecha"><input type="date" class="input-data" name=""></td>
                <td class="border-td"><textarea class="input-data2"></textarea></td>
                <td class="border-td content-center" >
                    <img title="Guardar" class="cursor-pointer" width="30px" src="images/check.svg">
                    <img title="Cancelar" class="cursor-pointer" src="images/cerrar.svg" width="30px">
                </td>
            </tr-->              
        </tbody>
    </table>
</div>
<div style="display:none;">
        <form id="formulario">
            <input type="text" id="id" name="id">
            <input type="file" id="img-change" name="imagen" accept="image/png, image/jpg, image/jpeg">
        </form>
    </div>
<!--div class="show-img">
    <img src="svg/imagen.svg" style="width:200px;">
    <p>Seleccionar imagen</p>
</div-->
<!--div id="btn-add" class="div-add"><img src="svg/agregar-documento.svg" style="width:30px; cursor:pointer" onclick="add_fila();">Agregar</div-->
<script type="text/javascript" src="js/calendario_academico.js?v=<?php echo rand();?>"></script>