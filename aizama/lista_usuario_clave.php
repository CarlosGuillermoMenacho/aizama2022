<?php
session_start();
require 'includes/config.php';
require 'includes/functions.php';
if(!cliente_activo()){
    header("Location: docentes.php");
    exit();
}
require 'header.php';
$_SESSION['app_bimestre'] = 1;
$id_usr = $_SESSION['app_user_id'] ;
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agenda Estudiantil</title>
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet">
  <script type="text/javascript" src="js/jquery.min.js"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" />
  <link rel="stylesheet" href="css/style_asignacion_videos.css">
</head>
<body>

  <div class="container">
      <h1 style="text-align:center">Lista de Usuario y clave</h1>
      <input type="hidden" name="id_usr" id="id_usr" value="<?=$_SESSION['app_user_id'];?>" readonly="readonly" size="3">  
      <div class="selects-agenda-digital" style="max-width:500px; margin:0 auto;">
        <div class="select-curso">
          <label class="no-margin">CURSO</label>
          <div class="custom-select" >
            <select name="slccurso" id="seleccionar_curso">
              <option value="0" selected>-- Seleccione un curso --</option>
            </select>        
          </div>
        </div>
      </div>
  </div>

  <!-- Tabla general -->
  <div class="contenedor-tables" style="margin-top:15px">
    <div class="contenedor-table-general">
      <table class="table">
        <thead>
          <th>Nro</th>
          <th>Usuario</th>
          <th>Clave</th>
          <th>Nombre</th>
        </thead>
        <tbody id=campos>
          
        </tbody>
      </table>
    </div>
  </div>


  <script type="text/javascript">
    $("#seleccionar_curso").select2( {width: '100%'} );  
  </script> 
  <script type="text/javascript" src="js/lista_usuarios.js"></script>
</body>
</html>