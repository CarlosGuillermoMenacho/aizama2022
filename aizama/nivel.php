<?php 
$page = 'perfil'; 
include_once '../includes/templates/header_estudiantes.php'; 

?>
  <style>
      .videos {
          max-width:1300px;
          margin:0 auto;
          margin-bottom:25px;
          justify-content: center;
          text-align:center;
          vertical-align: 0%;
       
      }
      .videos a {
        position: relative;
        text-decoration:none;
        color:white;
        background-color:teal;
        padding:3px 30px;
        border-radius:5px;
        margin-right:10px;
        
      }
  </style>
  <main class="perfil">
    <div class="container section container-perfil">
      <h1 class="centrar-texto no-margin">Bienvenido</h1>
      <h2 class="centrar-texto no-margin">Elije el nivel en el que estas</h2>
      <div class="contenedor-card container-card-perfil">        
          <div class="contenido-card">
            <!--a href="aizama/mantenimiento.php"-->
                <a href="usuario.php">
              <img src="images/inicial.png" alt="Inicial Ingreso" width="280" height="280">
            </a>
          </div>
          <div class="contenido-card">
            <a href="usuario.php">
              <img src="images/primaria.png" alt="Primaria Ingreso" width="280" height="280">
            </a>
          </div>
          <!--<div class="contenido-card">
            <a href="http://www.aizama.net/aizama/menu_familia.php">
              <img src="images/familia.svg" alt="Familia Aizama Ingreso" width="280" height="280">
            </a>
          </div>-->
          <div class="contenido-card">
            <a href="usuario.php">
              <img src="images/secundaria.png" alt="Secundaria Ingreso" width="280" height="280">
            </a>
          </div>
      </div>
    </div>
  </main>
  <script src="js/main_nivel.js" type="module"></script>
</body>
</html>