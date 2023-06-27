<!DOCTYPE html>
<html lang="es" xml:lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AIZAMA: COLEGIO PARTICULAR</title>
  <!-- Sweet Alert -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.0.7/sweetalert2.min.css" integrity="sha512-iuMkf48pM/TdH5DQkNPLWPLIUsVCncQEpuxgcMq/oDmJepdFcu48Wy4MwXggN9WFb4L6rpXQf5YJE/+OXkM1Lw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/11.0.7/sweetalert2.min.js" integrity="sha512-1rpALX1Q6mFmsO/GA4pim2GBgjev84Fjfql6Xj8HvJGbyh3zSxGXtOtCZF9k77eVTJZmXvxp3ApFSN2I6KM00g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/hamburgers/1.1.3/hamburgers.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous">
  <link rel="stylesheet" href="main.css?v="<?php echo(rand());?>">
</head>
<body class="body-perfil" >
  <header class="site-header">
    <div class="container">
      <div class="barra">
        <div class="logotipo">
          <a href="index.php">
            <img src="images/logo.png"
                alt="Logotipo del Colegio" 
                width="130px"              
                height="120px">
            <!--img
                src="images/logo_monte-a.png"
                alt="Logo Colegio Aizama"
                width="120"
                height="120"-->
          </a>
        </div>
        <?php include_once 'navegacion.php' ?>
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