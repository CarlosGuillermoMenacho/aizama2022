<?php
session_start();
if($_SESSION['app_user_id']==16){
    require 'header_dir.php';
}else{
    require 'header_adm.php';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ASIGNACION MATERIA CURSOS</title>
  <link rel="stylesheet" href="node_modules/sweetalert2/dist/sweetalert2.css" >
  <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" />
  <link rel="stylesheet" href="css/style_asignar_materias_docente.css">
  
</head>
<body>
  <input type="hidden" name="gestion" id="gestion" value="<?=$_GET['id']?>">
  <div class="contenedor">
    <h1>Lista de materias del Colegio</h1>
    <div class="contenedor-selects">
      <div class="select">
        <label for="">docente</label>
        <select name="seleccionar_docente" id="seleccionar_docente">
          <option value=""> -- Seleccionar docente -- </option>
        </select>
      </div>
      <div class="select">
        <label for="">curso</label>
        <select name="seleccionar_curso" id="seleccionar_curso">
          <option value="">  -- Seleccionar curso -- </option>
        </select>
      </div>
      <div class="select">
        <label for="">paralelo</label>
        <select name="seleccionar_paralelo" id="seleccionar_paralelo">
          <option value="">  -- Seleccionar paralelo -- </option>
        </select>
      </div>
    </div>

    <div class="contenedor-lista">
      <h2>Lista de materias</h2>
      <div class="contenedor-lista-materias">
          <ul>
            <!--Aqui se carga dinamicamente -->
          </ul>
        
      </div>
          <div class="button-guardar">
      <button type="submit" class="btn" id="botonGuardar" name="botonGuardar">
        Guardar
      </button>
    </div>
    </div>
  

  </div>

  <script src="node_modules/sweetalert2/dist/sweetalert2.all.min.js" ></script>
  <script src="js/jquery.min.js" ></script>
  <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js"></script>
  <script type="text/javascript">
    $(document).ready(function() {
      $('#seleccionar_curso').select2();
      $('#seleccionar_docente').select2();
      $('#seleccionar_paralelo').select2();
    });
  </script>
  <script src="js/asignar_materia_docente.js"></script>
</body>
</html>