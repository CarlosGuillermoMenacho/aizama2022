<?php 
$tr = "1t.png";
$t1 = "";
$t2 = "";
$t3 = "";
$logo = "img/user.svg";
isset($_SESSION["foto"])?$logo = $_SESSION["foto"]:$logo = $logo;
  switch ($_SESSION['app_user_bimestre']) {
    case '1':
      $tr = "1t.png";
      $t1 = "trimestre-selected";
      break;
    case '2':
      $tr = "2t.png";
      $t2 = "trimestre-selected";
      break;
    case '3':
      $tr = "3t.png";
      $t3 = "trimestre-selected";
      break;
    
    default:
      // code...
      break;
  }
?>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" lang="es" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Colegio Particular Aizama</title>
<link rel="icon" type="image/x-icon" href="images/logo.ico">
<link rel="stylesheet" href="css/colors.css?v=<?php echo rand(); ?>"> 
<link rel="stylesheet" href="css/new_header.css?v=<?php echo rand(); ?>"> 
</head>
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/new_header.js?v=<?php echo rand(); ?>"></script>
<body>
<input id="examen" type="hidden" value="<?=$_SESSION['usrimple'];?>" />
<input id="boletin" type="hidden" value="<?=$_SESSION['bdesktop'];?>" />
<!-- Cabecera -->
  <header>
    <div class="div-nombre-plataforma">
      <div class="icon-colegio">
        <img src="images/logo.png">
      </div>
      Colegio Particular Aizama
    </div>
    <div class="div-user">
      <div class="div-info-user">
        <div class="user-name">
          <?=$_SESSION['app_user_name'];?>
        </div>
        <div class="user-curso">
          <?=$_SESSION['curso'];?>
        </div>        
      </div>
      <div class="user-perfil">
        <img src="<?=$logo;?>">
      </div>
    </div>
    <div class="div-info-user-card oculto">
      <div class="info-user-card">
         <div class="close-session">
           <a href="usuario.php">Cerrar Sesión</a>
         </div> 
      </div>
    </div>
    <div class="div-menu">
      <img src="images/cuadricula.png" title="Menu">
    </div>
  </header>
  <div class="select-trimestre oculto">
    <div class="content-select-trimestre">
      <div class="btn-close1">
          <img src="images/close.svg" id="btn-close-st">
      </div>
      <h1 class="title">Elegir trimestre</h1>
      <div class="div-trimestres">
        <div class="div-trimestre <?php echo $t1?>" onclick="set_trimestre(1);">
          <div class="img-trimestre">
            <img src="images/1t.png?v=1">
          </div>
          <div class="div-text-trimestre">1er Trimestre</div>
        </div>
        <div class="div-trimestre <?php echo $t2?>" onclick="set_trimestre(2);">
          <div class="img-trimestre">
            <img src="images/2t.png">
          </div>
          <div class="div-text-trimestre">2do Trimestre</div>
        </div>
        <div class="div-trimestre <?php echo $t3?>" onclick="set_trimestre(3);">
          <div class="img-trimestre">
            <img src="images/3t.png">
          </div>
          <div class="div-text-trimestre">3er Trimestre</div>
        </div>
      </div>
    </div>
  </div>
  <nav class="navegation oculto">
    <table>
      <tbody>
        <tr>
          <td>
            <div class="div-menu-item" id="item-trimestre">
              <div class="div-icon-menu">
                <img src="images/<?php echo $tr ?>">
              </div>
              <div class="name-item">
                <a href="#">Trimestre</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="evento_en_linea();">
              <div class="div-icon-menu">
                <img src="images/meet.png">
              </div>
              <div class="name-item">
                <a href="#">Evento en línea</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('practicos_web_estudiante.php')">
              <div class="div-icon-menu">
                <img src="images/tarea.png">
              </div>
              <div class="name-item">
                <a href="#">Prácticos Web</a> 
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('practicos_secundaria.php')">
              <div class="div-icon-menu">
                <img src="images/tarea.png">
              </div>
              <div class="name-item">
                <a href="#">Práctico Digital</a>                
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('rol_de_examen_alu.php')">
              <div class="div-icon-menu">
                <img src="images/rol.png">
              </div>
              <div class="name-item">
                <a href="#">Rol de Exámenes</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('evaluacion_alumnos.php')">
              <div class="div-icon-menu">
                <img src="images/test.png">
              </div>
              <div class="name-item">
                <a href="#">Evaluación de Selección 5 preguntas</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('evaluacion_alumnos_10p.php')">
              <div class="div-icon-menu">
                <img src="images/test.png">
              </div>
              <div class="name-item">
                <a href="#">Evaluación de Selección 10 preguntas</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('evaluacion_escrita_alu.php')">
              <div class="div-icon-menu">
                <img src="images/test-write.avif">
              </div>
              <div class="name-item">
                <a href="#">Evaluación Escrita</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('evaluaciones_mixta_alu.php')">
              <div class="div-icon-menu">
                <img src="images/test-mix.png">
              </div>
              <div class="name-item">
                <a href="#">Evaluación Mixta</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('autoevaluaciones_alu.php')">
              <div class="div-icon-menu">
                <img src="images/diagnostic.png">
              </div>
              <div class="name-item">
                <a href="#">Auto Evaluación</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('material_apoyo_alumno.php')">
              <div class="div-icon-menu">
                <img src="images/support.png">
              </div>
              <div class="name-item">
                <a href="#">Material de Apoyo</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="Boletin()">
              <div class="div-icon-menu">
                <img src="images/libreta.png">
              </div>
              <div class="name-item">
                <a href="#">Boletín</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('calendario.php')">
              <div class="div-icon-menu">
                <img src="images/calendario-menu.png">
              </div>
              <div class="name-item">
                <a href="#">Calendario</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('biblioteca.php')">
              <div class="div-icon-menu">
                <img src="images/biblioteca.jpg">
              </div>
              <div class="name-item">
                <a href="#">Biblioteca Digital</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('horario_alumno.php')">
              <div class="div-icon-menu">
                <img src="images/horario.png">
              </div>
              <div class="name-item">
                <a href="#">Horario</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('informativo.php')">
              <div class="div-icon-menu">
                <img src="images/info.png">
              </div>
              <div class="name-item">
                <a href="#">Informativo</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('practicos_alumno.php')">
              <div class="div-icon-menu">
                <img src="images/sumary.png">
              </div>
              <div class="name-item">
                <a href="#">Resumen de Prácticos</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('evaluaciones_alumno.php')">
              <div class="div-icon-menu">
                <img src="images/test-report.png">
              </div>
              <div class="name-item">
                <a href="#">Resumen de Evaluaciones</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('devocional_alu.php')">
              <div class="div-icon-menu">
                <img src="images/pray.png">
              </div>
              <div class="name-item">
                <a href="#">Devocional</a>
              </div>
            </div>
          </td>
        </tr>
        
      </tbody>
    </table>
  </nav>
<!-- Contenido -->
  <section>
    

  