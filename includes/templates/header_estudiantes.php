<!DOCTYPE html>
<html lang="es" xml:lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AIZAMA: COLEGIO PARTICULAR</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/hamburgers/1.1.3/hamburgers.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous">
  <link rel="stylesheet" href="../main.css?v="<?php echo(rand());?>">
</head>
<body class="body-perfil" >
  <header class="site-header">
    <div class="container">
      <div class="barra">
        <div class="logotipo">
          <a href="../index.php">
            <img src="images/logo.png"
                alt="Logotipo del Colegio" 
                width="130px"              
                height="120px">
            <!--img
                src="../images/logo_monte-a.png"
                alt="Logo Colegio Aizama"
                width="170"
                height="120"-->
          </a>
        </div>
        <?php include_once 'navegacion_estudiantes.php' ?>
      </div>
    </div>
  </header>
  
  <button class="boton-hamburger hamburger hamburger--collapse" type="button">
      <span class="hamburger-box">
          <span class="hamburger-inner"></span>
      </span>
  </button>
  <a class="scrollTop" href="#">
      <img src=images/top.svg>
    </a>