<?php
session_start();
require 'includes/config.php';
require "header.php";
?>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />

    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

    <!--link rel="stylesheet" href="css/style_evaluacion.css"-->

    <!-- <link rel="stylesheet" href="css/style_asignacion_class.css"> -->

    <script src="./js/table2excel.js"></script>

    <title>Document</title>



    <style>

    .vertical{

        writing-mode:vertical-lr;

        transform:rotate(180deg);

    }

        .btn {

            padding:10px 30px;

            background-color:teal;

            color:white;

            text-transform:uppercase;

            margin : 15px 0;

            font-weight:bold;

            border:none;

            border-radius:5px;

        }

        .select {

            margin-bottom:10px;

        }

        label {

            font-weight: bold;

            text-transform:uppercase;

        }

        .table td, .table th {

            padding: 12px 15px;

            border: 1px solid #006581;

            text-align: center;

        }

        .table td:nth-child(2) {

            text-align:left;

        }

        .table th {

            background-color: #043c5c;

            color: #ffffff;

        }

        .table tbody tr:nth-child(even) {

            background-color: #a3deee;

        }

        .contenedor h1{

            font-size:32px;

            text-align:center;

            margin:20px auto;

            text-transform:uppercase;

            color:teal;

        }

        @media (min-width: 768px) {

            .container-evaluacion {

                display:grid;

                grid-template-columns:repeat(2,1fr);

                column-gap:15px;

            }

        }

        @media (min-width: 768px) {

            .contenedor{

                max-width:950px;

                margin:0 auto;

            }

            .contenedor-selects {

                max-width:950px;

                margin:0 auto;

                display:grid;

                grid-template-columns: repeat(2, 1fr);

                column-gap:15px;

            }

        }



    </style>

</head>

<body>

    <div class="contenedor">

        <h1>Centralizador de Notas Trimestre: <?=$_SESSION['app_user_bimestre'];?></h1>

        <div class="contenedor-selects">

            <div class="select">

                <label for="">Curso</label>

                <select  id="seleccionar_Curso">

                    <option value="0">-- Seleccionar curso --</option>

                </select>

            </div>



            <!--div class="select">

                <label for="">Paralelo</label>

                <select  id="seleccionar_Paralelo">

                    <option value="0">-- Seleccionar paralelo --</option>

                </select>

            </div-->

        </div>



        <div class="contenedor-tabla" style="margin: 0 0 20px 0;"></div>   

        

        <template id="templateTable">

            <button type="button" id="exportarExcel" style="width:auto;"  class="btn">Exportar Excel</button>

            <table id="tableExcel" class="table" style="border-collapse: collapse;">

                <thead> 

                    <tr id="headerTablaBoletin">

                    </tr>

                </thead>

                <tbody id="filasTablaBoletin"></tbody>

            </table>

        </template>



    </div>



<script>

    $(document).ready(function() {

        $("#seleccionar_Curso").select2({width:"100%"});

    });

</script>

<script type="module" src="js/centralizador_online_doc.js?v=<?php echo rand();?>"></script>

</body>

</html>