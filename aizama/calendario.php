<?php 
session_start();
require 'includes/config.php';
require 'includes/functions.php';
if (!cliente_activo()) {
  header("Location: usuario.php");
  exit();
}
if($_SESSION['app_user_perfil'] == 'SECUNDARIA') {
    require 'header_sec.php';
} 
if($_SESSION['app_user_perfil'] == 'PRIMARIA' || $_SESSION['app_user_perfil'] == 'INICIAL' ) {
  require 'header_prim.php';
} 
?>
<link rel="stylesheet" type="text/css" href="css/calendario.css?v=<?php echo rand();?>">
<div class="contenedor">
	<h1 class="titulo">Calendario Académico</h1>
	<div class="content-box">
		<div class="container-actividades" id="div_actividades">
			<div class="head-calendar">
				<img id="last2" src="svg/caret-left.svg">
				<div class="mes" id="nombreMes2">Marzo</div>
				<img id="next2" src="svg/caret-right.svg">
			</div>
			<div id="content-acti">
            <input type="hidden" id="input-codalu" value="<?php echo $_SESSION['app_user_id']?>"/>
			</div>
		</div>
		<div class="cont-calendar">
			<div class="head-calendar">
				<img id="last" src="svg/caret-left.svg">
				<div class="mes" id="nombreMes">Marzo</div>
				<img id="next" src="svg/caret-right.svg">
			</div>
			<div class="dias-semana" id="caja-mes">
				<div class="dia">Domingo</div>
				<div class="dia">Lunes</div>
				<div class="dia">Martes</div>
				<div class="dia">Miércoles</div>
				<div class="dia">Juéves</div>
				<div class="dia">Viernes</div>
				<div class="dia">Sábado</div>
				<div class="caja-dia"><div class="numero-dia">1</div></div>
				<div class="caja-dia"><div class="numero-dia">2</div></div>
				<div class="caja-dia"><div class="numero-dia">3</div></div>
				<div class="caja-dia"><div class="numero-dia">4</div></div>
				<div class="caja-dia"><div class="numero-dia">5</div></div>
				<div class="caja-dia"><div class="numero-dia">6</div></div>
				<div class="caja-dia"><div class="numero-dia">7</div></div>
				<div class="caja-dia"><div class="numero-dia">8</div></div>
				<div class="caja-dia"><div class="numero-dia">9</div></div>
				<div class="caja-dia"><div class="numero-dia">10</div></div>
				<div class="caja-dia"><div class="numero-dia">11</div></div>
				<div class="caja-dia"><div class="numero-dia">12</div></div>
				<div class="caja-dia"><div class="numero-dia">13</div></div>
				<div class="caja-dia"><div class="numero-dia">14</div></div>
				<div class="caja-dia"><div class="numero-dia">15</div></div>
				<div class="caja-dia"><div class="numero-dia">16</div></div>
				<div class="caja-dia"><div class="numero-dia">17</div></div>
				<div class="caja-dia"><div class="numero-dia">18</div></div>
				<div class="caja-dia"><div class="numero-dia">19</div></div>
				<div class="caja-dia"><div class="numero-dia">20</div></div>
				<div class="caja-dia"><div class="numero-dia">21</div></div>
				<div class="caja-dia"><div class="numero-dia">22</div></div>
				<div class="caja-dia"><div class="numero-dia">23</div></div>
				<div class="caja-dia"><div class="numero-dia">24</div></div>
				<div class="caja-dia"><div class="numero-dia">25</div></div>
				<div class="caja-dia"><div class="numero-dia">26</div></div>
				<div class="caja-dia"><div class="numero-dia">27</div></div>
				<div class="caja-dia"><div class="numero-dia">28</div></div>
				<div class="caja-dia"><div class="numero-dia">29</div></div>
				<div class="caja-dia"><div class="numero-dia">30</div></div>
				<div class="caja-dia"><div class="numero-dia">31</div></div>
				<div class="caja-dia"><div class="numero-dia">32</div></div>
				<div class="caja-dia"><div class="numero-dia">33</div></div>
				<div class="caja-dia"><div class="numero-dia">34</div></div>
				<div class="caja-dia"><div class="numero-dia">35</div></div>
			</div>
		</div>
	</div>
</div>
<script type="text/javascript" src="js/calendario.js?v=<?php echo rand();?>"></script>