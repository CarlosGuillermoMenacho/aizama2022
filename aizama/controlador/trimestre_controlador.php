<?php 
session_start();
header("Content-Type: text/html;charset=utf-8");
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

switch ($_GET['op']) {
	case 'trimestre_actual'://Controla todos los profesores que no han tenido ninguna actividad en la plataforma
		$user = isset($_SESSION["app_user_id"])?$_SESSION["app_user_id"]:"";
		if(empty($user)){
			echo json_encode(array("status"=>"eSession"));
			exit();
		}
		require_once'../modelo/conexion.php';
		$db = Conectar::conexion();
		//Obteniendo la lista de profesores activos
		require_once'../modelo/modelo_trimestre.php';
		$Trimestre = new Trimestre($db);
		$result = $Trimestre->get_trimestre_actual();
		$trimestre = "";
		if($row = $result->fetch_object()){
			$trimestre = $row->trimestre;
		}
		echo json_encode(["status"=>"ok","data"=>$trimestre]);
		break;
}
?>