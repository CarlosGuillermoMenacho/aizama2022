<?php
session_start();
if($_SESSION['app_user_perfil'] == 'SECUNDARIA') {
    require 'header_sec.php';
} 
if($_SESSION['app_user_perfil'] == 'PRIMARIA' || $_SESSION['app_user_perfil'] == 'INICIAL' ) {
  require 'header_prim.php';
} 
?>
<link rel="stylesheet" type="text/css" href="css/informativo.css?v=<?php echo rand()?>">
<div class="div-fecha">
  
</div>
<div class="main-container">
  <!--div class="div-section">
    <h3>Avance de Contenidos</h3>
    <div class="div-practico-info">
      <div class="div-img">
        <img src="svg/avances.png">
      </div>
      <div class="practicos">
        <div class="practico">
          <h3>Química</h3>
          <p class="descripcion">
            Nomeclatura de los Oxácidos
          </p>
        </div>
        <div class="practico">
          <h3>Biología</h3>
          <p class="descripcion">
            Propiedades de ácidos nucleicos y vitaminas
          </p>
        </div>
      </div>

    </div>
  </div>
  <div class="div-section">
    <h3>Prácticos</h3>
    <div class="div-practico-info">
      <div class="div-img">
        <img src="svg/practico.png">
      </div>
      <div class="practicos">
        <div class="practico">
          <h3>Matemáticas</h3>
          <p class="descripcion">
            Realizar el cuestionario de la Pág. 30 y el mapa conceptual de la 31: A practicar.
          </p>
        </div>
        <div class="practico">
          <h3>Química</h3>
          <p class="descripcion">
            Realizar las actividades de las Pág. 62 a 65: Función Hidróxidos
          </p>
        </div>
        <div class="practico">
          <h3>Biología</h3>
          <p class="descripcion">
            Realizar una presentación en PPT de Biomoléculas Orgánicas. (Exposición)
          </p>
        </div>
      </div>

    </div>
  </div>
  <div class="div-section">
    <h3>Evaluaciones</h3>
    <div class="div-practico-info">
      <div class="div-img">
        <img src="svg/evaluaciones.png">
      </div>
      <div class="practicos">
        <div class="practico">
          <h3>Matemáticas</h3>
          <p class="descripcion">
            Realizar el cuestionario de la Pág. 30 y el mapa conceptual de la 31: A practicar.
          </p>
        </div>
        <div class="practico">
          <h3>Química</h3>
          <p class="descripcion">
            EvaluaciÃ³n Leyes volumÃ©tricas. Lea atentamente, razone y elija la opciÃ³n correcta. Buena suerte !!! Inicio de actividad: Jueves 22 de Junio desde las 23:00:00 hrs.
          </p>
        </div>
        <div class="practico">
          <h3>Biología</h3>
          <p class="descripcion">
            EvaluaciÃ³n Salud Sexual e Integral Humana. Lea atentamente, razone y seleccione la opciÃ³n correcta. Buena suerte !!! Inicio de actividad: Jueves 22 de Junio desde las 23:00:00 hrs.
          </p>
        </div>
      </div>

    </div>
  </div-->
</div>
<div class="div-calendario show-calendar oculto">
    <div class="btn-close">
          <img src="images/close.svg" onclick="close_form();">
      </div><table class="table-calendario">
    
      <thead>
        <tr>
          <td colspan="7">
            <div class="button-meses">
              <div id="mes-ant" class="mes-button" onclick="mes_anterior();">Junio</div>
              <div id="mes-act" colspan="5" style="padding:10px 20px; font-size:1.4em;">Julio</div>
              <div id="mes-sig" class="mes-button" onclick="mes_siguiente();">Agosto</div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="border-top">LU</td>
          <td class="border-td">MA</td>
          <td class="border-td">MI</td>
          <td class="border-td">JU</td>
          <td class="border-td">VI</td>
          <td class="border-td">SA</td>
          <td class="border-td">DO</td>
        </tr>
      </thead>
      <tbody id="body-calendario"></tbody>
    </table>
  </div>
<div class="calendar-icon">
  <img src="img/calendario.png" onclick="calendar_show();">
</div>
<script type="text/javascript" src="js/informativo.js?v=<?php echo rand();?>"></script>