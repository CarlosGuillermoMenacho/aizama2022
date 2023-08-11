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
<link rel="stylesheet" type="text/css" href="css/foto_perfil_alumnos.css?v=1429921348">
<div class="title"><h1>GESTIONAR FOTO DE PERFIL DE LOS PROFESORES</h1></div>
<div id="tabla_lista" class="table-lista">
        <table> 
            <thead>
                <tr>
                    <td class="index">Nro.</td>
                    <td class="border-left">Nombre</td>
                    <td class="border-left">Foto</td>
                </tr>
            </thead>
            <tbody id="body">
                                    <!--tr>
                                        <td class="border-top index">1</td>
                                        <td class="border-td fecha">2023-07-24</td>
                                        <td class="border-td">Lunes</td>
                                        <td class="border-td">1</td>
                                        <td class="border-td">Ingles</td>
                                        <td class="border-td">TEMA DE AVANCE: PART OF THE BODY</td>
                                        <td class="border-td">VER VIDEOS </td>
                                        <td class="border-td">PROG. MINEDU</td>
                                        <td class="border-td">2023-07-23 14:14:16</td>
                                    </tr-->                              
            </tbody>
        </table>
    </div>
    <div style="display:none;">
        <form id="formulario">
            <input type="text" id="codalu" name="codprof">
            <input type="file" id="imagen" name="imagen" accept="image/png, image/jpg, image/jpeg"/>
        </form>
    </div>
<script type="text/javascript" src="js/foto_perfil_docente.js?v=<?php echo rand();?>"></script>