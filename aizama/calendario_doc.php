<?php
session_start();
require("header.php");
?>
<link rel="stylesheet" type="text/css" href="css/calendario_doc.css?v=<?php echo rand(); ?>">
<div class="container">
	<div class="title"><h1>Calendario Escolar</h1></div>
</div>
<div class="calendar-icon">
	<img src="img/calendario.png" onclick="calendar_show();">
</div>
<div class="main-div-calendario">
	<div class="div-info-fecha">
		<!--div class="div-dia-data">
			<h2>Viernes 22 de Abril</h2>
		</div>
		<div class="div-tarjeta-e">
			<div class="descripcion-actividad">Aniversario de Santa cruz de la Sierra <?php echo date("Y-m-d H:i:s",1675605600000) ?></div>
		</div>
		<div class="div-tarjeta-e">
			<div class="div-hora-actividad">07:40</div>
			<div class="descripcion-actividad">Evaluación de Selección</div>
			<div class="descripcion-actividad">Evaluación de Selección</div>
			<div class="descripcion-actividad">Evaluación de Selección</div>
			<div class="descripcion-actividad">Evaluación de Selección</div>
		</div-->
	</div>
	
	<div class="div-calendario">
		<table class="table-calendario">
		<div class="btn-close">
	        <img src="images/close.svg" onclick="close_form();" title="Cerrar">
	    </div>
			<thead>
				<tr>
					<td colspan="7">
						<div class="button-meses">
							<div id="mes-ant" class="mes-button" onclick="mes_anterior();">Marzo</div>
							<div id="mes-act" colspan="5" style="padding:10px 20px; font-size:1.4em;">Abril</div>
							<div id="mes-sig" class="mes-button" onclick="mes_siguiente();">Mayo</div>
						</div>
					</td>
				</tr>
				<tr>
					<td class="border-top">LU</td>
					<td class="border-td">MA</td>
					<td class="border-td">MI</td>
					<td class="border-td">JU</td>
					<td class="border-td">VI</td>
					<td class="border-td">SA</td>
					<td class="border-td">DO</td>
				</tr>
			</thead>
			<tbody id="body-calendario">
				<tr>
					<td class="border-top"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
				</tr>
				<tr>
					<td class="border-top"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
				</tr>
				<tr>
					<td class="border-top"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
				</tr>
				<tr>
					<td class="border-top"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
				</tr>
				<tr>
					<td class="border-top"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
					<td class="border-td"><span class="number-day">1</span></td>
				</tr>

			</tbody>
		</table>
	</div>
</div>
<script type="text/javascript" src="js/calendario_doc.js?v=<?php echo rand();?>"></script>