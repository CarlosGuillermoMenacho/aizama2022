<?php
session_start();
require"session_verify.php";
require 'header_adm.php';
?>
<link rel="stylesheet" type="text/css" href="css/colors.css?v=<?php echo rand()?>">
<link rel="stylesheet" type="text/css" href="css/actividades_adm.css?v=<?php echo rand()?>">
<img src="images/logo.png" class="logo-background">
<div class="main oculto">
	<div class="div-lista-materias">
		<div class="div-nombre-curso"><h1 id="nc">Seleccionar Curso</h1></div>
		<div class="content-list-materias oculto">
			<div class="lista-materias">
				<!--div class="card">
					<span class="card-materia">Matemáticas</span>
					<div class="info-prof">
						<span>Carlos Guillermo Menacho Zárate </span>
						<div class="contac-prof">
							<span class="underline">77367545</span>
							<img src="svg/whatsapp.svg" title="Abrir en whatsapp">
						</div>
					</div>
					<div class="contenido-actividades">
						<div class="item">
							<span class="underline">Evaluaciones</span>
							<span class="badget">1</span>
						</div>
						<div class="item">
							<span class="underline">Prácticos</span>
							<span class="badget">1</span>
						</div>
						<div class="item">
							<span class="underline">Material de apoyo</span>
							<span class="badget">10</span>
						</div>
					</div>
				</div-->
			</div>
		</div>
		<div class="div-lista-evaluaciones oculto">
			<div class="div-nombre-materia"><h1 id="mc">Material de apoyo de Matemáticas</h1></div>
			<div class="content-list-evaluaciones">
				<div class="lista-evaluaciones">
					<div class="card-evaluacion">
						<span class="no-material">No hay material</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="div-lista-cursos">
		<ul id="lista-cursos">
			<li>Nidito</li>
			<li>Kinder</li>
			<li>Prekinder</li>
			<li>Primero de Primaria</li>
			<li>Segundo de Primaria</li>
		</ul>
	</div>
</div>
<script type="text/javascript" src="js/actividades_adm.js?v=<?php echo rand()?>"></script>