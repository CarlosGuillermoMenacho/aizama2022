<?php
session_start();
require"session_verify.php";
if ($_SESSION['app_user_nivel']=='portero'){

    require 'header_por.php';

}else{

    require 'header_adm.php';

}

?>

<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>ASIGNACION MATERIA CURSOS</title>

  <link rel="stylesheet" href="node_modules/sweetalert2/dist/sweetalert2.css" >

  <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css" rel="stylesheet" />

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" />

  <link rel="stylesheet" href="css/style_asignar_curso_materia_adm.css">

  

</head>

<body>

  <div class="contenedor">

    <h1>Horario de Clases por curso</h1>



    <div class="contenedor-selects">

      <div class="select">

        <label for="">cursos</label>

        <select name="seleccionar_curso" id="seleccionar_curso">

          <option value=""> -- seleccionar curso -- </option>

        </select>

      </div>

      <div class="select">

        <label for="">Paralelo</label>

        <select name="seleccionar_paralelo" id="seleccionar_paralelo">

          <option value="">  -- seleccionar paralelo -- </option>

        </select>

      </div>

    </div>



    <style>

    	.contenedor2 {

    		max-width: 900px;

    		margin:0 auto;

    		margin-top:100px;

    

    	}

    	@media (max-width:765px) {

    		.contenedor2 {

    			margin-top:50px;

    			max-width: 1200px;

    			width:1200px;

    			height:1200px;

    		}

    	}

    </style>



    <div align="center">

    	<div class="contenedor2">

    		<img  id="image" src="" width="100%">

    	</div>

    </div>





  </div>



  <script src="node_modules/sweetalert2/dist/sweetalert2.all.min.js" ></script>

  <script src="js/jquery.min.js" ></script>

  <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js"></script>

  <script type="text/javascript">

    $(document).ready(function() {

      $('#seleccionar_curso').select2();

      $('#seleccionar_paralelo').select2();

    });

  </script>

  <script src="js/ver_horario_adm.js"></script>





</body>

</html>