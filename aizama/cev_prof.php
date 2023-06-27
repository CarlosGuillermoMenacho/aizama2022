<?php
session_start();
require 'header.php';
?>
<link rel="stylesheet" type="text/css" href="css/cev_prof.css?v=<?php echo rand();?>">
<div class="content">
    <div class="title"><h1>Clases en Vivo</h1></div>
    <div class="main-div-escritorio">
        <div class="div-table-escritorio oculto">
            <table>
                <thead>
                    <tr>
                        <td>No.</td>
                        <td>Cursos</td>
                        <td>Enlace</td>
                    </tr>
                </thead>
                <tbody id="body-escritorio">
                    <tr>
                        <td class="index">1</td>
                        <td class="border-td2 center">PRIMERO DE SECUNDARIA A</td>
                        <td class="border-td pointer" ><a href="https://meet.com/asd-asas-fsa" target="_blank">https://meet.com/asd-asas-fsa</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="main-div-mobil">
        <div class="div-table-movil oculto">
            <table class="table-movil">
                <thead class="thead-movil">
                    <tr>
                        <td class="center">Curso</td>
                    </tr>
                </thead>
                <tbody class="tbody-movil" id="body-movil">
                    <tr>
                        <td class="border-td2 center">SEXTO DE SECUNDARIA</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
<script type="text/javascript" src="js/cev_prof.js?v=<?php echo rand();?>"></script>
