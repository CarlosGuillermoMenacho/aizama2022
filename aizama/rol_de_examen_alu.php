<?php 
session_start();
require 'includes/config.php';
require 'includes/functions.php';
if (!cliente_activo()) {
  header("Location: usuario.php");
  exit();
}
require 'new_header.php';
?>
<link rel="stylesheet" type="text/css" href="css/rol_de_examenes_doc.css?v=<?php echo rand();?>">
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css" rel="stylesheet" />
<div id="container" class="container">
    <div class="title"><h1>Rol de Ex&aacute;menes Trimestre : <?php echo $_SESSION['app_user_bimestre'];?></h1></div>

    <div id="tabla_lista" class="table-lista oculto">
        <table> 
            <thead>
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

</div>
<script type="text/javascript" src="js/rol_de_examen_alu.js?v=<?php echo rand();?>"></script>
