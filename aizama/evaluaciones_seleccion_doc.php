<?php
session_start();
require "includes/functions.php";
if(!cliente_activo()){
    header("Location: docentes.php");
    exit();
}
require 'header.php';
?>
<link rel="stylesheet" type="text/css" href="css/evaluaciones_seleccion_doc.css?v=<?php echo rand();?>">
<div id="container" class="container">
    <div class="title" id="title-pag"><h1>Evaluaciones de Selección Múltiple<br><br>Gestión <?php echo (date("Y"));?></h1></div>
    <div class="div-materias" id="content-table">
        <!--h2 class="h-class-name">PRIMERO DE PRIMARIA - A</h2>
        <div class="div-materia">
            <div class="icon-name-materia">
                <img src="images/biologia.svg" class="icon-materia">
                <h2 class="materia-name">Biología</h2> 
            </div>
            <span class="span-materia">Evaluaciones <b>1</b></span>
        </div-->
    </div>
</div>
<div class="div-cursos-float">
    <div class="div-curso-float">
        <!--div class="div-curso">
            <img src="img/1.png" class="float-selected">
        </div-->
    </div>
</div>
<div class="div-formulario-evaluacion tarjeta oculto" id="formulario-evaluacion">
    <!--div class="btn-close">
        <img src="images/close.svg" onclick="close_formulario();">
    </div>
    <form id="formulario">
        <input type="hidden" name="codcur" value="20">
        <input type="hidden" name="codpar" value="1">
        <input type="hidden" name="codexa" value="55">
        <div class="div-title-formulario"><h2 style="font-size: .9em; color: var(--c1); text-align: center;">SEXTO DE SECUNDARIA - A</h2></div>
        <br>
        <div class="form-descrip-materia" style="display:flex;">
            <div style="width: 100%; display:flex; justify-content:space-between;">
                <p style="color:var(--c1);">Materia: Ciencias Naturales</p>
                <div>
                    Código: <input type="text" name="codmat" value="S2" class="input-info" readonly/>
                </div>                
            </div>
        </div>
        <br>
        <div style="display:flex; flex-wrap: nowrap; gap: 50px;">
            <div style="display: flex; align-items: center;">
                <div style="width: 89px;">Evaluación:</div>&nbsp;<input class="input-data" type="text"  name="nro_eva" value="1" style="width:30px; height:30px; text-align:center;">
            </div>
            <div style="display: flex; align-items: center;">
                <div>Preguntas a resolver:</div>&nbsp;<input class="input-data" type="text"  name="nro_eva" value="5" style="width:30px; height:30px; text-align:center;">
            </div>
        </div>
        <div class="div-inputs">
            <div>Indicador:</div>&nbsp;<textarea class="input-data" type="text"  name="indicador" style="width:100%; min-height: 70px; padding: 5px; font-size: 1em;"></textarea>
        </div>
        <div class="div-inputs">
            <div>Descripción:</div>&nbsp;<textarea class="input-data" type="text"  name="descripcion" style="width:100%; min-height: 70px; padding: 5px; font-size: 1em;"></textarea>
        </div>
        <div class="div-inputs">
            <div style="width: 89px;">Fecha inicio:</div>&nbsp;<input class="input-data" type="date"  name="fini" value="2023-04-21" style="width:150px; height:30px; text-align:center;">&nbsp;&nbsp;<input class="input-data" type="time" name="horaini" value="12:00" style="width:80px; height:30px; text-align:center;">
        </div>
        <div class="div-inputs">
            <div style="width: 89px;">Fecha fin:</div>&nbsp;<input class="input-data" type="date"  name="fini" value="2023-04-21" style="width:150px; height:30px; text-align:center;">&nbsp;&nbsp;<input class="input-data" type="time" name="horaini" value="12:00" style="width:80px; height:30px; text-align:center;">
        </div>
        <div style="text-align:center; margin-top: 30px;">
            <button class="submit">GUARDAR</button>
        </div>
        
    </form-->
</div>
    <!--div>
        <div class="div-evaluaciones">
            <div class="btn-close">
                <img src="images/close.svg" onclick="close_materia(15,1,'S10','Biologia');">
            </div>
            <h2 class="h-class-name materia-name" style="margin-bottom:10px;">Biologia</h2>
            <div class="div-evaluacion" id="S1013">
                                            <div class="data-evaluacion">
                                                <p><b>Evaluación: 1</b></p>
                                                <p class="descripcion"></p>
                                                <p class="descripcion">EvaluaciÃ³n de BiologÃ&shy;a: La cÃ©lula y sus organelos, La membrana: mecanismo de transporte. Lea atentamente, razone y elija la opciÃ³n correcta. Buena suerte !!</p>
                                                <p style="display: flex;flex-wrap: wrap;"><label style="width:100px; display: block;">Fecha inicio: </label>2023-03-15  01:00 hrs.</p>
                                                <p style="display: flex;flex-wrap: wrap;"><label style="width:100px; display: block;">Fecha fin: </label>2023-03-22  23:30 hrs.</p>
                                                <p>Preguntas a responder: 5</p>
                                                <p>Código: 13</p>
                                                <p>Visible: La evaluación está visible para los estudiantes.</p>
                                            </div>
                                            <div class="div-evaluacion-options oculto">
                                                <div class="div-option" style="font-size:.8em;" onclick="editar_evaluacion(13);">
                                                    Editar<img style="width:25px; cursor:pointer;" src="svg/editar.svg">
                                                </div>
                                                <div class="div-option" style="font-size:.8em;">
                                                    Revisar<img style="width:25px; cursor:pointer;" src="svg/cheque-de-boleta.svg">
                                                </div>
                                                <div class="div-option" style="font-size:.8em;">
                                                    Banco<img style="width:25px; cursor:pointer;" src="svg/votacion.svg" onclick="banco('S10',13)">
                                                </div>
                                                <div class="div-option" style="font-size:.8em;">
                                                    Config.<img style="width:25px; cursor:pointer;" src="svg/ajustes.svg">
                                                </div>
                                                <div class="div-option" style="font-size:.8em; color:var(--c3);">
                                                    Eliminar<img style="width:25px; cursor:pointer;" src="svg/basura.svg" onclick="delete_evaluacion(13);">
                                                </div>
                                            </div>
                                            <div class="div-banco">
                                                <div class="btn-close">
                                                    <img src="images/close.svg" onclick="banco('151S10');">
                                                </div>
                                                <h2 style="margin: 20px;">Banco de Preguntas</h2>
                                                
                                                <div class="div-pregunta" style="margin-top:10px;">
                                                    <h3>Pregunta 1</h3>
                                                    <form id="formulario-pregunta" style="background: #efefef; padding: 15px 5px; border-radius:5px;">
                                                        <div class="div-pregunta-img">
                                                            <textarea style="padding:5px; border-radius: 5px; border: 1px solid #ccc; height:55px; width: calc(100% - 60px);" class="input-data" title="Escribe una pregunta..." onkeyup="adjustHeight(this)">Aquí va la pregunta</textarea>
                                                            <div class="divtext input-data" style="width: calc(100% - 60px);" contentEditable>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                                                tempor incididunt ut labore et dolore magna aliqua.</div>
                                                            <div  style="display: flex; padding:3px; border: 1px solid #ccc; border-radius:5px;">
                                                                <img src="svg/imagen.svg" width="47px" style="cursor: pointer;" title="Selecciona una imagen para la pregunta...">
                                                                
                                                            </div>
                                                            <input type="file" name="imagen" style="display:none;">
                                                            
                                                        </div>
                                                        <h3>Opciones</h3>
                                                        <div id="opciones">
                                                            <div class="div-opcion">
                                                                <input type="radio" name="opcion" style="cursor: pointer;" title="Seleccionar como respuesta correcta...">
                                                                <input type="hidden" name="text-option">
                                                                <div class="divtext input-data" style="width: calc(100% - 50px);" contentEditable>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
                                                                <img src="images/close.svg" width="20px" style="cursor: pointer;" title="Eliminar opción...">
                                                            </div>
                                                            <div class="div-opcion">
                                                                <input type="radio" name="opcion" style="cursor: pointer;" title="Seleccionar como respuesta correcta..." />
                                                                <input type="hidden" name="text-option">
                                                                <div class="divtext input-data" style="width: calc(100% - 50px);" contentEditable>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
                                                                <img src="images/close.svg" width="20px" style="cursor: pointer;" title="Eliminar opción...">
                                                            </div>
                                                        </div>
                                                        <div class="div-add-opcion">
                                                            <img src="svg/agregar.svg" width="25px" title="Agregar una opción...">
                                                        </div>
                                                        <div class="div-tempo" style="font-size: .9em;">
                                                            Tiempo: <input class="input-data" type="text" name="tiempo" value="3" max="30" min="1" style="width:25px; padding: 3px;"> minutos.
                                                        </div>
                                                        <div class="btn-pregunta" style="padding: 10px; text-align: center; margin-top: 10px;">
                                                            <button class="submit2">GUARDAR</button>
                                                        </div>
                                                        <div class="btn-delete-float" style="text-align: end;">
                                                            <img style="position: relative; bottom: -10px; width:20px; cursor:pointer;" src="svg/basura.svg" onclick="delete_pregunta(65);" title="Eliminar pregunta.">
                                                        </div>
                                                    </form>
                                                </div>
                                                <div class="div-add" style="font-size:.8em">
                                                    <img src="svg/agregar-documento.svg" style="width:30px; cursor:pointer">Agregar Pregunta
                                                </div>
                                            </div>

                                        </div><div class="div-evaluacion" id="S1065">
                                            <div class="data-evaluacion">
                                                <p><b>Evaluación: 2</b></p>
                                                <p class="descripcion"></p>
                                                <p class="descripcion">EvaluaciÃ³n de DivisiÃ³n celular, metabolismo celular y respiraciÃ³n. Lea atentamete, razone y elija la respuesta correcta. Buena suerte!!!</p>
                                                <p style="display: flex;flex-wrap: wrap;"><label style="width:100px; display: block;">Fecha inicio: </label>2023-04-14  23:30 hrs.</p>
                                                <p style="display: flex;flex-wrap: wrap;"><label style="width:100px; display: block;">Fecha fin: </label>2023-04-22  23:00 hrs.</p>
                                                <p>Preguntas a responder: 5</p>
                                                <p>Código: 65</p>
                                                <p>Visible: La evaluación está visible para los estudiantes.</p>
                                            </div>
                                            <div class="div-evaluacion-options">
                                                <div class="div-option" style="font-size:.8em;" onclick="editar_evaluacion(65);">
                                                    Editar<img style="width:25px; cursor:pointer;" src="svg/editar.svg">
                                                </div>
                                                <div class="div-option" style="font-size:.8em;">
                                                    Revisar<img style="width:25px; cursor:pointer;" src="svg/cheque-de-boleta.svg">
                                                </div>
                                                <div class="div-option" style="font-size:.8em;">
                                                    Banco<img style="width:25px; cursor:pointer;" src="svg/votacion.svg" onclick="banco('S10',65)">
                                                </div>
                                                <div class="div-option" style="font-size:.8em;">
                                                    Config.<img style="width:25px; cursor:pointer;" src="svg/ajustes.svg">
                                                </div>
                                                <div class="div-option" style="font-size:.8em; color:var(--c3);">
                                                    Eliminar<img style="width:25px; cursor:pointer;" src="svg/basura.svg" onclick="delete_evaluacion(65);">
                                                </div>
                                            </div>
                                        </div>
            <div class="div-add"><img src="svg/agregar-documento.svg" style="width:30px; cursor:pointer" onclick="mostrar_formulario(15,1,'S10');">Agregar Evaluación</div></div>
    </div-->
<script type="text/javascript" src="js/evaluaciones_seleccion_doc.js?v=<?php echo rand();?>"></script>
