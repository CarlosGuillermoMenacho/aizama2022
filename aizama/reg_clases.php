<?php

session_start();

require 'includes/config.php';

require 'includes/functions.php';

if(!cliente_activo()){

  header('Location: docentes.php');

  exit();

}

require 'header.php';

?>



<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Asignación Materia</title>

  <link rel="stylesheet" href="node_modules/sweetalert2/dist/sweetalert2.css" >

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg==" crossorigin="anonymous"></script>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" integrity="sha512-nMNlpuaDPrqlEls3IX/Q56H36qvBASwb3ipuo3MxeWbsQB1881ox0cRv7UPTgBlriqoynt35KjEwgGUeUXIPnw==" crossorigin="anonymous" />

  <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js" integrity="sha512-2ImtlRlf2VVmiGZsjm9bEyhjGW4dU7B6TNwh/hx/iSByxNENtj3WVE6o/9Lj4TJeVXPi4bnOIMXFIJJAeufa0A==" crossorigin="anonymous"></script>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" />

  <link rel="stylesheet" href="css/style_asignacion_class.css">

</head>
<style type="text/css">
 .content-day{
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: none;
  background: #f6f6f6;
  resize: vertical;
 }
.content-day:focus{
  outline: none !important;
}
</style>
<body>

    	<input type="hidden" name="id_usr" id="id_usr" value="<?=$_SESSION['app_user_id'];?>" readonly="readonly" size="3">



  <div class="contenedor">

    <h1 style="text-align:center;">Asignacion Clase Virtual Trimestre: <span><?=$_SESSION['app_user_bimestre'];?></span> </h1>

    <div class="contenedor-formulario">

      <form action="" name="formulario" id="formulario">

         <input type="hidden" name="codpar" id="codpar" value=""></input>

         <input type="hidden" name="codcur" id="codcur" value=""></input>

         <input type="hidden" name="codmat" id="codmat" value=""></input>

         <input type="hidden" name="id" id="id" value=""></input>

         

         

        <label>Profesor: <span><?=$_SESSION['app_user_ape'];?></span> <span><?=$_SESSION['app_user_nom'];?></span> </label>

        <div class="grid-3">

          <div class="selects">

            <label for="seleccionar_curso">curso:</label>

            <select name="seleccionar_curso" id="seleccionar_curso" required>

              <option value="0" > -- Seleccione el curso -- </option>

            </select>

          </div>

          <div class="selects">

            <label for="seleccionar_materia">materia:</label>

            <select name="seleccionar_materia" id="seleccionar_materia" required>

              <option value="0">-- Seleccione la materia -- </option>

            </select>

          </div>

          <!--div class="titulo" style="display: none;">

             <label>Titulo:</label>

             <input type="text" name="titulo" id="titulo" required >

          </div-->

        </div>

    

        <div class="enlace">

         <label>Enlace (Link):</label>

         <input type="text" name="enlace" id="enlace" required>

        </div>

        

        <label>Contenido del d&iacute;a</label>

        <textarea class="content-day" name="descripcion" id="descripcion" placeholder="Contenido del d&iacute;a" readonly></textarea>       

  

        <div class="grid-3">

          <div class="fecha">

            <label for="">Fecha:</label>

            <input type="date" id="fecha" name="fecha" value="" required>

          </div>



          <div class="hora-inicio">

            <label for="">Hora-Inicio:</label>

            <input type="time" id="hora_inicio" name="horaIni" required>

          </div>

    

          <hora-fin>

            <label for="">Hora-Fin:</label>

            <input type="time" id="hora_fin" name="horaFin" required>

          </hora-fin>

        </div>

        

        <div class="asignar-button">

        <input type="submit" class="btn" name="asignarMateria" id="asignarMateria" value="grabar" style="max-width:400px;" >

        </div>

        <div class="contenedor-boton-actualizar">

            <input type="submit" class="btn btn-actualizar" name="actualizarCampos" id="actualizarCampos" value="actualizar">

            <button class="btn btn-actualizar" name="cancelarActualizacion" id="cancelarActualizacion">CANCELAR</button>

        </div>

      </form>

    </div>



    <!-- Tabla general -->

    <div class="contenedor-tables" style="margin-bottom:15px;">

      <div class="contenedor-table-general">

        <table class="table">

          <thead>

            <th>Nro</th>

            <th>Título</th>

            <th>Descripción</th>

            <th>Fecha</th>

            <th>Hora Inicio</th>

            <th>Hora Fin</th>

            <th>Materia</th>

            <th>Ver</th>

            <th>Editar</th>

            <th>Eliminar</th>

          </thead>

          <tbody id=campos>

            

          </tbody>

        </table>

      </div>

      <!-- Tabla filtrada por materia -->

      <div class="contenedor-table-filtrada">

        <table class="table">

          <thead>

            <th>Nro</th>

            <th>Título</th>

            <th>Descripción</th>

            <th>Fecha</th>

            <th>Hora Inicio</th>

            <th>Hora Fin</th>

            <th>Ver</th>

            <th>Editar</th>

            <th>Eliminar</th>

          </thead>

          <tbody id=campos>

              

          </tbody>

        </table>

      </div>

    </div>

    </div>

    <script src="node_modules/sweetalert2/dist/sweetalert2.all.min.js" ></script>

    <script>

      $(document).ready(function() {

        $('#seleccionar_curso').select2( { width: '100%'} );

        $('#seleccionar_materia').select2( { width: '100%'} );

      });

    </script>

  <script src="js/asignacion_class_virtual.js?v=<?php echo(rand()); ?>"></script>

</body>

</html>