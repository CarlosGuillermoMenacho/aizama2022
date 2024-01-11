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
<link rel="stylesheet" href="css/new_header_doc.css?v=<?php echo rand(); ?>"> 
<link rel="stylesheet" href="node_modules/sweetalert2/dist/sweetalert2.css" >
<script src="node_modules/sweetalert2/dist/sweetalert2.all.min.js" ></script>
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
          <?=$_SESSION['app_user_name']." ".$_SESSION['app_user_nom'];?>
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
            <div class="div-menu-item" onclick="go_page('cuaderno_pedagogico_doc2.php')">
              <div class="div-icon-menu">
                <img src="images/cuaderno_pedagogico.png">
              </div>
              <div class="name-item">
                <a href="#">Cuaderno Pedagógico</a> 
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('centralizador_online_doc.php')">
              <div class="div-icon-menu">
                <img src="images/centralizador.png">
              </div>
              <div class="name-item">
                <a href="#">Centralizador</a>                
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('reg_material_apoyo.php')">
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
            <div class="div-menu-item" onclick="go_page('planificacion_doc.php')">
              <div class="div-icon-menu">
                <img src="images/planificacion.png">
              </div>
              <div class="name-item">
                <a href="#">Planificación de Actividades</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('agenda.php')">
              <div class="div-icon-menu">
                <img src="images/agenda.png">
              </div>
              <div class="name-item">
                <a href="#">Agenda Digital</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('reg_clases.php')">
              <div class="div-icon-menu">
                <img src="images/meet2.png">
              </div>
              <div class="name-item">
                <a href="#">Clase Virtual</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('cev_prof.php')">
              <div class="div-icon-menu">
                <img src="images/online.png">
              </div>
              <div class="name-item">
                <a href="#">Clase en Vivo</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('reg_practicos.php')">
              <div class="div-icon-menu">
                <img src="images/tarea.png">
              </div>
              <div class="name-item">
                <a href="#">Prácticos PDF</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('practicos_web_prof.php')">
              <div class="div-icon-menu">
                <img src="images/tarea.png">
              </div>
              <div class="name-item">
                <a href="#">Prácticos Web</a>
              </div>
            </div>
          </td>
        </tr>
        <?php 
          if($_SESSION["app_user_nivel"] == "Inicial"){
            echo '<tr>
                    <td>
                      <div class="div-menu-item" onclick="go_page(\'evaluaciones_inicial_doc.php\')">
                        <div class="div-icon-menu">
                          <img src="images/test.png">
                        </div>
                        <div class="name-item">
                          <a href="#">Evaluaciones</a>
                        </div>
                      </div>
                    </td>
                  </tr>';
          }
          else{
            echo '<tr>
                    <td>
                      <div class="div-menu-item" onclick="go_page(\'Evaluaciones_mixtas.php\')">
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
                      <div class="div-menu-item" onclick="go_page(\'evaluaciones_escritas.php\')">
                        <div class="div-icon-menu">
                          <img src="images/rol.png">
                        </div>
                        <div class="name-item">
                          <a href="#">Evaluación Escrita</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="div-menu-item" onclick="go_page(\'evaluaciones_seleccion_doc.php\')">
                        <div class="div-icon-menu">
                          <img src="images/test.png">
                        </div>
                        <div class="name-item">
                          <a href="#">Evaluación de Selección</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="div-menu-item" onclick="go_page(\'evaluaciones_vr2.php\')">
                        <div class="div-icon-menu">
                          <img src="images/calificacion.png">
                        </div>
                        <div class="name-item">
                          <a href="#">Notas de Exámenes de Selección</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="div-menu-item" onclick="go_page(\'reg_ser_decidir.php\')">
                        <div class="div-icon-menu">
                          <img src="images/serdecidir.png">
                        </div>
                        <div class="name-item">
                          <a href="#">Notas Ser y Decidir</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="div-menu-item" onclick="go_page(\'auto_evaluaciones.php\')">
                        <div class="div-icon-menu">
                          <img src="images/autoevaluacion.png">
                        </div>
                        <div class="name-item">
                          <a href="#">Auto Evaluaciones</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="div-menu-item" onclick="go_page(\'reg_notas1.php\')">
                        <div class="div-icon-menu">
                          <img src="images/notatrimestral.png">
                        </div>
                        <div class="name-item">
                          <a href="#">Notas Trimestrales</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="div-menu-item" onclick="go_page(\'top_calificaciones_doc.php\')">
                        <div class="div-icon-menu">
                          <img src="images/best.png">
                        </div>
                        <div class="name-item">
                          <a href="#">Mejores Notas</a>
                        </div>
                      </div>
                    </td>
                  </tr>';
          }
        ?>
        
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('gestion_Utiles.php')">
              <div class="div-icon-menu">
                <img src="images/listautiles.png">
              </div>
              <div class="name-item">
                <a href="#">Lista de Útiles</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('rol_de_examenes_doc.php')">
              <div class="div-icon-menu">
                <img src="images/rol.png">
              </div>
              <div class="name-item">
                <a href="#">Rol de Exámen</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('ingreso_prof.php')">
              <div class="div-icon-menu">
                <img src="images/es.png">
              </div>
              <div class="name-item">
                <a href="#">Registro de Entrada</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('salida_prof.php')">
              <div class="div-icon-menu">
                <img src="images/es.png">
              </div>
              <div class="name-item">
                <a href="#">Registro de Salida</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('reg_videos.php')">
              <div class="div-icon-menu">
                <img src="images/recording.png">
              </div>
              <div class="name-item">
                <a href="#">Clases Grabadas</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('vista_devocional.php')">
              <div class="div-icon-menu">
                <img src="images/pray.png">
              </div>
              <div class="name-item">
                <a href="#">Devicional</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('practicar_profe.php')">
              <div class="div-icon-menu">
                <img src="images/prueba.png">
              </div>
              <div class="name-item">
                <a href="#">Exámen de práctica</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('lista_usuario_clave.php')">
              <div class="div-icon-menu">
                <img src="images/users.png">
              </div>
              <div class="name-item">
                <a href="#">Usuarios y Claves</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('preinscripcion_doc.php')">
              <div class="div-icon-menu">
                <img src="images/registro.png">
              </div>
              <div class="name-item">
                <a href="#">Pre - Inscripciones</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('alu_plataforma.php')">
              <div class="div-icon-menu">
                <img src="images/student.png">
              </div>
              <div class="name-item">
                <a href="#">Verificar Alumnos</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('view_ver_agenda.php')">
              <div class="div-icon-menu">
                <img src="images/agenda.png">
              </div>
              <div class="name-item">
                <a href="#">Agenda</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('reuniones_doc.php')">
              <div class="div-icon-menu">
                <img src="images/reunion.png">
              </div>
              <div class="name-item">
                <a href="#">Reuniones</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('send_msg_multimedia_doc.php')">
              <div class="div-icon-menu">
                <img src="images/msn.png">
              </div>
              <div class="name-item">
                <a href="#">Mensajes Multimedia</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('biblioteca.php')">
              <div class="div-icon-menu">
                <img src="images/biblioteca.png">
              </div>
              <div class="name-item">
                <a href="#">Biblioteca</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('registro_libros.php')">
              <div class="div-icon-menu">
                <img src="images/gbiblio.png">
              </div>
              <div class="name-item">
                <a href="#">Gestionar Biblioteca</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('eventos_doc.php')">
              <div class="div-icon-menu">
                <img src="images/actividad.png">
              </div>
              <div class="name-item">
                <a href="#">Actividades</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('cam_cont_prof.php')">
              <div class="div-icon-menu">
                <img src="images/password.png">
              </div>
              <div class="name-item">
                <a href="#">Cambiar Contraseña</a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="div-menu-item" onclick="go_page('docentes.php')">
              <div class="div-icon-menu">
                <img src="images/close.svg">
              </div>
              <div class="name-item">
                <a href="#">Salir</a>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </nav>
<!-- Contenido -->
  <section>
    

  