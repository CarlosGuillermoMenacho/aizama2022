<?php 
session_start();
header("Content-Type: text/html;charset=utf-8");
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
require '../includes/functions.php';
require_once'../modelo/conexion.php';
$db = Conectar::conexion();
$_tipo_user = isset($_GET['usr'])&&!empty($_GET['usr'])?$_GET['usr']:"";
if (empty($_tipo_user)){
	echo "errorGET";
	exit();
}
if(!cliente_activo()){
	if ($_tipo_user=='doc') {
		header("Location: ../docentes.php");
	}
	if ($_tipo_user=='alu') {
		header("Location: ../usuario.php");
	}
	if ($_tipo_user=='adm') {
		header("Location: ../administracion.php");
	}
	exit();
}

if ($_GET) {
	switch ($_GET['op']){

		case 'getFechasMes'://Obtener todas las fechas de un mes
			
			$mes = isset($_POST['mes'])?$_POST['mes']:"";
			if(empty($mes)){
				echo "errorParam";
				exit();
			}
			$year = date("Y");
			require '../modelo/modelo_diasFestivos.php';
			$fechas = new DiasFestivos($db);
			$resultado = $fechas->getFechas($mes,$year);
			$lista = array();
			for ($i=0; $i < count($resultado); $i++) { 
				$lista[substr($resultado[$i]['fecha'],8,2)] = $resultado[$i]['descripcion'];
			}
			echo json_encode($lista);

			break;
	}
}else{
	echo "errorGET";
}
?>