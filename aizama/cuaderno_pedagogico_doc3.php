<?php
session_start();

require 'includes/config.php';

require 'includes/functions.php';



require 'header.php';

?>





<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta http-equiv="X-UA-Compatible" content="IE=edge">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  

  <!-- Estilos select2 para los selects -->

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" integrity="sha512-nMNlpuaDPrqlEls3IX/Q56H36qvBASwb3ipuo3MxeWbsQB1881ox0cRv7UPTgBlriqoynt35KjEwgGUeUXIPnw==" crossorigin="anonymous" />

  <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js" integrity="sha512-2ImtlRlf2VVmiGZsjm9bEyhjGW4dU7B6TNwh/hx/iSByxNENtj3WVE6o/9Lj4TJeVXPi4bnOIMXFIJJAeufa0A==" crossorigin="anonymous"></script>



  <!-- Estilos para las alertas SweetAlert2 -->

  <link rel="stylesheet" href="node_modules/sweetalert2/dist/sweetalert2.css" >

  <script src="node_modules/sweetalert2/dist/sweetalert2.all.min.js" ></script>

    <!-- Estilos css -->

  <link rel="stylesheet" href="css/style_asignacion_class_doc.css">

  <link rel="stylesheet" href="css/cuaderno_pedagogico_doc.css?v=<?php echo rand();?>">





</head>
<style>
.contenedor-tables{
  display: block;
}
</style>
<body>

  <div class="contenedor">

    <h1 style="text-align:center; font-size:32px; margin:10px auto;">cuaderno pedag&oacute;gico - Trimestre <strong><?=$_SESSION['app_user_bimestre'];?></strong></h1>

    <div class="grid-2" style="display: none;">

      <div class="selects">

        <label for="seleccionar_curso">curso:</label>

        <select name="seleccionar_curso" id="seleccionar_curso" required>

          <option value="0" > -- Seleccione el curso -- </option>

        </select>

      </div>

      

      <div class="selects">

        <label for="seleccionar_materia">materia:</label>

        <select name="seleccionar_materia" id="seleccionar_materia" required>

          <option value="0">-- Seleccione la materia -- </option>

        </select>

      </div>

    </div>
    <div class="botons" id="div_buttons">
      <div class="div-buttons">
        <button class="button-selec selected" id="btn-select-pendientes">REGISTRO DE NOTAS</button>
        <button class="button-selec" id="btn-select-presentados">REGISTRO DE ASISTENCIAS</button>
      </div>
    </div>
    <div class="botons" id="div_buttons_asistencia">
      <div class="div-buttons">
        <button class="button-selec selected" id="btn_asistencia_materia">ASISTENCIA POR MATERIA</button>
        <button class="button-selec" id="btn_asistencia_diaria">ASISTENCIA DIARIA</button>
      </div>
    </div>
    <div id="tabla_general">
      <div  class="contenedor-tables" style="margin-bottom:15px;">

        <div class="contenedor-table-general">
          
          <table  data-excel-name="Practicos" class="table">

            <thead id="header_table">

              <tr>
                <td colspan="3">Unidad Educativa</td>

                <td colspan="8">REGISTRO DE ASITENCIA - GESTION ESCOLAR 2022</td>

              </tr>

              <tr>

                  <td colspan="3">Maestro: Carlos Guillermo Menacho </td>

                  <td colspan="8">Área: Matemáticas</td>


              </tr>

              <tr>
                  <td>&nbsp;</td>
                  <td colspan="2">SECUNDARIA COMUNITARIA PRODUCTIVA</td>

                  <td colspan="5">ASITENCIA</td>

                  <td class="vertical" rowspan="4">ATRASOS</td>
                  <td class="vertical" colspan="2" rowspan="2">AUSENCIAS</td>

              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>AÑO DE ESCOLARIDAD: SEXTO</td>
                <td>MES</td>
                <td colspan="5">FEBRERO - MARZO - ABRIL</td>

              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>TRIMESTRE: 1</td>
                <td class="vertical">FECHA</td>
                <td class="vertical">2020-03-12</td>
                <td class="vertical">2020-03-12</td>
                <td class="vertical">2020-03-12</td>
                <td class="vertical">2020-03-12</td>
                <td class="vertical">2020-03-12</td>
                <td class="vertical" rowspan="2">C/L</td>
                <td class="vertical" rowspan="2">S/L</td>
              </tr>
              <tr>
                <td>Nro.</td>
                <td colspan="2">APELLIDOS Y NOMBRES</td>
                <td>L</td>
                <td>M</td>
                <td>M</td>
                <td>J</td>
                <td>V</td>


              </tr>
            </thead>

            <tbody id="campos">

              <tr>

                  <td>1</td>

                  <td colspan="2">Paz Luz</td>

                  <td>P</td>

                  <td>P</td>

                  <td>P</td>

                  <td>P</td>

                  <td>P</td>

                  <td>3</td>

                  <td>3</td>

                  <td>3</td>

              </tr>

            </tbody>

          </table>
          <div class="div-print">
            <button class="btn-print" onclick="imprimir();">Imprimir</button>
          </div>
        </div> <!-- Contenedor de la tabla -->

      </div> <!-- Cierre de la tabla -->
    </div>

  </div>



<script>

  $(document).ready(function() {

    $('#seleccionar_curso').select2( { width: '100%'} );

    $('#seleccionar_materia').select2( { width: '100%'} );

  });

</script>



<script src="js/cuaderno_pedagogico_doc2.js?v=<?php echo(rand());?>"></script>

</body>

</html>