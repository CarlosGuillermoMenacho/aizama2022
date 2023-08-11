<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Plantel</title>
	<link rel="stylesheet" type="text/css" href="css/plantel.css?v=<?php echo rand();?>">
</head>
<body>
<div class="title">
	<h1>Plantel Educativo</h1>
</div>	
<div class="main-div">
	<div class="card-div">
		<div class="cuadro-div">
			<img src="img/user.svg">
		</div>
		<div class="info-div">
			<p class="nombre">Luis Dennar Carrillo</p>
			<label>Asignaturas</label>
		</div>
	</div>
	
</div>
<div class="car-asignatura oculto">
	<div class="btn-close">
        <img src="images/close.svg" onclick="close_form();">
    </div>
	<div class="div-perfil-docente">
		<img src="img/user.svg">
	</div>
	<div class="nombre-docente">
		Luis Dennar Carrillo
	</div>
	<div class="info-asignaturas">
		<h3>Primero de Secundaria - A</h3>
		<div class="materias">
			<p>Matematicas</p>
			<p>Matematicas</p>
			<p>Matematicas</p>
		</div>
	</div>
	<div class="info-asignaturas">
		<h3>Primero de Secundaria - A</h3>
		<div class="materias">
			<p>Matematicas</p>
			<p>Matematicas</p>
			<p>Matematicas</p>
		</div>
	</div>
</div>
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/plantel.js?v=<?php echo rand();?>"></script>
</body>
</html>