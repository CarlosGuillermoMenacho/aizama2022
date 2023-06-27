<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <title>Menú Docente</title>
  <link rel="stylesheet" href="css/estiloDoc.css">
  <link rel="stylesheet" href="fonts/style.css">
  <link rel="stylesheet" href="node_modules/sweetalert2/dist/sweetalert2.css" >
  <script src="node_modules/sweetalert2/dist/sweetalert2.all.min.js" ></script>
  <script src="js/jquery.min.js"></script>
  <script src="js/main.js?v=<?php echo(rand()); ?>"></script>
</head>
<body>
<header>
        <div class="menu_bar">
      <a href="#" class="bt-menu">
        <span id="user">
          <strong><?=$_SESSION['app_user_ape'];?></strong>
          <strong><?=$_SESSION['app_user_nom'];?></strong>
        </span>
        <div>Menú Principal<span class="icon-menu" id="btn-menu"></span></div>
      </a>
    </div>
 
    <nav>
      <ul>
        <li><a href="calendario_doc.php" ><span class="icon-list"></span>Calendario</a></li>
        <li><a href="https://us02web.zoom.us/j/3891985549?pwd=OCtMSWlKRHlhcC9iaFdHQzZiRkpOZz09" ><span class="icon-open-book"></span>Evento en línea</a></li>
        <li class="submenu">
          <a href="#"><span class="icon-laptop"></span>Registro (E/S)<span class="caret icon-chevron-down"></span></a>
          <ul class="children">
            <li><a href="#" id="R1">Entrada<span class="icon-dot"></span></a></li>
            <li><a href="#" id="R2">Salida<span class="icon-dot"></span></a></li>
          </ul>
        </li>
        <li class="submenu">
          <a href="#"><span class="icon-video"></span>Rol de Exámenes<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="ROLE1">Primer Trimestre</a></li>
            <li><a href="#" id="ROLE2">Segundo Trimestre</a></li>
            <li><a href="#" id="ROLE3">Tercer Trimestre</a></li>
          </ul>
        </li>
        <li class="submenu">
          <a href="#"><span class="icon-video"></span>Mejores Notas<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="MCAL1">Primer Trimestre</a></li>
            <li><a href="#" id="MCAL2">Segundo Trimestre</a></li>
            <li><a href="#" id="MCAL3">Tercer Trimestre</a></li>
          </ul>
        </li>
        <li><a href="vista_devocional.php" ><span class="icon-open-book"></span>Devocional</a></li>
        <li><a href="practicar_profe.php"><span class="icon-mobile"></span>Práctica Exámen</a></li>
        <li><a href="lista_usuario_clave.php"><span class="icon-mobile"></span>Lista de usuarios y clave</a></li>
        <li><a href="planificacion_doc.php" ><span class="icon-list"></span>Planificaci&oacute;n de Actividades</a></li>
        <li><a href="preinscripcion_doc.php"><span class="icon-list"></span>Pre - Inscripciones</a></li>
        <li><a href="alu_plataforma.php"><span class="icon-list"></span>Verificar Alumnos</a></li>
        <li><a href="cev_prof.php"><span class="icon-list"></span>Clase en Vivo</a></li>
        <li><a href="#" id="ad"><span class="icon-mobile"></span>Agenda Digital</a></li>
        <li><a href="#" id="va"><span class="icon-open-book"></span>Ver Agenda</a></li>
        <li class="submenu">
          <a href="#"><span class="icon-laptop"></span>Clase Virtual<span class="caret icon-chevron-down"></span></a>
          <ul class="children">
            <li><a href="#" id="CV1">Primer Trimestre <span class="icon-dot"></span></a></li>
            <li><a href="#" id="CV2">Segundo Trimestre <span class="icon-dot"></span></a></li>
            <li><a href="#" id="CV3">Tercer Trimestre <span class="icon-dot"></span></a></li>
          </ul>
        </li>
        <li class="submenu">
          <a href="#"><span class="icon-video"></span>Material de apoyo<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="MaterialApoyo1">Primer Trimestre</a></li>
            <li><a href="#" id="MaterialApoyo2">Segundo Trimestre</a></li>
            <li><a href="#" id="MaterialApoyo3">Tercer Trimestre</a></li>
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
          <a href="#"><span class="icon-edit"></span>Prácticos<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="P1">Primer Trimestre</a></li>
            <li><a href="#" id="P2">Segundo Trimestre</a></li>
            <li><a href="#" id="P3">Tercer Trimestre</a></li>
          </ul>
        </li>
        
        <li class="submenu">
          <a href="#"><span class="icon-edit"></span>Reportes Cuaderno Pedagógico<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="ReporteCuadernoPedagogico1">Primer Trimestre</a></li>
            <li><a href="#" id="ReporteCuadernoPedagogico2">Segundo Trimestre</a></li>
            <li><a href="#" id="ReporteCuadernoPedagogico3">Tercer Trimestre</a></li>
          </ul>
        </li>
        
        <li class="submenu">
          <a href="#"><span class="icon-edit"></span>Prácticos Web<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="PracticoWeb1">Primer Trimestre</a></li>
            <li><a href="#" id="PracticoWeb2">Segundo Trimestre</a></li>
            <li><a href="#" id="PracticoWeb3">Tercer Trimestre</a></li>
          </ul>
        </li>
        
        
        <li class="submenu">
          <a href="#"><span class="icon-documents"></span>Evaluación de Selección<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="E1">Primer Trimestre</a></li>
            <li><a href="#" id="E2">Segundo Trimestre</a></li>
            <li><a href="#" id="E3">Tercer Trimestre</a></li>
          </ul>  
        </li>
        <li class="submenu">
          <a href="#"><span class="icon-documents"></span>Evaluación Escrita<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="EE1">Primer Trimestre</a></li>
            <li><a href="#" id="EE2">Segundo Trimestre</a></li>
            <li><a href="#" id="EE3">Tercer Trimestre</a></li>
          </ul>  
        </li>
        <li class="submenu">
          <a href="#"><span class="icon-documents"></span>Evaluación Mixta<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="EM1">Primer Trimestre</a></li>
            <li><a href="#" id="EM2">Segundo Trimestre</a></li>
            <li><a href="#" id="EM3">Tercer Trimestre</a></li>
          </ul>
        </li>
        <li><a href="reuniones_doc.php"><span class="icon-laptop"></span>Reuniones</a></li>
        <li class="submenu">
          <a href="#"><span class="icon-text-document"></span>Nota Ser y Decidir<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="NSD1">Primer Trimestre</a></li>
            <li><a href="#" id="NSD2">Segundo Trimestre</a></li>
            <li><a href="#" id="NSD3">Tercer Trimestre</a></li>
          </ul>
        </li>
         <li class="submenu">
          <a href="#"><span class="icon-text-document"></span>Auto Evaluaciones<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="AE1">Primer Trimestre</a></li>
            <li><a href="#" id="AE2">Segundo Trimestre</a></li>
            <li><a href="#" id="AE3">Tercer Trimestre</a></li>
          </ul>
        </li>
        <li class="submenu">
          <a href="#"><span class="icon-text-document"></span>Notas<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="N1">Primer Trimestre</a></li>
            <li><a href="#" id="N2">Segundo Trimestre</a></li>
            <li><a href="#" id="N3">Tercer Trimestre</a></li>
          </ul>
        </li>
        <!--li class="submenu">
          <a href="#"><span class="icon-text-document"></span>Generar Notas Trimestrales<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="GEN1">Primer Trimestre</a></li>
            <li><a href="#" id="GEN2">Segundo Trimestre</a></li>
            <li><a href="#" id="GEN3">Tercer Trimestre</a></li>
          </ul>
        </li-->
        <li class="submenu">
          <a href="#"><span class="icon-new-message"></span>Exámenes<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="#" id="EX1">Primer Trimestre</a></li>
            <li><a href="#" id="EX2">Segundo Trimestre</a></li>
            <li><a href="#" id="EX3">Tercer Trimestre</a></li>
          </ul>
        </li>
        <li><a href="send_msg_multimedia_doc.php" id=""><span class="icon-open-book"></span>Mensajes Multimedia</a></li>
        <li><a href="biblioteca.php" id=""><span class="icon-open-book"></span>Biblioteca</a></li>
        <li><a href="registro_libros.php" id=""><span class="icon-open-book"></span>Gestionar Biblioteca</a></li>
        <li><a href="#" id="LU"><span class="icon-list"></span>Lista de Utiles</a></li>
         <li><a href="eventos_doc.php" ><span class="icon-list"></span>Actividades</a></li>
        <li><a href="#" id="CC"><span class="icon-mobile"></span>Cambiar Contraseña</a></li>
        <li><a href="#" id="eel"><span class="icon-video"></span>Evento en linea</a></li>
        <li><a href="#" id="salir"><span class="icon-cross"></span>Salir</a></li>
      </ul>
    </nav>
  </header>
  <section id="wraper">
    
