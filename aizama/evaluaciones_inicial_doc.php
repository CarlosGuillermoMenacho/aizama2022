<?php
session_start();
require "includes/functions.php";
if(!cliente_activo()){
    header("Location: docentes.php");
    exit();
}
require 'header.php';
?>
<link rel="stylesheet" type="text/css" href="css/evaluacion_inicial_doc.css?v=<?php echo rand();?>">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<div id="main-container" class="main-container">
    <div class="title" id="title-pag"><h1>Evaluaciones Inicial<br>Gestión <?php echo (date("Y"));?></h1></div>
    <div class="container mt-3">
	  <!--div class="card" >
	    <img class="card-img-top" src="images/actividad1.png" alt="Card image" style="width:100%">
	    <div class="card-body">
	      <h4 class="card-title">Actividad 1</h4>
	      <p class="card-text">Some example text some example text. John Doe is an architect and engineer</p>
	      <a href="#" class="btn btn-primary">Revisar</a>
	    </div>
	  </div-->
	</div>
</div>



<script type="text/javascript" src="js/evaluacion_inicial_actividades_doc.js?v=<?php echo rand();?>"></script>
