<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <title>Menú Primaria</title>
  <link rel="stylesheet" href="css/estiloDoc.css">
  <link rel="stylesheet" href="fonts/style.css">
  <script src="js/jquery.min.js"></script>
  <script src="js/main_prim2.js?v=<?php echo(rand()); ?>"></script>
    <link rel="stylesheet" href="node_modules/sweetalert2/dist/sweetalert2.css" >
  <script src="node_modules/sweetalert2/dist/sweetalert2.all.min.js" ></script>
</head>
<body>
<header>
    <div class="menu_bar">
      <a href="#" class="bt-menu">
        <span class="imgUser"><img src="<?=$_SESSION['foto'];?>" alt=""/></span>
        <span id="user">
          <strong>
            <?=$_SESSION['app_user_name'];?>
          </strong>
        </span>
        <div>Menú Principal<span class="icon-menu" id="btn-menu"></span></div>
      </a>
    </div>
 
    <nav>
      <ul>
       <li><a href="https://us02web.zoom.us/j/3891985549?pwd=OCtMSWlKRHlhcC9iaFdHQzZiRkpOZz09" ><span class="icon-open-book"></span>Evento en línea</a></li>
        <li><a href="#" id="s_c"><span class="icon-check"></span>Salida de clases</a></li>
        <li><a href="#" id="cv"><span class="icon-video"></span>Clase en Vivo</a></li>
        <?php 
            if ($_SESSION['app_user_perfil']!='INICIAL') {
              echo '<li><a href="#" id="ad"><span class="icon-mobile"></span>Practica de examen</a></li>';
            }
        ?>
        <li><a href="horario_alumno.php" id=""><span class="icon-mobile"></span>Horario de clases</a></li>
        <li><a href="biblioteca.php" id=""><span class="icon-open-book"></span>Biblioteca</a></li>
        <li><a href="devocional_alu.php" ><span class="icon-open-book"></span>Devocional</a></li>
       
    <!--<li class="submenu">
          <a href="#"><span class="icon-laptop"></span>Clase Virtual<span class="caret icon-chevron-down"></span></a>
          <ul class="children">
            <li><a href="#" id="CV1">Primer Trimestre <span class="icon-dot"></span></a></li>
            <li><a href="#" id="CV2">Segundo Trimestre <span class="icon-dot"></span></a></li>
            <li><a href="#" id="CV3">Tercer Trimestre <span class="icon-dot"></span></a></li>
          </ul>
        </li>-->
        <li class="submenu">
          <a href="#"><span class="icon-laptop"></span>Material Apoyo<span class="caret icon-chevron-down"></span></a>
          <ul class="children">
            <li><a href="#" id="Material1">Primer Trimestre <span class="icon-dot"></span></a></li>
            <li><a href="#" id="Material2">Segundo Trimestre <span class="icon-dot"></span></a></li>
            <li><a href="#" id="Material3">Tercer Trimestre <span class="icon-dot"></span></a></li>
          </ul>
        </li>
        <li class="submenu">
          <a href="#"><span class="icon-video"></span>Clases Grabadas<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="Video1">Primer Trimestre</a></li>
            <li><a href="#" id="Video2">Segundo Trimestre</a></li>
            <li><a href="#" id="Video3">Tercer Trimestre</a></li>
          </ul>
        </li>
        <li class="submenu">
          <a href="#"><span class="icon-laptop"></span>Auto Evaluaciones<span class="caret icon-chevron-down"></span></a>
          <ul class="children">
            <li><a href="#" id="AutoEval1">Primer Trimestre <span class="icon-dot"></span></a></li>
            <li><a href="#" id="AutoEval2">Segundo Trimestre <span class="icon-dot"></span></a></li>
            <li><a href="#" id="AutoEval3">Tercer Trimestre <span class="icon-dot"></span></a></li>
          </ul>
        </li>
        <?php 
           if ($_SESSION['app_user_perfil']!='INICIAL') {
            echo '<li class="submenu">
          <a href="#"><span class="icon-edit"></span>Prácticos<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="P1">Primer Trimestre</a></li>
            <li><a href="#" id="P2">Segundo Trimestre</a></li>
            <li><a href="#" id="P3">Tercer Trimestre</a></li>
          </ul>
        </li>
        <li class="submenu">
          <a href="#"><span class="icon-documents"></span>Examen / Selección (5 preguntas)<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="E1">Primer Trimestre</a></li>
            <li><a href="#" id="E2">Segundo Trimestre</a></li>
            <li><a href="#" id="E3">Tercer Trimestre</a></li>
          </ul>  
        </li>
        <li class="submenu">
          <a href="#"><span class="icon-documents"></span>Examen Escrito<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <input id="examen" type="hidden" value="'.$_SESSION['usrimple'].'" />
            <li><a href="#" id="EE1">Primer Trimestre</a></li>
            <li><a href="#" id="EE2">Segundo Trimestre</a></li>
            <li><a href="#" id="EE3">Tercer Trimestre</a></li>
          </ul>  
        </li>
        <li class="submenu">
          <a href="#"><span class="icon-documents"></span>Examen / Selección (10 preguntas)<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="ES1">Primer Trimestre</a></li>
            <li><a href="#" id="ES2">Segundo Trimestre</a></li>
            <li><a href="#" id="ES3">Tercer Trimestre</a></li>
          </ul>  
        </li>
        <li class="submenu">
          <a href="#"><span class="icon-documents"></span>Evaluaciones Mixtas<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="Em1">Primer Trimestre</a></li>
            <li><a href="#" id="Em2">Segundo Trimestre</a></li>
            <li><a href="#" id="Em3">Tercer Trimestre</a></li>
          </ul>  
        </li>
        ';
           }
        ?>
        
        <li><a href="reuniones_alu.php"><span class="icon-laptop"></span>Reuniones</a></li>
        <li><a href="#" id="BN"><span class="icon-mobile"></span>Boletin de Notas</a>
        <strong>
          <input id="examen" type="hidden" value="<?=$_SESSION['usrimple'];?>" />
          </strong><strong>
          <input id="boletin" type="hidden" value="<?=$_SESSION['bdesktop'];?>" />
          </strong></li>
        
        <?php 
          if ($_SESSION['app_user_perfil']!='INICIAL') {
            echo '<li><a href="#" id="CC"><span class="icon-key"></span>Cambiar Contraseña</a></li>';
          }
        ?>
        
        <!--li><a href="libro_materias.php" id="CC"><span class="icon-open-book"></span>Libros Digitales</a></li-->
        <li><a href="#" id="eel"><span class="icon-video"></span>Evento en linea</a></li>
        <li><a href="calendario.php" id="calendar"><span class="icon-check"></span>Calendario</a></li>
        <li><a href="#" id="salir"><span class="icon-cross"></span>Salir</a></li>
      </ul>
    </nav>
  </header>
  <section id="wraper">
    
