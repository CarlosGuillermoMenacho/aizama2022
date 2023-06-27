<!DOCTYPE html>

<html lang="es">

<head>

  <meta charset="UTF-8">

  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">

  <title>Menú Dirección</title>

  <link rel="stylesheet" href="css/estiloDoc.css">

  <link rel="stylesheet" href="fonts/style.css">

  <script src="js/jquery.min.js"></script>

  
    <link rel="stylesheet" href="node_modules/sweetalert2/dist/sweetalert2.css" >
  <script src="node_modules/sweetalert2/dist/sweetalert2.all.min.js" ></script>

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
        <!--li><a href="https://us02web.zoom.us/j/88392444521?pwd=SWwyRFE5SXlSWFU3MzZjOW9YOWd2dz09" ><span class="icon-open-book"></span>Desfile Cívico</a></li-->
        <li><a href="practicar_examen_adm.php"><span class="icon-mobile"></span>Practicar Examen</a></li>
        <li><a href="biblioteca.php"><span class="icon-mobile"></span>Biblioteca Digital</a></li>
        <li><a href="agenda_dir.php"><span class="icon-mobile"></span>Agenda Digital</a></li>
        <li><a href="lista_usuario_clave_adm.php"><span class="icon-mobile"></span>Lista Usuarios y Clave</a></li>
        <li class="submenu">
          <a href="#"><span class="icon-new-message"></span>Registro Ingreso/Salida<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="ingresoQR.php" id="boletin_Adm1">Ingreso</a></li>
            <li><a href="salidaQR.php" id="boletin_Adm2">Salida</a></li>
          </ul>
        </li>
        <li class="submenu">
          <a href="#"><span class="icon-new-message"></span>Reportes<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="reportes_dir.php">Lista De Tutores</a></li>
          </ul>
        </li>
        <li class="submenu">

          <a href="#"><span class="icon-new-message"></span>Cuaderno Pedag&oacute;gico<span class="caret icon-chevron-down"></a>

          <ul class="children">

            <li><a href="#" id="cuader_Adm1">Primer Trimestre</a></li>

            <li><a href="#" id="cuader_Adm2">Segundo Trimestre</a></li>

            <li><a href="#" id="cuader_Adm3">Tercer Trimestre</a></li>

          </ul>

        </li>
        <li><a href="planificacion_dir.php"><span class="icon-document"></span>Planificaci&oacute;n de Actividades</a></li>
        <li><a href="ver_agenda_adm.php"><span class="icon-open-book"></span>Ver Agenda</a></li>

        <!--<li><a href="boletin_adm.php"><span class="icon-document"></span>Boletin de notas</a></li>-->

        

    	<li class="submenu">

          <a href="#"><span class="icon-new-message"></span>Centralizador<span class="caret icon-chevron-down"></a>

          <ul class="children">

            <li><a href="#" id="BA1">Primer Trimestre</a></li>

            <li><a href="#" id="BA2">Segundo Trimestre</a></li>

            <li><a href="#" id="BA3">Tercer Trimestre</a></li>

          </ul>

        </li>

        <li><a href="boletin_adm.php"><span class="icon-document"></span>Boletin Imprimir</a></li>

        

        <!--li><a href="licencias_adm.php"><span class="icon-document"></span>Licencias</a></li-->

        

        <li><a href="gestion_Utiles_adm.php"><span class="icon-document"></span>Lista Utiles</a></li>

        <li><a href="asistencia_alumnos.php"><span class="icon-document"></span>Asistencia Alumnos</a></li>

        

        

        

		<li class="submenu">

          <a href="#"><span class="icon-new-message"></span>Administrar Docente<span class="caret icon-chevron-down"></a>

          <ul class="children">

            <li><a href="gestion_prof_cur_mat.php" id="AM1">Asignar Materia</a></li>

            <li><a href="asistencia_docente.php">Asistencia</a></li>

          </ul>

        </li>	

		

		<li class="submenu">

          <a href="#"><span class="icon-new-message"></span>Administrar Curso<span class="caret icon-chevron-down"></a>

            <ul class="children">
                <li><a href="promedios.php" id="">Promedios</a></li>
                <li><a href="asignar_curso_materia.php" id="">Asignar Materia</a></li>

                <li><a href="reg_horario_curso.php" id="">Horario</a></li>

                <li><a href="clases_programadas_adm.php">Clases Programadas</a></li>

                <li><a href="clases_programadas_adm_fech.php">Clases Programadas Fecha</a></li>
                <li><a href="ver_clases_en_vivo_adm.php">Clases en Vivo</a></li>

          </ul>

        </li>

		

        <li class="submenu">

          <a href="#"><span class="icon-new-message"></span> Pr&aacute;cticos <span class="caret icon-chevron-down"></a>

          <ul class="children">

              <li><a href="#" id="practico_adm1">Primer Trimestre</a></li>

              <li><a href="#" id="practico_adm2">Segundo Trimestre</a></li>

              <li><a href="#" id="practico_adm3">Tercer Trimestre</a></li>

          </ul>

        </li>

        

        <li class="submenu">

          <a href="#"><span class="icon-new-message"></span>Material de apoyo<span class="caret icon-chevron-down"></a>

            <ul class="children">

                <li><a href="#" id="material_de_apoyo_adm1">Primer Trimestre</a></li>

                <li><a href="#" id="material_de_apoyo_adm2">Segundo Trimestre</a></li>

                <li><a href="#" id="material_de_apoyo_adm3">Tercer Trimestre</a></li>

            </ul>

        </li>
        <li class="submenu">
          <a href="#"><span class="icon-new-message"></span>Ver Evaluaciones <span class="caret icon-chevron-down"></a>
            <ul class="children">
              <li><a href="#" id="EVA1_adm">Primer Trimestre</a></li>
              <li><a href="#" id="EVA2_adm">Segundo Trimestre</a></li>
              <li><a href="#" id="EVA3_adm">Tercer Trimestre</a></li>
            </ul>
        </li>

		

		<li class="submenu">

          <a href="#"><span class="icon-new-message"></span>Administrar Alumnos<span class="caret icon-chevron-down"></a>

            <ul class="children">

                <li><a href="gestionar_alumnos.php" id="">Alumnos Habilitados</a></li>

                <li><a href="kardex.php" id="">Kardex de Pago</a></li>
                <li><a href="licencias_adm.php" id="">Licencias</a></li>
                <li><a href="solicitud_licencia_dir.php" id="">Solicitud de Licencia</a></li>

          </ul>

        </li>

        

        <li><a href="cam_cont.php"><span class="icon-document"></span>Cambiar Contraseña</a></li>

        <li class="submenu">

          <a href="#"><span class="icon-document"></span>Gestionar Reuniones<span class="caret icon-chevron-down"></a>

          <ul class="children">

              <li><a href="reuniones.php">Reunión General</a></li>

              <li><a href="#">Reunión Docentes</a></li>
              <li><a href="eventos_adm.php">Eventos</a></li>

          </ul>

        </li>
        <li><a href="#" id="eel"><span class="icon-video"></span>Evento en linea</a></li>
        <li><a href="direccion.php" id="btnSalir"><span class="icon-cross"></span>Salir</a></li>

      </ul>

    </nav>

  </header>

  <section id="wraper">

<script src="js/main_dir.js?v=<?php echo rand();?>"></script>

