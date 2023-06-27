<!DOCTYPE html>
<html lang="es" xml:lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <meta name="keywords" content="COLEGIO, AIZAMA">
    <meta name="description" content="Colegio Particular Aizama cuenta con muchas disciplina y laboratorio de computacion y biologia. Ademas de una Agenda Digital y una Plataforma Web">
    <meta name="author" content="Jhonny Wilson Rodriguez Aizama">
    <title>AIZAMA COLEGIO PARTICULAR</title>
    <link rel="icon" type="image/vnd.microsoft.icon" href="/aizama_icono.ico">
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap"
      rel="stylesheet"
    >
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/hamburgers/1.1.3/hamburgers.min.css"
    >
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous">

    <link rel="stylesheet" href="main.css" >
  </head>
  <body>
    <header class="site-header main">
      <div class="container contenido-header">
        <div class="barra">
          <div class="logotipo">
            <a href="index.php">
              <img
                src="images/logo.png"
                alt="Logo Colegio Aizama"
                width="130"
                height="120">
              <img
                src="images/luto2.jfif"
                alt="Logo Colegio Aizama"
                width="90"
                height="120">
              <!--img
                src="images/logo_monte-a.png"
                alt="Logo Colegio Aizama"
                width="170"
                height="120"-->
                
            </a>
          </div>
          <?php include_once 'navegacion.php' ?>
        </div>
        <div class="titulo">
          <h1 class="no-margin">
            Pre-Inscripciones Abiertas<br/> <span> 2023</span>
          </h1>
          <p>
            Las Pre-Inscripciones para la gestión 2023 se encuentran abiertas,
            puedes realizarlo desde la opcion FAMILIA aqui en nuestra plataforma. Ven te esperamos. 
            UNIDAD EDUCATIVA PRIVADA:  AIZAMA
          </p>
          <a href="sobre_nosotros.php" class="boton-secundario">
            Sobre Nosotros
          </a>
          <a href="aizama/lista_de_utiles.php" class="boton-secundario">
            Lista de &uacute;tiles
          </a>
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