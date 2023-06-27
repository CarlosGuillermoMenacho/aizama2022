<?php
session_start();

require 'includes/config.php';

require 'includes/functions.php';

if(!cliente_activo()){

  header('Location: docentes.php');

  exit();

}

$_SESSION['app_bimestre'] = 1;



require 'header.php';

?>

<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="stylesheet" href="css/style_ingreso_salida.css">

  

</head>

<body>

  <form action="grabar_nota1.php" method="post" enctype="multipart/form-data" name="fGrabar" target="wPDFframe" id="fGrabar">

    <div class="container-box">

      <div class="container">

        <h1 class="text-center uppercase no-margin">Registro de entrada al colegio</h1>

        <p style="margin-top:15px">Profesor: <strong><?=$_SESSION['app_user_ape'].' '.$_SESSION['app_user_nom'];?></strong> </p>

      

        <div class="tiempo-widget">

          <iframe src="https://www.zeitverschiebung.net/clock-widget-iframe-v2?language=es&amp;timezone=America%2FLa_Paz" width="100%" height="130" frameborder="" seamless="seamless"></iframe>

        </div> 

        <input type="button" class="btn" id="btngrabar" value="grabar">

        <input type="hidden" id="nivel_alumno" value="<?=$_SESSION['app_user_perfil'];?>"/>

        <input type="hidden" id="codalu" value="<?=$_SESSION['app_user_id'];?>"/>

      </div>

    </div>

  </form>

</body>
<script type="text/javascript" src="js/jquery.min.js"></script>

  <script type="text/javascript" src="js/app_hora_ingreso_prof.js?v=<?php echo rand();?>"></script>
</html>