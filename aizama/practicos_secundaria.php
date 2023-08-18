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

<link rel="stylesheet" href="node_modules/sweetalert2/dist/sweetalert2.css">
<script src="node_modules/sweetalert2/dist/sweetalert2.all.min.js"></script>
  <!-- Normalize -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" />
  <!-- Estilos css -->
<link rel="stylesheet" href="css/style_clases_virtuales.css">

<style>
    .archivo label {
      width: 100%;
      display: block;
      font-weight: bold;
    }
    .archivo input {
      opacity: 0;
      position: absolute;
      z-index: -1;
    }
    #campos button {
      border:none;
      background:none;
    }
    .subir-practicos label {
      display:block;
      text-transform:uppercase;
      font-weight:bold;
    }
    .subir-practicos input[type="text"], textarea {
      width:100%;
      background-color:#e1e1e1;
      border:none;
      border-radius:3px;
      padding:10px;
    }
    .subir-practicos h3 {
      font-weight:normal;
      margin-bottom:15px;
    }
    .subir_practico_input {
      margin-bottom:15px;
    }
    .buttons button {
      margin:0;
    }
    .contenedor {
      max-width:800px;
      margin:0 auto;
    }
    .descripcion-practico {
      max-width:100%;
    }
    @media( min-width: 1024px ) {
      .descripcion-practico {
        max-width:450px;
      } 
    }
</style>

	<input type="hidden" name="id_usr" id="id_usr" value="<?=$_SESSION['app_user_id'];?>" readonly="readonly" size="3">
	<input type="hidden" name="id_nombre" id="id_nombre" value="<?=$_SESSION['app_user_name'];?>" readonly="readonly" size="3">

<input type="hidden" id="codalumno" value="<?php echo($_SESSION['app_user_id']);?>" >
  <div class="titulos">
  <h1>Prácticos / task</h1>
  <h2 style="padding: 0px;" class="elija">Elija una materia / Choose a subject</h2>
  </div>
  <div class="contenedor-principal-table-lista">
    <!-- Tabla de materias -->
    <div class="contenedor-lista">
      <h2 class="titulo-lista">Lista de materias / List of subjects</h2>
      <ul class="lista-materias">
        <!-- Se cargaran dinamicamente las materias -->
      </ul>
    </div>

    <div class="contenedor-tabla-button">  
      <!-- Practicos -->
      <div class="contenedor-table">
        <table class="table">
          <thead>
            <tr>
              <th>Nro</th>
              <th>Descripci&oacute;n</th>
              <th>Ver</th>
              <th>Subir</th>
              <th>Nota</th>
              <th>Fecha de registro</th>
              <th>Fecha L&iacute;mite de presentaci&oacute;n</th>
              <th>Práctico presentado</th>
              <th>Pr&aacute;ctico presentado en fecha</th>
              <th>Observación</th>
            </tr>
          </thead>
          <tbody id = "campos">
            <!-- Se cargaran dinamicamente -->
          </tbody>
        </table>
        <button class="btn" onclick="volverAtras()">Atras</button>
      </div>
      <!-- Pregunta de los practicos -->
      <div class="contenedor-table-practicos" style="display:none;">
        <table class="table">
          <thead>
            <tr>
              <th>Nro</th>
              <th>Descripción</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody id="camposPreguntas">
            <!-- Se cargaran dinamicamente las preguntas del practico -->
          </tbody>
        </table>
        <div style="display:flex; justify-content:center;">
          <button class="btn" style="margin-bottom:10px;" onclick="volverAtrasPractico()">Atras</button>
        </div>
      </div>
    </div>

  </div>

  <div class="contenedor-no-classe">
    <div class="contenedor-imagen">
      <img src="images/no-tiene-clases.svg" alt="No clases">
    </div>
    <h2>No tiene prácticos asignadas en este momento</h2>
    <div class="boton-atras" style="margin-bottom:15px">
      <button class="btn" onclick="volverAtras()">Atras</button>
    </div>
  </div>
  
  <div style="display:none;" class="subir-practicos contenedor">
    <h2 class="nombre_materia" style="margin:15px;"></h2>
    <div class="subir_practico_input">
      <label>Descripicion:</label>
      <textarea id="descripcion_practico" rows="4" disabled></textarea>
    </div>
    <div class="subir_practico_input">
      <label>Presentación:</label>
      <input type="text" id="presentacion_practico" disabled>
    </div>
    
    <div class="practico-subido">
      <h3>Ya has subido un práctico</h3>
      <div class="img-practico-subido">
        <a href="" target="_blank">
          <img src="images/icon_document.svg" height="80px;" alt="icono"/>
        </a>
      </div>
    </div>

    <div class="tipo-archivo">
      <form enctype="multipart/form-data" action="" method="post" name="fileinfo">
  
      <div class="archivo_pdf" style="margin:15px 0;">
        <h3>Elige un nuevo archivo</h3>
        <button class="btn" style="margin:0;" id="mostrarArchivo">Archivo</button>
        <div class="cargarArchivoPdf" style="display:none;">
          <input type="file" id="arch" name="file">
        </div>
      </div>
      <div class="enlace" style="margin:15px 0;">
        <h3>O también puedes ingresar un enlace a tu archivo (puede estar alojado en google drive)</h3>
        <button class="btn" style="margin:0;" id="mostrarEnlace">Enlace</button>
        <div class="cargarEnlace" style="display:none;">
          <label for="">Enlace:</label>
          <input type="text" name="enlace" placeholder="Ejemplo https://drive.google.com/drive/">

          
        </div>
        <input type="hidden" id="type" name="tipo" value="">
        <input type="hidden" id="codigoPractico" name="idpractico" value="">
      </div>
      </form>
    </div>
    <div class="buttons" style="display:flex; justify-content:center; margin:15px 0;">
      <button class="btn" style="margin-right:15px;" onclick="guardarTipoArchivo()">Guardar</button>
      <button class="btn" id="volverTablaPractico">Cancelar</button>
    </div>
    <div class="buttons" style="display:flex; justify-content:center; margin:15px 0;">
      Si tienes problemas para subir tu práctico click:&nbsp; <a href="#" onclick="enviarArchivo()"> aquí</a>
    </div>
  </div>

<script>
  $(document).ready(function() {
    
    $('#mostrarArchivo').click( function(e) {
        e.preventDefault();
      $('#type').val(1);
      $('.cargarEnlace input').val('');
      $('.cargarArchivoPdf input').val('');
      $('#mostrarEnlace').css("display", "block");
      $('.cargarEnlace').css("display", "none");
      $('#mostrarArchivo').css("display", "none");
      $('.cargarArchivoPdf').css("display", "block");
    });

    $('#mostrarEnlace').click( function(e) {
        e.preventDefault();
      $('#type').val(2);
      $('.cargarArchivoPdf input').val('');
      $('.cargarEnlace input').val('');
      $('#mostrarArchivo').css("display", "block");
      $('.cargarArchivoPdf').css("display", "none");
      $('#mostrarEnlace').css("display", "none");
      $('.cargarEnlace').css("display", "block");
    });
    
    
  });
</script>
<script type="text/javascript" src="js/app_practicos.js?v=<?php echo(rand()); ?>"></script>
