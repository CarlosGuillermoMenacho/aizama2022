<?php

session_start();

require 'includes/config.php';

$_SESSION['app_bimestre'] = 1;

if ($_SESSION['app_user_nivel']=='portero'){
    require 'header_por.php';
}else{
    require 'header_adm.php';
}

require 'includes/config.php';

$db = mysqli_connect($servername, $username, $password, $database) or die ('Error al intentar conectar con el servidor.');



$numbDia = date("N");

//Obteniendo el curso y paralelo del estudiante

$sql = "select cod_cur,cod_par from alumno where codigo=".$_SESSION['app_user_id'];

$result = mysqli_query($db,$sql);

$hora = "";

if($row=$result->fetch_object()){

    $codcur=$row->cod_cur;

    $codpar=$row->cod_par;

    if($numbDia==1)$sql="select lu_i as hora from hor_ent_salida where cod_cur=".$codcur." and cod_par=".$codpar." and estado=1";

    if($numbDia==2)$sql="select ma_i as hora from hor_ent_salida where cod_cur=".$codcur." and cod_par=".$codpar." and estado=1";

    if($numbDia==3)$sql="select mi_i as hora from hor_ent_salida where cod_cur=".$codcur." and cod_par=".$codpar." and estado=1";

    if($numbDia==4)$sql="select ju_i as hora from hor_ent_salida where cod_cur=".$codcur." and cod_par=".$codpar." and estado=1";

    if($numbDia==5)$sql="select vi_i as hora from hor_ent_salida where cod_cur=".$codcur." and cod_par=".$codpar." and estado=1";

    if($numbDia==6)$sql="select sa_i as hora from hor_ent_salida where cod_cur=".$codcur." and cod_par=".$codpar." and estado=1";

    if($numbDia<7){

        if($result = mysqli_query($db,$sql)){

            if($row1 = $result->fetch_object()){

            $hora  = $row1->hora;

            }else{

            $hora = "Sin hora";

            }

        }

    }else{

        $hora = "Hoy es Domingo no tienes clases";

    }

    

}

?>



<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" />

  <link rel="stylesheet" href="css/style_retrazo.css">

  <script type="text/javascript" src="js/jquery.min.js"></script>

  <script type="text/javascript" src="js/app_hora_retrazo.js?v=<?php echo(rand());?> "></script> 

</head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" integrity="sha512-nMNlpuaDPrqlEls3IX/Q56H36qvBASwb3ipuo3MxeWbsQB1881ox0cRv7UPTgBlriqoynt35KjEwgGUeUXIPnw==" crossorigin="anonymous" /> 
  <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js" integrity="sha512-2ImtlRlf2VVmiGZsjm9bEyhjGW4dU7B6TNwh/hx/iSByxNENtj3WVE6o/9Lj4TJeVXPi4bnOIMXFIJJAeufa0A==" crossorigin="anonymous"></script>

<body>

  <form action="" method="post" enctype="multipart/form-data" name="fGrabar" target="wPDFframe" id="fGrabar">

    <div class="container-box">

      <div class="container">

        <h1 class="text-center uppercase">Registro de ATRASOS</h1>

        <p>Hora de ingreso: <strong id="hora"><?=$hora;?></strong> </p>

        <div class="motivo" style="margin-bottom:20px">
              <label>Alumno:</label>
              <select id="select-alu">
                  <option value="">-- Seleccionar alumno --</option>
              </select>
        </div>
        <div class="motivo2" style="margin-bottom:20px">
            <label>Curso:</label>
            <input id="input-curso" type="text"  readonly size="30">
        </div>
        
        <div class="motivo3" style="margin-bottom:20px">
            <label>Codigo:</label>
            <input id="input-codigo" type="text"  readonly>
        </div>
      

        <div class="tiempo-widget">

          <iframe src="https://www.zeitverschiebung.net/clock-widget-iframe-v2?language=es&amp;timezone=America%2FLa_Paz" width="100%" height="130" frameborder="" seamless="seamless"></iframe>

        </div> 

        <input type="button" class="btn" id="btngrabar" value="grabar">

        <input type="hidden" id="nivel_alumno" value="<?=$_SESSION['app_user_perfil'];?>"/>
        
        <input type="hidden" id="dia_d" value="<?=$numbDia;?>"/>
        <input type="hidden" id="hora_col" value="<?=$hora;?>"/>
        
        <input type="hidden" id="codalu" value="<?=$_SESSION['app_user_id'];?>"/>
        <input type="hidden" id="nombre_curso" value="<?=$_SESSION['curso'];?>"/>
        <input type="hidden" id="nombre_alumno" value="<?=$_SESSION['app_user_name'];?>"/>
      </div>

    </div>

  </form>

</body>

</html>