<?php

session_start();

require 'includes/config.php';

require 'includes/functions.php';

if(!cliente_activo()){

  header('Location: docentes.php');

  exit();

}

require 'header.php'

?>

<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Document</title>

  <script src="js/jquery.min.js"></script>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" />

  <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css" rel="stylesheet" />

  <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js"></script>

  <link rel="stylesheet" href="css/style_asignacion_practicos.css">

</head>

<body>

  <div class="container">

    

    <input type="hidden" id="trimestre" value="<?=$_SESSION['app_user_bimestre'];?>">



    <div class="home active">

      <h1>REGISTROS DE NOTAS TRIMESTRE: <?=$_SESSION['app_user_bimestre'];?></h1>

      <label>Profesor: <span><?=$_SESSION['app_user_ape'];?> <?=$_SESSION['app_user_nom'];?></span></label>

      <div class="container-selects">

        <div class="select">

          <label for="">Curso</label>

          <select name="seleccionar_curso" id="seleccionar_curso">

            <option value=""> --Seleccionar Curso-- </option>

          </select>

        </div>

        

        <div class="select">

          <label for="">Materia</label>

          <select name="seleccionar_materia" id="seleccionar_materia">

            <option value=""> --Seleccionar Materia-- </option>

          </select>

        </div>

      </div>



    </div>



    <div class="contenedor-tables">

      <!-- Contenedor de tabla primaria secundaria-->

      <div class="contenedor-table-general">

        <table class="table">

          <thead>

            <th>Nro</th>

            <th>Nombre</th>

            <th>Nota Boletín</th>
            <th>Nota Cuaderno P.</th>
            <th>Copiar</th>
          </thead>

          <tbody id=campos>

            <!-- Aqui se cargaran los alumnos dinamicamentes -->

          </tbody>

        </table>
        <div style="display:flex;justify-content: space-between;">
          <input type="button" value="Grabar Nota" class="btn btn_grabarNota">
          <input type="button" value="Copiar Todo" class="btn" onclick="copiar_todo();">
        </div>
      </div>

      <!-- Contenedor de tabla inicial -->

      <div class="contenedor-table-filtrada">

        <table class="table">

          <thead>

            <th>Nro</th>

            <th>Nombre</th>

            <th>Nota Literal</th>

          </thead>

          <tbody id=campos>

            <!-- Aqui se cargaran los alumnos dinamicamentes -->

          </tbody>

        </table>

        <input type="button" value="Grabar Nota" class="btn btn_grabarNota">


      </div>

    </div>

    

  </div>

  <script type="text/javascript">

    $('#seleccionar_curso').select2();

    $('#seleccionar_materia').select2();

  </script>

  <script src="js/get_notas2.js?v=<?php echo rand();?>"></script>

</body>

</html>