<?php 
session_start();
header("Content-Type: text/html;charset=utf-8");
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
require '../includes/functions.php';

if(!cliente_activo()){
	echo json_encode(["status" => "eSession"]);
	exit();
}
switch ($_GET['op']) {
	case 'getAsistenciaHoy':
		$codusr = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
		if (empty($codusr)) {
			echo json_encode(array('status' => "eSession"));
			exit();
		}
		require_once'../modelo/conexion.php';
		$db = Conectar::conexion();

		require_once"../modelo/modelo_asistencia_profesor.php";
		$Asistencia_Profesor = new Asistencia_Profesor($db);

		$fecha = date("Y-m-d");
		$result = $Asistencia_Profesor->get_asistencia($codusr,$fecha);
		if ($fetch = $result->fetch_object()) {
			require_once'funciones.php';
			$dia = getdialiteral ($fecha);
			$hora = $fetch->hora;
			echo json_encode(["status"=>"ok","data"=>["fecha"=>$fecha,"dia" => $dia,"hora"=>$hora]]);
		}else{
			echo json_encode(["status"=>"noData"]);
		}
		break;
	case 'getSalidaHoy':
		$codusr = isset($_SESSION['app_user_id'])?$_SESSION['app_user_id']:"";
		if (empty($codusr)) {
			echo json_encode(array('status' => "eSession"));
			exit();
		}
		require_once'../modelo/conexion.php';
		$db = Conectar::conexion();

		require_once"../modelo/modelo_asistencia_profesor.php";
		$Asistencia_Profesor = new Asistencia_Profesor($db);

		$fecha = date("Y-m-d");
		$result = $Asistencia_Profesor->get_salida($codusr,$fecha);
		if ($fetch = $result->fetch_object()) {
			require_once'funciones.php';
			$dia = getdialiteral ($fecha);
			$hora = $fetch->hora;
			echo json_encode(["status"=>"ok","data"=>["fecha"=>$fecha,"dia" => $dia,"hora"=>$hora]]);
		}else{
			echo json_encode(["status"=>"noData"]);
		}
		break;
	default:

		break;
}
?>