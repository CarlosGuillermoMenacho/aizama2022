<?php
session_start();
require_once"session_verify.php";
    if($_SESSION['app_user_id']==16){
        require 'header_dir.php';
    }else{
        require 'header_adm.php';
    }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Select2 estilos a los select para los buscadores -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" integrity="sha512-nMNlpuaDPrqlEls3IX/Q56H36qvBASwb3ipuo3MxeWbsQB1881ox0cRv7UPTgBlriqoynt35KjEwgGUeUXIPnw==" crossorigin="anonymous" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js" integrity="sha512-2ImtlRlf2VVmiGZsjm9bEyhjGW4dU7B6TNwh/hx/iSByxNENtj3WVE6o/9Lj4TJeVXPi4bnOIMXFIJJAeufa0A==" crossorigin="anonymous"></script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" />

    <!-- Sweet alert estilos a las alertas -->
    <link rel="stylesheet" href="node_modules/sweetalert2/dist/sweetalert2.css" >
    <script script src="node_modules/sweetalert2/dist/sweetalert2.all.min.js" ></script>

    <link rel="stylesheet" href="css/style_asignacion_class.css">
    <style>
        @media(min-width: 1024px) {
            .alinear-izquierda {
                text-align:left !important;
            }
        }

        input:not([type="submit"]) {
            height: auto;
        }
        .container-general {
            max-width:1000px; 
            margin:0 auto;
            width:95%;
        }
        /* Selects */
        @media(min-width: 768px) {
            .contenedor-selects {
                display:grid;
                grid-template-columns:30% 25% 45%;
                column-gap:15px;
            }
        }
        .contenedor-selects .select {
            margin-bottom:15px;
        }
        
        /* Nombre alumnos */
        .container-nombre-alumno {
            margin: 10px 0;
        }
        @media (min-width: 768px) {
            .container-nombre-alumno {
                display:grid;
                display: -ms-grid;
                grid-template-columns:30% 30% 40%;
                column-gap:10px;
            }
        }
        .nombre-alumno {
            margin-bottom:10px;   
        }
        /* Select Alumnos */
        .container-select-alumno {
            margin-bottom:15px;
        }
        @media (min-width: 768px) {
            .container-select-alumno {
                display:grid;
                display: -ms-grid;
                grid-template-columns: 60% 40%;
                column-gap:15px;
            }
        }
        /* Switches */
        .container-checkbox {
            margin-bottom:20px;
        }
        @media (min-width: 768px) {
            .container-checkbox {
                display:grid;
                grid-template-columns: repeat(3, 1fr);
                column-gap:15px;
            }
        }
        .switch {
            position:relative;
            display:inline-block;
            width:55px;
            height:28px;
        }
        
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
        }
        input:checked + .slider {
            background-color: #2196F3;
        }
        input:focus + .slider {
            box-shadow: 0 0 1px #2196F3;
        }
        input:checked + .slider:before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(26px);
        }
        .slider.round {
            border-radius:34px;
        }
        .slider.round:before {
            border-radius: 50%;
        }
        .title {
            font-size: 32px;
            text-align: center;
            margin: 15px auto;
        }


        .sk-chase {
            margin-top:20px;
            width: 40px;
            height: 40px;
            position: relative;
            animation: sk-chase 2.5s infinite linear both;
        }

        .sk-chase-dot {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0; 
            animation: sk-chase-dot 2.0s infinite ease-in-out both; 
        }

        .sk-chase-dot:before {
            content: '';
            display: block;
            width: 25%;
            height: 25%;
            background-color: black;
            border-radius: 100%;
            animation: sk-chase-dot-before 2.0s infinite ease-in-out both; 
        }

        .sk-chase-dot:nth-child(1) { animation-delay: -1.1s; }
        .sk-chase-dot:nth-child(2) { animation-delay: -1.0s; }
        .sk-chase-dot:nth-child(3) { animation-delay: -0.9s; }
        .sk-chase-dot:nth-child(4) { animation-delay: -0.8s; }
        .sk-chase-dot:nth-child(5) { animation-delay: -0.7s; }
        .sk-chase-dot:nth-child(6) { animation-delay: -0.6s; }
        .sk-chase-dot:nth-child(1):before { animation-delay: -1.1s; }
        .sk-chase-dot:nth-child(2):before { animation-delay: -1.0s; }
        .sk-chase-dot:nth-child(3):before { animation-delay: -0.9s; }
        .sk-chase-dot:nth-child(4):before { animation-delay: -0.8s; }
        .sk-chase-dot:nth-child(5):before { animation-delay: -0.7s; }
        .sk-chase-dot:nth-child(6):before { animation-delay: -0.6s; }

        @keyframes sk-chase {
            100% { transform: rotate(360deg); } 
        }

        @keyframes sk-chase-dot {
            80%, 100% { transform: rotate(360deg); } 
        }

        @keyframes sk-chase-dot-before {
            50% {
                transform: scale(0.4); 
            } 100%, 0% {
                transform: scale(1.0); 
            } 
        }
        input {
            padding:10px;
        }



    </style>    
    <title>Document</title>
</head>
<body>
    
    <div class="container-loader" style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; with:100vw;">
        <img src="./images/logo.png" alt="logo" width="300px">
        <div class="sk-chase">
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
        </div> <!-- Animacion loader -->
    </div>

    <div class="container-general">
        <h1 class="title-principal title">Alumnos Habilitados</h1>
        <div class="contenedor-selects">
            <div class="selects">
                <label for="">Curso</label>
                <select  id="seleccionar_Curso">
                    <option value="">-- Seleccionar curso --</option>
                </select>
            </div>
            <div class="selects">
                <label for="">Paralelo</label>
                <select  id="seleccionar_Paralelo">
                    <option value="">-- Seleccionar paralelo --</option>
                </select>
            </div>
            <div class="selects">
                <label for="">Alumno</label>
                <select  id="seleccionar_Alumno">
                    <option value="">-- Seleccionar Alumno --</option>
                </select>
            </div>
        </div>
        <div class="contenedor-tables ">
            <div class="contenedor-table-general" style="display:block; margin:15px 0;">
                <table class="table">
                    <thead>
                        <th>Nro</th>
                        <th>Nombre</th>
                        <th>Información</th>
                    </thead>
                    <tbody id=campos>
                        <!-- Se cargaran dinamicamente -->
                    </tbody>
                </table>
            </div>
        </div>
        <div class="formulario-alumno" style="display: none;">
            <form id="form">
                <h1 class="title">Datos del Alumno</h1>
                <div class="container-nombre-alumno">
                    <div class="nombre-alumno">
                        <label for="paterno">Paterno</label>
                        <input type="text" required name="paterno" id="paterno">
                    </div>
                    <div class="nombre-alumno">
                        <label for="materno">Materno</label>
                        <input type="text" required name="materno" id="materno">
                    </div>
                    <div class="nombre-alumno">
                        <label for="nombres">Nombres</label>
                        <input type="text" required name="nombres" id="nombres">
                    </div>
                </div>
                
                <h2 style="text-align:center; text-transform:uppercase; margin-bottom:10px;">Tutores</h2>
                <div style="display:flex; justify-content:center; flex-direction:column; align-items:center; margin-bottom:20px;">
                    <table class="table" style="border-collapse: collapse; margin-bottom:10px;">
                        <thead>
                            <th>Nombre</th>
                            <th>Cedula Identidad</th>
                            <th>Celular</th>
                            <th>Eliminar</th>
                        </thead>
                        <tbody id="rowTutores">
                            <!-- Se cargaran dinamicamente -->
                        </tbody>
                    </table>
                    <div class="container-buttons">
                        <button id="showSelectsTutor" type="button">
                            <img src="images/btn-agregar.svg" alt="icon" width="35px">
                        </button>
                    </div>
                </div>

                <div class="container-selectTutor" style="display:flex; justify-content:center; align-items:center; margin-bottom:20px;">
                    <select name="" id="seleccionar_Tutor" style="width:300px;">
                        <option value="" selected>-- Seleccione un tutor --</option>
                    </select>
                    <button id="hiddenSelectsTutor" type="button" style="margin-left:10px;">
                        <img src="images/close.svg" alt="icon" width="35px">
                    </button>
                </div>
                <div class="container-select-alumno">
                    <div style="margin-bottom:10px;">
                        <label for="curso_alumno">Curso</label>
                        <select  id="curso_alumno" name="codcur"></select>
                    </div>
                    <div style="margin-bottom:10px;">
                        <label for="paralelo_alumno">Paralelo</label>
                        <select  id="paralelo_alumno" name="codpar"></select>
                    </div>
                </div>
                <div class="container-select-alumno">
                    <div style="margin-bottom:10px;">
                        <label for="nombre_usuario">Usuario</label>
                        <input type="text" required name="usuario" id="nombre_usuario">
                    </div>
                    <div style="margin-bottom:10px;">
                        <label for="clave">Clave</label>
                        <input type="text" required name="clave" id="clave">
                    </div>
                </div>
                <div class="container-checkbox">
                    <div style="display:flex; align-items:center; margin-bottom:15px;">
                        <div style="display:flex; align-items:center;" >
                            <img src="images/boletin_icon.svg" alt="icono" width="50px">
                            <h3 style="font-weight:normal; margin-left:10px">Boletín</h3>
                        </div>
                        <label class="switch" style="margin-left:10px;">
                            <input type="checkbox" name="boletin" id="boletin" style="opacity:0; width:0; height:0;">
                            <span class="slider round"></span>
                        </label>
                    </div><!-- Boletin -->
                    <div style="display:flex; align-items:center; margin-bottom:15px;">
                        <div style="display:flex; align-items:center;" >
                            <img src="images/icon-examen.svg" alt="icono" width="50px">
                            <h3 style="font-weight:normal; margin-left:10px">Evaluación</h3>
                        </div>
                        <label class="switch" style="margin-left:10px;">
                            <input type="checkbox" name="evaluacion" id="evaluacion" style="opacity:0; width:0; height:0;">
                            <span class="slider round"></span>
                        </label>
                    </div> <!-- Evaluacion -->
                    <div style="display:flex; align-items:center; margin-bottom:15px;">
                        <div style="display:flex; align-items:center;" >
                            <img src="images/plataforma_icon.svg" alt="icono" width="50px">
                            <h3 style="font-weight:normal; margin-left:10px">Plataforma</h3>
                        </div>
                        <label class="switch" style="margin-left:10px;">
                            <input type="checkbox" name="plataforma" id="plataforma" style="opacity:0; width:0; height:0;">
                            <span class="slider round"></span>
                        </label>
                    </div> <!-- Plataforma -->
                </div>
            
                <div style="display:flex; justify-content:center; margin-bottom:20px;">
                    <input type="submit" class="btn" value="Actualizar" style="width:auto; font-weight:bold; margin:0; margin-right:15px;">
                    <input type="button" value="Atras" id="backForm" style="width:auto;margin:0; background-color:#006581!important; padding:10px 30px; color:white; text-transform:uppercase; border:none; font-weight:bold;">
                </div>
            </form>
        </div>
    </div>
    
    <script>
        document.querySelector('.container-general').style.display = 'none';
        document.addEventListener("DOMContentLoaded", ()=> {
            document.querySelector(".container-selectTutor").style.display="none";
            
            /* Boton atras */
            const btnBack = document.querySelector('#backForm');
            btnBack.addEventListener('click', ()=> {
                document.querySelector(".contenedor-table-general").style.display = "block";
                document.querySelector(".contenedor-selects").style.display = "grid";
                document.querySelector(".formulario-alumno").style.display = "none";;
                document.querySelector(".title-principal").style.display = "block";;
                
            });

            /* Mostrar selects tutors */
            const btnShowSelectTutor = document.querySelector('#showSelectsTutor');
            btnShowSelectTutor.addEventListener('click', ()=> {
                $('#seleccionar_Tutor').val("");
                $(`#select2-seleccionar_Tutor-container`).text($(`#seleccionar_Tutor :selected`).text());
                document.querySelector(".container-selectTutor").style.display="flex";
                document.querySelector(".container-buttons").style.display="none";
            });
            /* Ocultar selects tutors */
            const btnHiddenSelectTutor = document.querySelector('#hiddenSelectsTutor');
            btnHiddenSelectTutor.addEventListener('click', ()=> {
                document.querySelector(".container-selectTutor").style.display="none";
                document.querySelector(".container-buttons").style.display="flex";
            });
        });
    </script>
    <script type="module" src="js/alumnos_habilitados.js?v=<?php echo(rand()); ?>"></script>
</body>
</html>