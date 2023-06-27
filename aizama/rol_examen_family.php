<?php
session_start();
require 'header_family.php';
?>
<link rel="stylesheet" type="text/css" href="css/rol_examen_family.css?v=<?php echo rand();?>">
<div id="container" class="container">
    <div class="title"><h1>Rol de Ex&aacute;menes Trimestre : <?php echo $_SESSION['app_user_bimestre'];?></h1></div>

    <div id="tabla_lista" class="table-lista oculto">
        <table> 
            <thead id="head">
                <tr>
                    <td class="index">Nro.</td>
                    <td class="border-left">Materia</td>
                    <td class="border-left">Descripci&oacute;n</td>
                    <td class="border-left">D&iacute;a</td>
                    <td class="border-left">Fecha</td>
                    <td class="border-left">Hora</td>
                </tr>
            </thead>
            <tbody id="body">                
            </tbody>
        </table>
    </div>
    <div id="noData" class="noData oculto">No tiene planificaciones...</div>
    <div class="btn-float-back oculto">
        <img src="svg/back-svg.svg">
    </div>
</div>
<script type="text/javascript" src="js/rol_examen_family.js?v=<?php echo rand();?>"></script>