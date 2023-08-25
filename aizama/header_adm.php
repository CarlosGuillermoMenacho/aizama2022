<!DOCTYPE html>

<html lang="es">

<head>

  <meta charset="UTF-8">

  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">

  <title>Menú Administrativo</title>

  <link rel="stylesheet" href="css/header_adm.css?v=<?php echo rand(); ?>">

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
        <li><a href="#" id="eel"><div class="div-name-item"><span class="icon-video"></span>Evento en linea</div></a></li>
        <li><a href="ver_horario_adm.php"><div class="div-name-item"><span class="icon-mobile"></span>Horario Escolar</div></a></li>
        <li><a href="cuadro_estadistico_adm.php"><div class="div-name-item"><span class="icon-mobile"></span>Estadísticas</div></a></li>
        <li><a href="calendario_academico.php"><div class="div-name-item"><span class="icon-mobile"></span>Calendario Académico</div></a></li>
        <li><a href="biblioteca.php"><div class="div-name-item"><span class="icon-mobile"></span>Biblioteca Digital</div></a></li>
        <li><a href="agenda_adm.php"><div class="div-name-item"><span class="icon-mobile"></span>Agenda Digital</div></a></li>
        <li><a href="lista_usuario_clave_adm.php"><div class="div-name-item"><span class="icon-mobile"></span>Lista Usuarios y Clave</div></a></li>
        <li class="submenu">
          <a href="#"><div class="div-name-item"><span class="icon-new-message"></span>Mejores Notas</div><div class="downarrow"><span class="caret icon-chevron-down"></span></div></a>
          <ul class="children">
            <li><a href="#" id="BN1">Primer Trimestre</a></li>
            <li><a href="#" id="BN2">Segundo Trimestre</a></li>
            <li><a href="#" id="BN3">Tercer Trimestre</a></li>
          </ul>
        </li>
        <li class="submenu">
          <a href="#"><div class="div-name-item"><span class="icon-new-message"></span>Registro Ingreso/Salida</div><div class="downarrow"><span class="caret icon-chevron-down"></span></div></a>
          <ul class="children">
            <li><a href="ingresoQR.php" id="boletin_Adm1">Ingreso</a></li>
            <li><a href="salidaQR.php" id="boletin_Adm2">Salida</a></li>
          </ul>
        </li>
        <li class="submenu">
          <a href="#"><div class="div-name-item"><span class="icon-new-message"></span>Reportes</div><div class="downarrow"><span class="caret icon-chevron-down"></span></div></a>
          <ul class="children">
            <li><a href="reportes_adm.php">Lista De Tutores</a></li>
            <li><a href="reporte_mensualidades.php">Reporte de Mensualidades</a></li>
          </ul>
        </li>
        <li><a href="ver_agenda_adm.php"><div class="div-name-item"><span class="icon-open-book"></span>Ver Agenda</div></a></li>

        <!--<li><a href="boletin_adm.php"><span class="icon-document"></span>Boletin de notas</a></li>-->

        <li class="submenu">

          <a href="#"><div class="div-name-item"><span class="icon-new-message"></span>Rol de Ex&aacute;menes</div><div class="downarrow"><span class="caret icon-chevron-down"></span></div></a>

          <ul class="children">

            <li><a href="#" id="ROLE1">Primer Trimestre</a></li>

            <li><a href="#" id="ROLE2">Segundo Trimestre</a></li>

            <li><a href="#" id="ROLE3">Tercer Trimestre</a></li>

          </ul>

        </li>
        <li class="submenu">

          <a href="#"><div class="div-name-item"><span class="icon-new-message"></span>Centralizador Bolet&iacute;n</div><div class="downarrow"><span class="caret icon-chevron-down"></span></div></a>

          <ul class="children">

            <li><a href="#" id="centralizador_boletin1">Primer Trimestre</a></li>

            <li><a href="#" id="centralizador_boletin2">Segundo Trimestre</a></li>

            <li><a href="#" id="centralizador_boletin3">Tercer Trimestre</a></li>

          </ul>

        </li>
    	<li class="submenu">

          <a href="#"><div class="div-name-item"><span class="icon-new-message"></span>Centralizador<br>Cuaderno Pedag.</div><div class="downarrow"><span class="caret icon-chevron-down"></span></div></a>

          <ul class="children">

            <li><a href="#" id="boletin1">Primer Trimestre</a></li>

            <li><a href="#" id="boletin2">Segundo Trimestre</a></li>

            <li><a href="#" id="boletin3">Tercer Trimestre</a></li>

          </ul>

        </li>
        <li class="submenu">

          <a href="#"><div class="div-name-item"><span class="icon-new-message"></span>Cuaderno Pedag&oacute;gico</div><div class="downarrow"><span class="caret icon-chevron-down"></span></div></a>

          <ul class="children">

            <li><a href="#" id="cuader_Adm1">Primer Trimestre</a></li>

            <li><a href="#" id="cuader_Adm2">Segundo Trimestre</a></li>

            <li><a href="#" id="cuader_Adm3">Tercer Trimestre</a></li>

          </ul>

        </li>
        <li><a href="boletin_adm.php"><div class="div-name-item"><span class="icon-document"></span>Boletin Imprimir</div></a></li>

        

        <!--li><a href="licencias_adm.php"><span class="icon-document"></span>Licencias</a></li-->

        
        <li><a href="planificacion_adm.php"><div class="div-name-item"><span class="icon-document"></span>Planificaci&oacute;n de Actividades</div></a></li>
        <li><a href="gestion_Utiles_adm.php"><div class="div-name-item"><span class="icon-document"></span>Lista Utiles</div></a></li>


		<li class="submenu">

          <a href="#"><div class="div-name-item"><span class="icon-new-message"></span>Administrar Docente</div><div class="downarrow"><span class="caret icon-chevron-down"></span></div></a>

          <ul class="children">

            <li><a href="gestion_prof_cur_mat.php" id="AM1">Asignar Materia</a></li>

            <li><a href="asistencia_docente.php">Asistencia</a></li>

          </ul>

        </li>	

		

		<li class="submenu">

          <a href="#"><div class="div-name-item"><span class="icon-new-message"></span>Administrar Curso</div><div class="downarrow"><span class="caret icon-chevron-down"></span></div></a>

            <ul class="children">
                <li><a href="promedios.php" id="">Promedios</a></li>
                <li><a href="asignar_curso_materia.php" id="">Asignar Materia</a></li>

                <li><a href="reg_horario_curso.php" id="">Horario(Verano/Invierno)</a></li>
                <li><a href="clases_programadas_adm.php">Clases Programadas</a></li>

                <li><a href="clases_programadas_adm_fech.php">Clases Programadas Fecha</a></li>
                <li><a href="ver_clases_en_vivo_adm.php">Clases en Vivo</a></li>
                <li><a href="send_msg_multimedia_adm.php">Mensajes Multimedia</a></li>

          </ul>

        </li>
    <li class="submenu">

          <a href="#"><div class="div-name-item"><span class="icon-new-message"></span>Administrar Alumnos</div><div class="downarrow"><span class="caret icon-chevron-down"></span></div></a>

            <ul class="children">
                <li><a href="add_student.php" id="">Registro de Alumnos</a></li>
                <li><a href="gestion_alumnos_adm.php" id="">Alumnos Habilitados</a></li>
                <li><a href="kardex.php" id="">Kardex de Pago</a></li>
                <li><a href="licencias_adm.php" id="">Licencias</a></li>
                <li><a href="solicitud_licencia_adm.php" id="">Solicitud de Licencias</a></li>
                <li><a href="reg_atrazo.php" id="">Registrar Atrasos</a></li>
                <li><a href="lista_blocked.php" id="">Preincripciones</a></li>
                <li><a href="asistencia_alumnos.php">Asistencia Alumnos</a></li>
                <li><a href="foto_perfil_alumnos.php">Foto Perfil</a></li>
          </ul>

        </li>
		

        <li class="submenu">

          <a href="#"><div class="div-name-item"><span class="icon-new-message"></span>Pr&aacute;cticos </div><div class="downarrow"><span class="caret icon-chevron-down"></span></div></a>

          <ul class="children">

              <li><a href="#" id="practico_adm1">Primer Trimestre</a></li>

              <li><a href="#" id="practico_adm2">Segundo Trimestre</a></li>

              <li><a href="#" id="practico_adm3">Tercer Trimestre</a></li>

          </ul>

        </li>

        

        <li class="submenu">

          <a href="#"><div class="div-name-item"><span class="icon-new-message"></span>Material de apoyo</div><div class="downarrow"><span class="caret icon-chevron-down"></span></div></a>

            <ul class="children">

                <li><a href="#" id="material_de_apoyo_adm1">Primer Trimestre</a></li>

                <li><a href="#" id="material_de_apoyo_adm2">Segundo Trimestre</a></li>

                <li><a href="#" id="material_de_apoyo_adm3">Tercer Trimestre</a></li>

            </ul>

        </li>
        <li class="submenu">
          <a href="#"><div class="div-name-item"><span class="icon-new-message"></span>Ver Evaluaciones </div><div class="downarrow"><span class="caret icon-chevron-down"></span></div></a>
            <ul class="children">
              <li><a href="#" id="EVA1_adm">Primer Trimestre</a></li>
              <li><a href="#" id="EVA2_adm">Segundo Trimestre</a></li>
              <li><a href="#" id="EVA3_adm">Tercer Trimestre</a></li>
            </ul>
        </li>

		

		

        

        <li><a href="cam_cont.php"><div class="div-name-item"><span class="icon-document"></span>Cambiar Contraseña</div></a></li>
        
        <li class="submenu">

          <a href="#"><div class="div-name-item"><span class="icon-document"></span>Gestionar Reuniones</div><div class="downarrow"><span class="caret icon-chevron-down"></span></div></a>

          <ul class="children">

              <li><a href="reuniones.php">Reunión General</a></li>

              <li><a href="#">Reunión Docentes</a></li>
              <li><a href="eventos_adm.php">Eventos</a></li>

          </ul>

        </li>
        
        <li><a href="imagen_inicio.php"><div class="div-name-item"><span class="icon-document"></span>Gestionar Imagen</div></a></li>
        <li><a href="#" id="btnSalir"><div class="div-name-item"><span class="icon-cross"></span>Cerrar Sesión</div></a></li>

      </ul>

    </nav>

  </header>

  <section id="wraper">

    
  <script src="js/main_adm.js?v=<?php echo rand();?>"></script>

