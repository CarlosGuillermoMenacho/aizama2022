<?php
session_start();
require"session_verify.php";
if ($_SESSION['app_user_nivel']=='portero'){
    require 'header_por.php';
}else{
    require 'header_adm.php';
}
?>
<link rel="stylesheet" type="text/css" href="css/fontColor.css?v=<?php echo rand()?>">
<link rel="stylesheet" type="text/css" href="css/deshabilitados.css?v=<?php echo rand()?>">
<link rel="stylesheet" type="text/css" href="css/components.css?v=<?php echo rand()?>">
<div class="container">
  <div class="titulo"><h1>Alumnos Inhabilitados</h1></div>
  <div class="div-search content-search oculto">
    <input type="text" value="" placeholder="Buscar..." onkeyup="search(this)">
    <div class="lista" id="lista">
      <div class="fila">
        <div class="nombre">
          
          Menacho Zárate Carlos Guillermo
        </div>
        <button class="btn-submit">Habilitar</button>
      </div>
      <div class="fila">
        <div class="nombre">
          Menacho Zárate Carlos Guillermo
        </div>
        <button class="btn-submit">Habilitar</button>
      </div>
      <div class="fila">
        <div class="nombre">
          Menacho Zárate Carlos Guillermo
        </div>
        <button class="btn-submit">Habilitar</button>
      </div>
    </div>
  </div>
  <div class="div-formulario oculto">
    <form id="formulario">
      <input type="hidden" id="codalu" name="codalu">
      <div class="titulo"><h2>Datos de habilitación</h2></div>
      <div class="lista">
      <div class="fila">
          <div class="nombre">
            Menacho Zárate Carlos Guillermo
          </div>
        </div>
      </div>
      <div class="div-select">
        <select name="codcur" id="seleccionar_curso">
          <option value="">Seleccione el curso...</option>
          <option value="1">NIDITO</option>
          <option value="2">POLLITO</option>
          <option value="3">PREKINDER</option>
          <option value="4">KINDER</option>
          <option value="5">PRIMERO DE PRIMARIA</option>
          <option value="6">SEGUNDO DE PRIMARIA</option>
          <option value="7">TERCERO DE PRIMARIA</option>
          <option value="8">CUARTO DE PRIMARIA</option>
          <option value="9">QUINTO DE PRIMARIA</option>
          <option value="10">SEXTO DE SECUNDARIA</option>
          <option value="11">PRIMERO DE SECUNDARIA</option>
          <option value="12">SEGUNDO DE SECUNDARIA</option>
          <option value="13">TERCERO DE SECUNDARIA</option>
          <option value="14">CUARTO DE SECUNDARIA</option>
          <option value="15">QUINTO DE SECUNDARIA</option>
          <option value="16">SEXTO DE SECUNDARIA</option>
        </select>
      </div>
      <div class="div-select">
        <select id="seleccionar_paralelo" name="codpar">
          <option value="">Seleccione el paralelo...</option>
          <option value="1">A</option>
          <option value="2">B</option>
          <option value="3">C</option>
          <option value="4">D</option>
          <option value="5">E</option>
          <option value="6">F</option>
        </select>
      </div>
      <div class="titulo"><h2>ACCESOS</h2></div>
      <div class="div-accesos">
        <div class="div-checkbox">
          Plataforma <input type="checkbox" name="plataforma">
        </div>
        <div class="div-checkbox">
          Evaluaciones <input type="checkbox" name="evaluacion">
        </div>
        <div class="div-checkbox">
          Boletín <input type="checkbox" name="boletin">
        </div>
      </div>
      <div class="div-btn">
        <button class="btn-danger btn-100" onclick="cancelar();">CANCELAR</button>
        <button class="btn-submit btn-100" onclick="habilitar()">ACEPTAR</button>  
      </div>
    </form>
  </div>
</div>
<script type="text/javascript" src="js/deshabilitados.js?v=<?php echo rand()?>"></script>