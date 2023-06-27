<!DOCTYPE html>

<html lang="es">

<head>

  <meta charset="UTF-8">

  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">

  <title>Menú Porteria</title>

  <link rel="stylesheet" href="css/estiloDoc.css">

  <link rel="stylesheet" href="fonts/style.css">

  <script src="js/jquery.min.js"></script>

  <script src="js/main_adm.js"></script>
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

        <li><a href="ver_horario_adm.php"><span class="icon-mobile"></span>Horario Escolar</a></li>
        <li><a href="biblioteca.php"><span class="icon-mobile"></span>Biblioteca Digital</a></li>

        <li class="submenu">
          <a href="#"><span class="icon-new-message"></span>Registro Ingreso/Salida<span class="caret icon-chevron-down"></a>
          <ul class="children">
            <li><a href="ingresoQR.php" id="boletin_Adm1">Ingreso</a></li>
            <li><a href="salidaQR.php" id="boletin_Adm2">Salida</a></li>
          </ul>
        </li>
        <li><a href="registro_ingresos.php" id="">Registrar Ingreso</a></li>
        <li><a href="registro_salidas.php" id="">Registrar Salida</a></li>
                <li><a href="solicitud_licencia_adm.php" id="">Solicitud de Licencias</a></li>
                <li><a href="reg_atrazo.php" id="">Registrar Atrasos</a></li>

        

        <li><a href="cam_cont.php"><span class="icon-document"></span>Cambiar Contraseña</a></li>

        <li><a href="#" id="eel"><span class="icon-video"></span>Evento en linea</a></li>

        <li><a href="administracion.php" id="btnSalir"><span class="icon-cross"></span>Salir</a></li>

      </ul>

    </nav>

  </header>

  <section id="wraper">

    

