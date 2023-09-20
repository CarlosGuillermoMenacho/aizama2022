<?php
session_start();
require "includes/functions.php";
if(!cliente_activo()){
    header("Location: docentes.php");
    exit();
}
require 'header.php';
?>
<link rel="stylesheet" type="text/css" href="css/rendimiento_doc.css?v=<?php echo rand();?>">
<link rel="stylesheet" type="text/css" href="css/select2.min.css">
<div class="main-container">
    <div class="title">
        <h1>Control de Rendimiento Estudiantil</h1>
    </div>
    <div class="boxs">
        <div id="menu-cursos" class="box-menu">
            <!--div class="div-categoria">
                <h2>Cursos</h2>
            </div>
            <div class="item-curso">
                PRIMERO DE PRIMARIA - A
            </div-->
        </div>
        <div id="actividades" class="box-menu">
            <!--div class="div-categoria">
                <h2>Actividades</h2>
            </div>
            <div id="a1" class="item-curso" onclick="ver_actividad(1)">
                Carrera 100 m. planos
            </div>
            <div id="a2" class="item-curso" onclick="ver_actividad(2)">
                Carrera 50 m. planos
            </div>
            <div id="a3" class="item-curso" onclick="ver_actividad(3)">
                Natación 100 m. libre
            </div>
            <div id="a4" class="item-curso" onclick="ver_actividad(4)">
                Ejercicios de habilidad motríz,
                con salto de distancia
            </div>
            <div class="div-button-add">
                <img width="30px" src="images/plus.png" title="Agregar actividad" onclick="nueva_actividad()">
            </div-->
        </div>
        <div class="box-content">    
            <div class="header-actividad">
            </div>
            <div class="div-lista-alumnos">
                <!--div class="head-actividad">
                    <h2>Carrera de 100 m. planos.</h2>
                </div>
                <div class="lista-alumnos">
                    <table class="table">
                        <thead>
                            <tr>
                                <td style="width:5%">No.</td>
                                <td style="width:35%">Estudiante</td>
                                <td style="width:15%">Marca Actual</td>
                                <td style="width:15%">Evaluar</td>
                                <td style="width:30%">Observación</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="width:5%">1</td>
                                <td style="width:35%">ALBA DERMITH MARIOLY ALEJANDRA</td>
                                <td style="width:15%">57.350 seg</td>
                                <td style="width:15%"><img style="cursor: pointer;" width="40px" src="img/cronometro.png"></td>
                                <td style="width:30%">
                                    <div class="div-textarea">
                                        <textarea>Buen rendimiento</textarea>                                
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="width:5%">2</td>
                                <td style="width:35%">ALBA DERMITH MARIOLY ALEJANDRA</td>
                                <td style="width:15%">102.18 segundos</td>
                                <td style="width:15%"><img style="cursor: pointer;" width="40px" src="img/cronometro.png"></td>
                                <td style="width:30%">
                                    <div class="div-textarea">
                                        <textarea>Buen rendimiento</textarea>                                
                                    </div></td>
                            </tr>
                            <tr>
                                <td style="width:5%">3</td>
                                <td style="width:35%">ALBA DERMITH MARIOLY ALEJANDRA</td>
                                <td style="width:15%">150.23 seg</td>
                                <td style="width:15%"><img style="cursor: pointer;" width="40px" src="img/cronometro.png"></td>
                                <td style="width:30%">
                                    <div class="div-textarea">
                                        <textarea>Buen rendimiento</textarea>                                
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="width:5%">4</td>
                                <td style="width:35%">ALBA DERMITH MARIOLY ALEJANDRA</td>
                                <td style="width:15%">57.350 seg</td>
                                <td style="width:15%"><img style="cursor: pointer;" width="40px" src="img/cronometro.png"></td>
                                <td style="width:30%">
                                    <div class="div-textarea">
                                        <textarea>Buen rendimiento</textarea>                                
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="width:5%">4</td>
                                <td style="width:35%">ALBA DERMITH MARIOLY ALEJANDRA</td>
                                <td style="width:15%">57.350 seg</td>
                                <td style="width:15%"><img style="cursor: pointer;" width="40px" src="img/cronometro.png"></td>
                                <td style="width:30%">
                                    <div class="div-textarea">
                                        <textarea>Buen rendimiento</textarea>                                
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="width:5%">4</td>
                                <td style="width:35%">ALBA DERMITH MARIOLY ALEJANDRA</td>
                                <td style="width:15%">57.350 seg</td>
                                <td style="width:15%"><img style="cursor: pointer;" width="40px" src="img/cronometro.png"></td>
                                <td style="width:30%">
                                    <div class="div-textarea">
                                        <textarea>Buen rendimiento</textarea>                                
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="width:5%">4</td>
                                <td style="width:35%">ALBA DERMITH MARIOLY ALEJANDRA</td>
                                <td style="width:15%">57.350 seg</td>
                                <td style="width:15%"><img style="cursor: pointer;" width="40px" src="img/cronometro.png"></td>
                                <td style="width:30%">
                                    <div class="div-textarea">
                                        <textarea>Buen rendimiento</textarea>                                
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="width:5%">4</td>
                                <td style="width:35%">ALBA DERMITH MARIOLY ALEJANDRA</td>
                                <td style="width:15%">57.350 seg</td>
                                <td style="width:15%"><img style="cursor: pointer;" width="40px" src="img/cronometro.png"></td>
                                <td style="width:30%">
                                    <div class="div-textarea">
                                        <textarea>Buen rendimiento</textarea>                                
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="width:5%">4</td>
                                <td style="width:35%">ALBA DERMITH MARIOLY ALEJANDRA</td>
                                <td style="width:15%">57.350 seg</td>
                                <td style="width:15%"><img style="cursor: pointer;" width="40px" src="img/cronometro.png"></td>
                                <td style="width:30%">
                                    <div class="div-textarea">
                                        <textarea>Buen rendimiento</textarea> 
                                        <div class="div-option-text">
                                            <img src="images/check.svg" title="Guardar" width="25px" style="cursor:pointer;">                               
                                            <img src="images/close.svg" title="Cancelar" width="25px" style="cursor:pointer;">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div-->
            </div>        
                
        </div>
    </div>
</div>
<div class="div-formulario oculto">
    <form id="formulario" class="formulario">
        <div class="title"><h1>Registrar Nueva Actividad</h1></div>
        <label class="label-form">Curso</label>
        <textarea id="ta-curso" placeholder="Descripción de la actividad..." readonly>PRIMERO DE SECUNDARIA - A</textarea>
        <label class="label-form">Actividad</label>
        <textarea id="ta-actividad" placeholder="Descripción de la actividad..."></textarea>
        <label class="label-form">Tipo de evaluación</label>
        <div class="div-checks-eval">
            <div class="div-check-label">
                <p style="padding-bottom: 5px; font-size :.85em; font-weight: 500;">Tiempo</p>
                <div>
                    <input type="radio" name="acti" value="Tiempo">
                </div>
            </div>
            <div class="div-check-label">
                <p style="padding-bottom: 5px; font-size :.85em; font-weight: 500;">Nota</p>
                <div>
                    <input type="radio" name="acti" value="Tiempo">
                </div>
            </div>
            <div class="div-check-label">
                <p style="padding-bottom: 5px; font-size :.85em; font-weight: 500;">Texto</p>
                <div>
                    <input type="radio" name="acti" value="Tiempo">
                </div>
            </div>
            <div class="div-check-label">
                <p style="padding-bottom: 5px; font-size :.85em; font-weight: 500;">Distancia</p>
                <div>
                    <input type="radio" name="acti" value="Tiempo">
                </div>
            </div>
            <div class="div-check-label">
                <p style="padding-bottom: 5px; font-size :.85em; font-weight: 500;">Distancia</p>
                <div>
                    <input type="radio" name="acti" value="Tiempo">
                </div>
            </div>
        </div>
        <div class="div-button-form">
            <img width="35px" src="images/check.svg" title="Guardar" onclick="save_actividad()">
            <img width="35px" src="images/close.svg" title="Cancelar" onclick="close_form()">
        </div>
    </form>
</div>
<div class="div-formulario2 oculto">

    <div class="div-main-crono">
        <div class="div-crono-display formulario">
            <div class="btn-close">
                <img src="images/close.svg" onclick="close_cronometro();">
            </div>
            <h2 style="text-align:center;">CRONÓMETRO</h2>
            <p style="text-align:center;" id="Alumno">Carlos Guillermo Menacho Zárate</p>
            <div class="crono-display"><h2 id="Minutos">00</h2>:<h2 id="Segundos">00</h2>:<h2 id="Centesimas">00</h2></div>
            <div class="div-button-crono">
                <button class="btn-submit" onclick="iniciar_reloj()">Iniciar</button>                
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="js/select2.min.js"></script>
<script type="text/javascript" src="js/rendimiento_doc.js?v=<?php echo rand();?>"></script>