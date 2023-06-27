<?php
session_start();
require 'includes/config.php';
if($_SESSION['app_user_id']==16){
    require 'header_dir.php';
}else{
    require 'header_adm.php';
}
$_SESSION['app_bimestre'] = 1;
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gestion</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" />
  <link rel="stylesheet" href="css/style_gestion.css">
</head>
<body>
  <div class="contenedor">
    <div class="box-contenedor">
      <div class="contenedor-gestion">
        <div class="contenedor-image">
          <img src="images/logo.png" alt="Icono del colegio Aizama" style="height:200px;" >
        </div>
        <h1 style="color:#043c5c;">Asignacion de materias</h1>
        <h2 style="color:#006581;">Elige la gestion</h2>
        <nav class="navegacion">
          
          <a href="reg_prof_cur_mat.php?id=2021">
            Gestion 2021
          </a>
          <a href="reg_prof_cur_mat.php?id=2022">
            Gestion 2022    
          </a>
          <a href="reg_prof_cur_mat.php?id=2023">
            Gestion 2023    
          </a>
        </nav>
      </div>
    </div>
  </div>
</body>
</html>
<?php 
require 'footer.php';
?>