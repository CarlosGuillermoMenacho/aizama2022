<?php

session_start();

require 'includes/config.php';

require 'includes/functions.php';

if(!cliente_activo()){

  header('Location: usuario.php');

  exit();

  }
require 'new_header.php';
?>

<link rel="stylesheet" href="node_modules/sweetalert2/dist/sweetalert2.css" >

<script src="node_modules/sweetalert2/dist/sweetalert2.all.min.js" ></script>
    <!-- Reseteo de css -->

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" integrity="sha512-oHDEc8Xed4hiW6CxD7qjbnI+B07vDdX7hEPTvn9pSZO1bcRqHp8mj9pyr+8RVC2GmtEfI2Bi9Ke9Ass0as+zpg==" crossorigin="anonymous" />

    

    <!-- Estilos personalizados -->

    <link rel="stylesheet" href="css/style_practicos_web.css">

    <link rel="stylesheet" href="css/style_clases_virtuales.css">


    <input type="hidden" id="codigoPractico">

    <div class="contenedor">

        <h1 class="titulo_principal" style="text-align:center;">Prácticos Web</h1>

        <div class="contenedor-lista">

          <h2 class="titulo-lista">Lista de materias</h2>

          <ul class="lista-materias">

            

          </ul>

        </div>

        

        <div class="contenedor-table" style="display:none">  

            <div class="contenedor-table">

              <table class="table">

                <thead>

                  <tr>

                    <th>Nro</th>

                    <th>Descripción</th>

                    <th>Ver</th>

                    <th>Nota</th>

                    <th>Presentación</th>

                  </tr>

                </thead>

                <tbody id="campos">

        

                </tbody>

              </table>

              <button class="btn" onclick="volverAtras()">Atrás</button>

            </div>

        </div>

        

        

        <div class="practico" style="display:none">

            <div class="practico__descripcion">

                <label for="">Descripción:</label>

                <input type="text" disabled>

            </div>

            <div class="grid-2">

                <div class="practico__curso">

                    <label for="">Curso:</label>

                    <input type="text" disabled>

                </div>

                <div class="practico__materia">

                    <label for="">Materia:</label>

                    <input type="text" disabled>

                </div>

            </div>



            <div class="preguntas">

                

            </div>



            <div class="container-button">

                <button class="btn-guardar" onclick="guardarPractico()">Guardar</button>

                <button onclick="atrasPractico()">Atrás</button>

            </div>

        </div>

        

    <div>

<script src="js/app_practicos_web.js?v=<?php echo(rand());?>"></script>
